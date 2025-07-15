const express = require('express');
const router = express.Router();
const db = require('../config/database').default;

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const result = await db.query(
      'INSERT INTO contact_inquiries (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    res.status(201).json({
      message: 'Contact form submitted successfully',
      inquiry: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existingSubscriber = await db.query(
      'SELECT * FROM subscribers WHERE email = $1',
      [email]
    );

    if (existingSubscriber.rows.length > 0) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const result = await db.query(
      'INSERT INTO subscribers (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );

    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscriber: result.rows[0]
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 