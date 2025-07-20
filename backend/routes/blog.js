const express = require('express');
const router = express.Router();
const db = require('../config/database');
const BlogService = require('../services/BlogService');
const blogService = new BlogService(db);
const redisClient = require('../config/redisClient');

// Get all blog posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await db.query(
      'SELECT id, title, excerpt, slug, featured_image, status, created_at FROM blog_posts WHERE status = $1 ORDER BY created_at DESC',
      ['published']
    );
    res.json(posts.rows);
  } catch (error) {
    next(error);
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  const cacheKey = `blog:post:${req.params.slug}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  try {
    const { slug } = req.params;
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND status = $2',
      [slug, 'published']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const post = result.rows[0];
    
    // Set content_type to markdown for proper rendering
    const response = { 
      ...post, 
      content_type: 'markdown',
      html: null // Don't use HTML template, let frontend handle markdown
    };
    
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));
    res.json(response);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 