const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { EventServiceImpl } = require('../services/EventService');
const { CloudinaryServiceImpl } = require('../services/CloudinaryService');
const nodemailer = require('nodemailer');
const { authenticateAdmin } = require('../middleware/auth');
const redisClient = require('../config/redisClient');

console.log('Loaded events routes');

const eventService = new EventServiceImpl(db);
const cloudinaryService = new CloudinaryServiceImpl();

// POST /api/events (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    let image_url = null;
    if (req.body.image) {
      image_url = await cloudinaryService.uploadImage(req.body.image);
      console.log('Image uploaded:', image_url);
    }
    const event = await eventService.createEvent({
      ...req.body,
      image_url,
      created_by: req.admin.id
    });
    console.log('Event created:', event);
    // Invalidate events list cache
    await redisClient.del('events:list');
    // Broadcast dashboard update
    req.app.get('broadcastDashboardUpdate')({ entity: 'event', action: 'create' });
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err); // <-- Add this line
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events
router.get('/', async (req, res) => {
  const cacheKey = 'events:list';
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    const parsed = JSON.parse(cached);
    return res.json(Array.isArray(parsed) ? { events: parsed } : parsed);
  }
  const events = await eventService.getEvents();
  await redisClient.setEx(cacheKey, 300, JSON.stringify(events));
  res.json({ events });
});

// GET /api/events/:event_id
router.get('/:event_id', async (req, res) => {
  const cacheKey = `events:${req.params.event_id}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  const event = await eventService.getEventById(req.params.event_id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await redisClient.setEx(cacheKey, 300, JSON.stringify(event));
  res.json(event);
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
      html: require('../services/NewsletterService').renderNewsletterTemplate({
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
  const cacheKey = `event_registrations:${req.params.event_id}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  const regs = await eventService.getRegistrationsForEvent(req.params.event_id);
  await redisClient.setEx(cacheKey, 300, JSON.stringify(regs));
  res.json(regs);
});

// GET /api/events/:event_id/registrations/csv (admin only)
router.get('/:event_id/registrations/csv', authenticateAdmin, async (req, res) => {
  const cacheKey = `event_registrations_csv:${req.params.event_id}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  const csvData = await eventService.getRegistrationsCSV(req.params.event_id);
  await redisClient.setEx(cacheKey, 300, JSON.stringify(csvData));
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=registrations_${req.params.event_id}.csv`);
  res.send(csvData);
});

module.exports = router;