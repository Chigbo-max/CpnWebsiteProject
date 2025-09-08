const express = require('express');
const router = express.Router();
const { EventServiceImpl } = require('../services/EventService');
const { CloudinaryServiceImpl } = require('../services/CloudinaryService');
const nodemailer = require('nodemailer');
const { authenticateAdmin } = require('../middleware/auth');
const redisClient = require('../config/redisClient');
const multer = require('multer');
const upload = multer();


const eventService = new EventServiceImpl();
const cloudinaryService = new CloudinaryServiceImpl();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'events:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return res.json(Array.isArray(parsed) ? { events: parsed } : parsed);
    }
    const events = await eventService.getEvents();
    console.log("Fetched events:", events);
    await redisClient.setEx(cacheKey, 300, JSON.stringify(events));
    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// GET /api/events/:event_id
router.get('/:event_id', async (req, res) => {
  try {
    const cacheKey = `events:${req.params.event_id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const event = await eventService.getEventById(req.params.event_id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(event));
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
});

// PUT /api/events/:event_id (admin only)
router.put('/:event_id', authenticateAdmin, async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const updates = req.body;
    
    // Handle image upload if provided
    let image_url = updates.image_url;
    if (updates.image && updates.image.startsWith('data:image')) {
      image_url = await cloudinaryService.uploadImage(updates.image, 'event-images');
    }
    
    // Prepare update data
    const updateData = {
      title: updates.title,
      description: updates.description,
      event_type: updates.event_type,
      start_time: updates.start_time,
      end_time: updates.end_time,
      image_url: image_url || updates.image_url,
      location_address: updates.location_address || null,
      location_map_url: updates.location_map_url || null,
      virtual_link: updates.virtual_link || null
    };
    
    const updatedEvent = await eventService.updateEvent(event_id, updateData);
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Clear cache
    await redisClient.del(`events:${event_id}`);
    await redisClient.del('events:list');
    
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// DELETE /api/events/:event_id (admin only)
router.delete('/:event_id', authenticateAdmin, async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const deleted = await eventService.deleteEvent(event_id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Clear cache
    await redisClient.del(`events:${event_id}`);
    await redisClient.del('events:list');
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

// POST /api/events/:event_id/register
router.post('/:event_id/register', async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.event_id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (await eventService.isEventPast(req.params.event_id)) {
      return res.status(400).json({ message: 'Registration closed. Event is past.' });
    }
    const { name, email, phone } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });
    const reg = await eventService.registerForEvent(req.params.event_id, { name, email, phone });
    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    let locationInfo = '';
    if (event.event_type === 'physical') {
      locationInfo = `<b>Address:</b> ${event.location_address}<br/><a href="${event.location_map_url}">View on Google Maps</a>`;
    } else {
      locationInfo = `<b>Virtual Meeting Link:</b> <a href="${event.virtual_link}">${event.virtual_link}</a>`;
    }
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Registration Confirmed: ${event.title}`,
      html: require('../services/NewsletterService').NewsletterServiceImpl.renderNewsletterTemplate({
        name: name,
        content: `
          <h2 style='margin-top:0;'>Thank you for registering for <b>${event.title}</b>!</h2>
          <p>Your registration code: <b>${reg.registration_code}</b></p>
          <p>Event Date: ${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}</p>
          <p>${locationInfo}</p>
        `
      })
    });
    // Invalidate registrations cache for this event
    await redisClient.del(`event_registrations:${req.params.event_id}`);
    res.status(201).json({ ...reg, event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:event_id/registrations (admin only)
router.get('/:event_id/registrations', authenticateAdmin, async (req, res) => {
  try {
    const cacheKey = `event_registrations:${req.params.event_id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const regs = await eventService.getRegistrationsForEvent(req.params.event_id);
    await redisClient.setEx(cacheKey, 300, JSON.stringify(regs));
    res.json(regs);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
  }
});

// GET /api/events/:event_id/registrations/csv (admin only)
router.get('/:event_id/registrations/csv', authenticateAdmin, async (req, res) => {
  try {
    const cacheKey = `event_registrations_csv:${req.params.event_id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const csvData = await eventService.getRegistrationsCSV(req.params.event_id);
    await redisClient.setEx(cacheKey, 300, JSON.stringify(csvData));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=registrations_${req.params.event_id}.csv`);
    res.send(csvData);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ message: 'Failed to fetch CSV', error: error.message });
  }
});

module.exports = router;