const express = require('express');
const router = express.Router();
const { BlogServiceImpl } = require('../services/BlogService');
const blogService = new BlogServiceImpl();

// Import centralized cache helpers
const { redisSafeGet, redisSafeSetEx } = require('../utils/redisHelper');
const { authenticateAdmin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const mongoose = require('mongoose');

// --- Routes ---

// Get all published blogs
router.get('/', async (req, res) => {
  const cacheKey = 'blogs:list';

  try {
    let cached = await redisSafeGet(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return res.json(Array.isArray(parsed) ? { blogs: parsed } : parsed);
    }

    const posts = await blogService.getPublished();
    await redisSafeSetEx(cacheKey, 300, JSON.stringify(posts));

    res.json({ blogs: posts });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  const cacheKey = `blog:post:${req.params.slug}`;

  try {
    let cached = await redisSafeGet(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const post = await blogService.getBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Set content_type to markdown for proper rendering
    const response = {
      ...post,
      content_type: 'markdown',
      html: null,
    };

    await redisSafeSetEx(cacheKey, 300, JSON.stringify(response));
    res.json(response);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- ADMIN PROTECTED ROUTES ---

// Create blog post
router.post(
  '/',
  authenticateAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      // Extract userId from the authenticated admin
      const userId = req.admin.id;
      const username = req.admin.username;
      
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({ message: 'Unauthorized: Invalid user ID' });
      }

      const { title, content, excerpt, tags, status, slug } = req.body;
      
      // Handle file upload if present
      let featured_image = null;
      if (req.file) {
        featured_image = req.file.buffer.toString('base64');
      }

      const newPost = await blogService.create({
        title,
        content,
        excerpt,
        tags,
        status,
        slug,
        featured_image,
        authorId,
        authorName: username
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      
      if (error.message === 'Invalid or missing userId from token') {
        return res.status(401).json({ 
          message: 'Authentication error. Please log in again.',
          error: error.message 
        });
      }
      
      if (error.code === 11000 && error.keyPattern?.slug) {
        return res.status(409).json({ 
          message: 'A blog post with this slug already exists',
          error: 'DUPLICATE_SLUG' 
        });
      }
      
      res.status(500).json({
        message: 'Failed to create blog post. Please try again.',
        error: error.message,
      });
    }
  }
);

module.exports = router;