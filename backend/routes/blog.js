const express = require('express');
const router = express.Router();
const { BlogServiceImpl } = require('../services/BlogService');
const blogService = new BlogServiceImpl();
const redisClient = require('../config/redisClient');

router.get('/', async (req, res, next) => {
  try {
    const posts = await blogService.getPublished();
    res.json({ blogs: posts });
  } catch (error) {
    next(error);
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  const cacheKey = `blog:post:${req.params.slug}`;

  let cached = null;

  if(redisClient){
  cached = await redisClient.get(cacheKey);
  }

  if (cached) return res.json(JSON.parse(cached));
  try {
    const post = await blogService.getBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    // Set content_type to markdown for proper rendering
    const response = { 
      ...post, 
      content_type: 'markdown',
      html: null 
    };

    if(redisClient){
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));
    }
    res.json(response);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 