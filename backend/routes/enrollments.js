const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');
const EnrollmentService = require('../services/EnrollmentService');
const { authenticateAdmin } = require('../middleware/auth');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enrollmentService = new EnrollmentService(db, mailer);

// Public: Enroll in a course
router.post('/api/enrollments', async (req, res) => {
  try {
    const { course, name, email } = req.body;
    if (!course || !name || !email) {
      return res.status(400).json({ error: 'Course, name, and email are required.' });
    }
    const enrollment = await enrollmentService.enroll({ course, name, email });
    res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: List enrollments (optionally filter by date)
router.get('/api/admin/enrollments', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const enrollments = await enrollmentService.listEnrollments({ startDate, endDate });
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Broadcast email to filtered enrollees
router.post('/api/admin/enrollments/broadcast', authenticateAdmin, async (req, res) => {
  try {
    const { subject, content, startDate, endDate } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required.' });
    }
    const count = await enrollmentService.broadcast({ subject, content, startDate, endDate });
    res.json({ message: `Broadcast sent to ${count} enrollees.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 