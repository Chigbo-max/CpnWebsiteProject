const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all subscribers (public route for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, subscribed_at FROM subscribers ORDER BY subscribed_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsubscribe from newsletter
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await db.query(
      'DELETE FROM subscribers WHERE email = $1 RETURNING *',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 