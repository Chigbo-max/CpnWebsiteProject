const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');
const dotenv = require('dotenv');

const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
const { uploadImage } = require('../services/CloudinaryService');
const redisClient = require('../config/redisClient');

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
    const cacheKey = 'admin:blog:posts';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const posts = await blogService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
    res.json(posts);
  } catch (error) { next(error); }
});
// Blog post creation with multer for multipart/form-data
router.post('/blog', auth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, excerpt, tags, status, slug, contentType, content_type } = req.body;
    let featured_image = null;
    if (req.file) {
      // Convert buffer to base64 data URL
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      featured_image = await uploadImage(base64, 'blog-images');
    }
    if (!title || !content || !slug) {
      return res.status(400).json({ message: 'Title, content, and slug are required' });
    }
    const post = await blogService.create({ title, content, excerpt, tags, status, slug, authorId: req.admin.id, featured_image, contentType: contentType || content_type || 'markdown' });
    await redisClient.del('admin:blog:posts');
    await redisClient.del('blog:posts');
    res.status(201).json({ message: 'Blog post created successfully', post });
  } catch (err) {
    next(err);
  }
});
router.put('/blog/:id', auth, async (req, res, next) => {
  try {
    const post = await blogService.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    await redisClient.del('admin:blog:posts');
    await redisClient.del('blog:posts');
    res.json({ message: 'Blog post updated', post });
  } catch (error) { next(error); }
});
router.delete('/blog/:id', auth, async (req, res, next) => {
  try {
    const post = await blogService.delete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    await redisClient.del('admin:blog:posts');
    await redisClient.del('blog:posts');
    res.json({ message: 'Blog post deleted' });
  } catch (error) { next(error); }
});

// Blog editor image upload endpoint
router.post('/blog/upload-image', auth, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });
    const url = await uploadImage(image, 'blog-images');
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

// --- SUBSCRIBER MANAGEMENT ---
router.get('/subscribers', auth, async (req, res, next) => {
  try {
    const cacheKey = 'admin:subscribers:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const subs = await subscriberService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(subs));
    res.json(subs);
  } catch (error) { next(error); }
});
router.post('/subscribers', auth, async (req, res, next) => {
  try {
    const sub = await subscriberService.create(req.body);
    await redisClient.del('admin:subscribers:list');
    await redisClient.del('subscribers:list');
    res.status(201).json({ message: 'Subscriber added', subscriber: sub });
  } catch (error) { next(error); }
});
router.put('/subscribers/:id', auth, async (req, res, next) => {
  try {
    const sub = await subscriberService.update(req.params.id, req.body);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
    await redisClient.del('admin:subscribers:list');
    await redisClient.del('subscribers:list');
    res.json({ message: 'Subscriber updated', subscriber: sub });
  } catch (error) { next(error); }
});
router.delete('/subscribers/:id', auth, async (req, res, next) => {
  try {
    const sub = await subscriberService.delete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
    await redisClient.del('admin:subscribers:list');
    await redisClient.del('subscribers:list');
    res.json({ message: 'Subscriber deleted' });
  } catch (error) { next(error); }
});

// --- CONTACT INQUIRY MANAGEMENT ---
router.get('/inquiries', auth, async (req, res, next) => {
  try {
    const cacheKey = 'admin:inquiries:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const inquiries = await inquiryService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(inquiries));
    res.json(inquiries);
  } catch (error) { next(error); }
});
router.patch('/inquiries/:id/status', auth, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await redisClient.del('admin:inquiries:list');
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
    await redisClient.del('admin:inquiries:list');
    res.json({ message: 'Response sent successfully', inquiry });
  } catch (error) { next(error); }
});
router.delete('/inquiries/:id', auth, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.delete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await redisClient.del('admin:inquiries:list');
    res.json({ message: 'Inquiry deleted' });
  } catch (error) { next(error); }
});

// --- NEWSLETTER ---
// (No caching needed for newsletter send)

// --- ADMIN MANAGEMENT (SUPER ADMIN ONLY) ---
function requireSuperAdmin(req, res, next) {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ message: 'Only super admin can perform this action' });
  }
  next();
}
router.get('/admins', auth, requireSuperAdmin, async (req, res, next) => {
  try {
    const cacheKey = 'admin:admins:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const admins = await adminService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(admins));
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
    await redisClient.del('admin:admins:list');
    res.status(201).json({ message: 'Admin added', admin });
  } catch (error) { next(error); }
});
router.delete('/admins/:id', auth, requireSuperAdmin, async (req, res, next) => {
  try {
    if (req.admin.id == req.params.id) return res.status(400).json({ message: 'Cannot delete yourself' });
    const admin = await adminService.delete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    await redisClient.del('admin:admins:list');
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

// Admin profile image upload (example, adjust as needed)
// (No caching needed for profile image upload)

module.exports = router; 