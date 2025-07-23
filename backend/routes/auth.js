const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/database');
const { AuthServiceImpl } = require('../services/AuthService');
const authService = new AuthServiceImpl(db, bcrypt, jwt);
const nodemailer = require('nodemailer');
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
const { NewsletterServiceImpl } = require('../services/NewsletterService');
const { v4: uuidv4 } = require('uuid');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.post('/logout', authenticateAdmin, async (req, res) => {
  try {
    await authService.invalidateToken(req.token, req.admin.id);
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
});

router.get('/me', authenticateAdmin, async (req, res) => {
  try {
    const admin = await authService.getAdminById(req.admin.id);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let status = 'failure';
  let reason = 'Unknown error';
  try {
    const admin = await authService.getAdminByEmail(email);
    if (admin) {
      const token = uuidv4();
      await authService.saveResetToken(admin.id, token);
      const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}`;
      console.log(`[RESET] Sending password reset email to: ${admin.email}`);
      console.log(`[RESET] Reset link: ${resetLink}`);
      try {
        await mailer.sendMail({
          from: process.env.EMAIL_USER,
          to: admin.email,
          subject: 'CPN Password Reset Request',
          html: NewsletterServiceImpl.renderNewsletterTemplate({
            name: admin.username,
            content: `<p>Hello <b>${admin.username.split(' ')[0]}</b>,<br>If you requested a password reset, click <a href="${resetLink}">here</a>.<br>If you did not request this, please contact support immediately.</p>`
          })
        });
        console.log(`[RESET] Password reset email sent successfully to: ${admin.email}`);
        status = 'success';
        reason = 'Email sent';
      } catch (mailErr) {
        console.error(`[RESET] Failed to send password reset email:`, mailErr);
        reason = mailErr.message;
      }
    } else {
      status = 'not_found';
      reason = 'Email not found';
    }
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    reason = error.message;
    console.error(`[RESET] Error in forgot-password:`, error);
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } finally {
    await authService.logResetAttempt({ email, ip, status, reason, type: 'forgot' });
  }
});

// Reset password (with token, log attempt, invalidate sessions)
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const ip =   req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  let status = 'failure';
  let reason = 'Unknown error';
  try {
    const admin = await authService.getAdminByResetToken(token);
    if (!admin) throw new Error('Invalid or expired token');
    await authService.updatePasswordAndInvalidateSessions(admin.id, password);
    await authService.clearResetToken(admin.id);
    console.log(`[RESET] Password reset for admin: ${admin.email}`);
    try {
      await mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: 'CPN Password Reset Notification',
        html: NewsletterServiceImpl.renderNewsletterTemplate({
          name: admin.username,
          content: `<p>Hello <b>${admin.username.split(' ')[0]}</b>,<br>Your password was just reset. If you did not request this, please contact support immediately.</p>`
        })
      });
      console.log(`[RESET] Password reset notification sent to: ${admin.email}`);
      status = 'success';
      reason = 'Password reset';
    } catch (mailErr) {
      console.error(`[RESET] Failed to send password reset notification:`, mailErr);
      reason = mailErr.message;
    }
    res.json({ message: 'Password reset successful. You may now log in.' });
  } catch (error) {
    reason = error.message;
    console.error(`[RESET] Error in reset-password:`, error);
    res.status(400).json({ message: 'Reset failed. The link may be invalid or expired.' });
  } finally {
    await authService.logResetAttempt({ token, ip, status, reason, type: 'reset' });
  }
});

// Change password (authenticated)
router.post('/change-password', authenticateAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const ok = await authService.changePassword(req.admin.id, currentPassword, newPassword);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect.' });
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch audit log (admin only, for own account)
router.get('/audit-log', authenticateAdmin, async (req, res) => {
  try {
    const logs = await authService.getAuditLog(req.admin.email);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit log', error: error.message });
  }
});

module.exports = router; 