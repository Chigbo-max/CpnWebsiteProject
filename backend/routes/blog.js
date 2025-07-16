const express = require('express');
const router = express.Router();
const db = require('../config/database').default;
const BlogService = require('../services/BlogService');
const blogService = new BlogService(db);

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, excerpt, slug,featured_image, status, created_at FROM blog_posts WHERE status = $1 ORDER BY created_at DESC',
      ['published']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
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
    // Render HTML template for the blog post
    const html = BlogService.renderBlogTemplate({
      title: post.title,
      author: post.author_id || 'CPN Team',
      date: post.created_at,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featured_image
    });
    res.json({ ...post, html });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 