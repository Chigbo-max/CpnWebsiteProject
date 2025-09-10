const express = require('express');
const router = express.Router();
const { ContactServiceImpl } = require('../services/ContactService');
const contactService = new ContactServiceImpl();

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const inquiry = await contactService.submitContactForm(req.body);
    res.status(201).json({
      message: 'Contact form submitted successfully',
      inquiry
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(400).json({ message: error.message });
  }
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const subscriber = await contactService.subscribeToNewsletter(req.body);
    // Broadcast dashboard update
    req.app.get('broadcastDashboardUpdate')({ entity: 'subscriber', action: 'create' });
    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      subscriber
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 