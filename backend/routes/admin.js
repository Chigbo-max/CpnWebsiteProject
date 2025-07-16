const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database').default;
const dotenv = require('dotenv');

const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import services
const BlogService = require('../services/BlogService');
const SubscriberService = require('../services/SubscriberService');
const InquiryService = require('../services/InquiryService');
const AdminService = require('../services/AdminService');
const NewsletterService = require('../services/NewsletterService');

// Instantiate services
const blogService = new BlogService(db);
const subscriberService = new SubscriberService(db);
const inquiryService = new InquiryService(db);
const adminService = new AdminService(db);
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
const newsletterService = new NewsletterService(db, mailer);

// --- BLOG MANAGEMENT ---
router.get('/blog', auth, async (req, res, next) => {
  try {
    const posts = await blogService.getAll();
    res.json(posts);
  } catch (error) { next(error); }
});
// Blog post creation with multer for multipart/form-data
router.post('/blog', auth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, excerpt, tags, status, slug } = req.body;
    let featured_image = null;
    if (req.file) {
      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: 'cpn_blog' },
        (error, result) => {
          if (error) return next(error);
          featured_image = result.secure_url;
        }
      );
      // Use a Promise to wait for upload_stream to finish
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'cpn_blog' },
          (error, result) => {
            if (error) return reject(error);
            featured_image = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }
    if (!title || !content || !slug) {
      return res.status(400).json({ message: 'Title, content, and slug are required' });
    }
    const post = await blogService.create({ title, content, excerpt, tags, status, slug, authorId: req.admin.id, featured_image });
    res.status(201).json({ message: 'Blog post created successfully', post });
  } catch (error) { next(error); }
});
router.put('/blog/:id', auth, async (req, res, next) => {
  try {
    const post = await blogService.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post updated', post });
  } catch (error) { next(error); }
});
router.delete('/blog/:id', auth, async (req, res, next) => {
  try {
    const post = await blogService.delete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted' });
  } catch (error) { next(error); }
});

// --- SUBSCRIBER MANAGEMENT ---
router.get('/subscribers', auth, async (req, res, next) => {
  try {
    const subs = await subscriberService.getAll();
    res.json(subs);
  } catch (error) { next(error); }
});
router.post('/subscribers', auth, async (req, res, next) => {
  try {
    const sub = await subscriberService.create(req.body);
    res.status(201).json({ message: 'Subscriber added', subscriber: sub });
  } catch (error) { next(error); }
});
router.put('/subscribers/:id', auth, async (req, res, next) => {
  try {
    const sub = await subscriberService.update(req.params.id, req.body);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Subscriber updated', subscriber: sub });
  } catch (error) { next(error); }
});
router.delete('/subscribers/:id', auth, async (req, res, next) => {
  try {
    const sub = await subscriberService.delete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Subscriber deleted' });
  } catch (error) { next(error); }
});

// --- CONTACT INQUIRY MANAGEMENT ---
router.get('/inquiries', auth, async (req, res, next) => {
  try {
    const inquiries = await inquiryService.getAll();
    res.json(inquiries);
  } catch (error) { next(error); }
});
router.patch('/inquiries/:id/status', auth, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry status updated', inquiry });
  } catch (error) { next(error); }
});
router.put('/inquiries/:id', auth, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.respond(req.params.id, req.body.admin_response);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    // Send email to the user with the admin's response
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: inquiry.email,
      subject: 'Response to your inquiry',
      html: `<p>Hello ${inquiry.name},</p><p>${req.body.admin_response}</p><p>Thank you for contacting us!</p>`
    });
    res.json({ message: 'Response sent successfully', inquiry });
  } catch (error) { next(error); }
});
router.delete('/inquiries/:id', auth, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.delete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) { next(error); }
});

// --- NEWSLETTER ---
router.post('/newsletter', auth, async (req, res, next) => {
  try {
    const { subject, content } = req.body;
    const count = await newsletterService.sendNewsletter(subject, content);
    res.json({ message: `Newsletter sent successfully to ${count} subscribers` });
  } catch (error) { next(error); }
});

// --- ADMIN MANAGEMENT (SUPER ADMIN ONLY) ---
function requireSuperAdmin(req, res, next) {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ message: 'Only super admin can perform this action' });
  }
  next();
}
router.get('/admins', auth, requireSuperAdmin, async (req, res, next) => {
  try {
    const admins = await adminService.getAll();
    res.json(admins);
  } catch (error) { next(error); }
});
router.post('/admins', auth, requireSuperAdmin, async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Username, email, and password are required' });
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);
    const admin = await adminService.create({ username, email, password_hash, role });
    res.status(201).json({ message: 'Admin added', admin });
  } catch (error) { next(error); }
});
router.delete('/admins/:id', auth, requireSuperAdmin, async (req, res, next) => {
  try {
    if (req.admin.id == req.params.id) return res.status(400).json({ message: 'Cannot delete yourself' });
    const admin = await adminService.delete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin deleted' });
  } catch (error) { next(error); }
});
router.post('/admins/:id/reset-password', auth, requireSuperAdmin, async (req, res, next) => {
  try {
    const newPassword = Math.random().toString(36).slice(-8);
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(newPassword, 10);
    const admin = await adminService.updatePassword(req.params.id, password_hash);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: 'CPN Admin Password Reset',
      html: `<p>Hello ${admin.username},<br>Your new password is: <b>${newPassword}</b></p>`
    });
    res.json({ message: 'Password reset and emailed to admin' });
  } catch (error) { next(error); }
});

module.exports = router; 