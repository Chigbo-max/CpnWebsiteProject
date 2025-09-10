const express = require('express');
const router = express.Router();
const redisClient = require('../config/redisClient');
const { SubscriberServiceImpl } = require('../services/SubscriberService');
const subscriberService = new SubscriberServiceImpl();
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const cacheKey = 'subscribers:list';

  let cached = null;

  if(redisClient){
  cached = await redisClient.get(cacheKey);
  }

  if (cached) {
    const parsed = JSON.parse(cached);
    return res.json(Array.isArray(parsed) ? { subscribers: parsed } : parsed);
  }
  try {
    const result = await subscriberService.getAll();

    if(redisClient){
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
    }
    res.json({ subscribers: result });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Unsubscribe from newsletter
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await subscriberService.deleteByEmail(email);
    if (!result) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    await redisClient.del('subscribers:list');
    // Broadcast dashboard update
    req.app.get('broadcastDashboardUpdate')({ entity: 'subscriber', action: 'delete' });
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
    const existing = await subscriberService.findByEmail(email);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    const result = await subscriberService.create({ name, email });
    await redisClient.del('subscribers:list');
    // Broadcast dashboard update
    req.app.get('broadcastDashboardUpdate')({ entity: 'subscriber', action: 'create' });
    res.status(201).json({ message: 'Subscriber added', subscriber: result });
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
      const existing = await subscriberService.findByEmail(email);
      if (existing.some(sub => sub.id != id)) {
        return res.status(400).json({ message: 'Email already subscribed by another user' });
      }
    }
    const result = await subscriberService.update(id, { name, email });
    if (!result) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    await redisClient.del('subscribers:list');
    // Broadcast dashboard update
    req.app.get('broadcastDashboardUpdate')({ entity: 'subscriber', action: 'update' });
    res.json({ message: 'Subscriber updated', subscriber: result });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get monthly subscriber counts for dashboard analytics
router.get('/monthly-counts', authenticateAdmin, async (req, res) => {
  try {
    const result = await subscriberService.getMonthlyCounts();
    res.json({ data: result });
  } catch (error) {
    console.error('Error fetching monthly subscriber counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 