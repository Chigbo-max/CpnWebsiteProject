const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redisClient = require('../config/redisClient');

// Get all subscribers (public route for admin dashboard)
router.get('/', async (req, res) => {
  const cacheKey = 'subscribers:list';
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  try {
    const result = await db.query(
      'SELECT id, email, name, subscribed_at FROM subscribers ORDER BY subscribed_at DESC'
    );
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result.rows));
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
    await redisClient.del('subscribers:list');
    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new subscriber
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    // Check if already exists
    const existing = await db.query('SELECT * FROM subscribers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    const result = await db.query(
      'INSERT INTO subscribers (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );
    await redisClient.del('subscribers:list');
    res.status(201).json({ message: 'Subscriber added', subscriber: result.rows[0] });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit an existing subscriber
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email) {
      return res.status(400).json({ message: 'Name or email required to update' });
    }
    // If updating email, check for duplicate
    if (email) {
      const existing = await db.query('SELECT * FROM subscribers WHERE email = $1 AND id != $2', [email, id]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: 'Email already subscribed by another user' });
      }
    }
    const result = await db.query(
      'UPDATE subscribers SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    await redisClient.del('subscribers:list');
    res.json({ message: 'Subscriber updated', subscriber: result.rows[0] });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 