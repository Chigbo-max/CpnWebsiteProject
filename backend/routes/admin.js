const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');
const nodemailer = require('nodemailer');

// Create blog post
router.post('/blog', auth, async (req, res) => {
  try {
    const { title, content, excerpt, slug } = req.body;
    const authorId = req.admin.id;

    if (!title || !content || !slug) {
      return res.status(400).json({ message: 'Title, content, and slug are required' });
    }

    const result = await db.query(
      'INSERT INTO blog_posts (title, content, excerpt, slug, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, excerpt, slug, authorId]
    );

    res.status(201).json({
      message: 'Blog post created successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contact inquiries
router.get('/inquiries', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM contact_inquiries ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Respond to inquiry
router.put('/inquiries/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_response } = req.body;

    const result = await db.query(
      'UPDATE contact_inquiries SET admin_response = $1, status = $2, responded_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [admin_response, 'responded', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({
      message: 'Response sent successfully',
      inquiry: result.rows[0]
    });
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all subscribers
router.get('/subscribers', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM subscribers ORDER BY subscribed_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send newsletter
router.post('/newsletter', auth, async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    // Get all subscribers
    const subscribers = await db.query('SELECT email, name FROM subscribers');
    
    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email to each subscriber
    const emailPromises = subscribers.rows.map(subscriber => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: subject,
        html: `
          <h2>${subject}</h2>
          <p>Dear ${subscriber.name || 'Valued Subscriber'},</p>
          <div>${content}</div>
          <br>
          <p>Best regards,</p>
          <p>Christian Professionals Network Team</p>
        `
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.json({
      message: `Newsletter sent successfully to ${subscribers.rows.length} subscribers`
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 