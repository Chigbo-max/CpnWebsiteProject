const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const db = require('../config/database');
const dotenv = require('dotenv');

const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
const { CloudinaryServiceImpl } = require('../services/CloudinaryService');
const redisClient = require('../config/redisClient');

const { BlogServiceImpl } = require('../services/BlogService');
const { SubscriberServiceImpl } = require('../services/SubscriberService');
const { InquiryServiceImpl } = require('../services/InquiryService');
const { AdminServiceImpl } = require('../services/AdminService');
const { NewsletterServiceImpl } = require('../services/NewsletterService');
const { EventServiceImpl } = require('../services/EventService');

const blogService = new BlogServiceImpl(db);
const subscriberService = new SubscriberServiceImpl(db);
const inquiryService = new InquiryServiceImpl(db);
const adminService = new AdminServiceImpl(db);
const eventService = new EventServiceImpl(db);
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
const newsletterService = new NewsletterServiceImpl(db, mailer);
const cloudinaryService = new CloudinaryServiceImpl();



router.post('/events', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    let image_url = null;
    
    // Handle image upload similar to blog route
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      image_url = await cloudinaryService.uploadImage(base64, 'event-images');
    }

    const event = await eventService.createEvent({
      ...req.body,
      image_url,
      created_by: req.admin.id
    });

    // Invalidate cache
    await redisClient.del('events:list');
    req.app.get('broadcastDashboardUpdate')({ entity: 'event', action: 'create' });
    
    res.status(201).json(event);
  } catch (err) {
    console.error('Error creating event:', err);
    
    if (err.code === '23505') {
      return res.status(400).json({ 
        message: 'Database constraint violation',
        error: 'DATABASE_ERROR'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create event',
      error: err.message 
    });
  }
});

router.get('/blog', authenticateAdmin, async (req, res, next) => {
  try {
    const cacheKey = 'admin:blog:posts';
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const posts = await blogService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
    res.json({ blogs: posts });
  } catch (error) { 
    console.error('Error fetching blog posts:', error);
    next(error); 
  }
});
// Blog post creation with multer for multipart/form-data
router.post('/blog', authenticateAdmin, upload.single('image'), async (req, res, next) => {
  try {
    const { title, content, excerpt, tags, status, slug } = req.body;
    let featured_image = null;
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      featured_image = await cloudinaryService.uploadImage(base64, 'blog-images');
    }
    if (!title || !content || !slug) {
      return res.status(400).json({ message: 'Title, content, and slug are required' });
    }
    
    const post = await blogService.create({ title, content, excerpt, tags, status, slug, authorId: req.admin.id, featured_image });
    await redisClient.del('admin:blog:posts');
    await redisClient.del('blog:posts');
    // Broadcast dashboard update
    req.app.get('broadcastDashboardUpdate')({ entity: 'blog', action: 'create' });
    res.status(201).json({ message: 'Blog post created successfully', post });
  } catch (err) {
    console.error('Error creating blog post:', err);
    
    if (err.code === '23505' && err.constraint === 'blog_posts_slug_key') {
      return res.status(400).json({ 
        message: 'A blog post with this slug already exists. Please choose a different slug.',
        error: 'DUPLICATE_SLUG'
      });
    }
    
    if (err.code && err.code.startsWith('23')) {
      return res.status(400).json({ 
        message: 'Database error occurred. Please check your input and try again.',
        error: 'DATABASE_ERROR'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create blog post. Please try again.',
      error: err.message 
    });
  }
});
router.put('/blog/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const post = await blogService.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    await redisClient.del('admin:blog:posts');
    await redisClient.del('blog:posts');
    req.app.get('broadcastDashboardUpdate')({ entity: 'blog', action: 'update' });
    res.json({ message: 'Blog post updated', post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    if (error.code === '23505' && error.constraint === 'blog_posts_slug_key') {
      return res.status(400).json({ 
        message: 'A blog post with this slug already exists. Please choose a different slug.',
        error: 'DUPLICATE_SLUG'
      });
    }
    
    if (error.code && error.code.startsWith('23')) {
      return res.status(400).json({ 
        message: 'Database error occurred. Please check your input and try again.',
        error: 'DATABASE_ERROR'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to update blog post. Please try again.',
      error: error.message 
    });
  }
});
router.delete('/blog/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const post = await blogService.delete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    await redisClient.del('admin:blog:posts');
    await redisClient.del('blog:posts');
    req.app.get('broadcastDashboardUpdate')({ entity: 'blog', action: 'delete' });
    res.json({ message: 'Blog post deleted' });
  } catch (error) { next(error); }
});

router.post('/blog/upload-image', authenticateAdmin, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });
    const url = await cloudinaryService.uploadImage(image, 'blog-images');
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

router.get('/subscribers', authenticateAdmin, async (req, res, next) => {
  try {
    const cacheKey = 'admin:subscribers:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const subs = await subscriberService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(subs));
    res.json({ subscribers: subs });
  } catch (error) { next(error); }
});
router.post('/subscribers', authenticateAdmin, async (req, res, next) => {
  try {
    const sub = await subscriberService.create(req.body);
    await redisClient.del('admin:subscribers:list');
    await redisClient.del('subscribers:list');
    res.status(201).json({ message: 'Subscriber added', subscriber: sub });
  } catch (error) { next(error); }
});
router.put('/subscribers/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const sub = await subscriberService.update(req.params.id, req.body);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
    await redisClient.del('admin:subscribers:list');
    await redisClient.del('subscribers:list');
    req.app.get('broadcastDashboardUpdate')({ entity: 'subscriber', action: 'update' });
    res.json({ message: 'Subscriber updated', subscriber: sub });
  } catch (error) { next(error); }
});
router.delete('/subscribers/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const sub = await subscriberService.delete(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });
    await redisClient.del('admin:subscribers:list');
    await redisClient.del('subscribers:list');
    req.app.get('broadcastDashboardUpdate')({ entity: 'subscriber', action: 'delete' });
    res.json({ message: 'Subscriber deleted' });
  } catch (error) { next(error); }
});

router.get('/inquiries', authenticateAdmin, async (req, res, next) => {
  try {
    const cacheKey = 'admin:inquiries:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const inquiries = await inquiryService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(inquiries));
    res.json(inquiries);
  } catch (error) { next(error); }
});
router.patch('/inquiries/:id/status', authenticateAdmin, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await redisClient.del('admin:inquiries:list');
    res.json({ message: 'Inquiry status updated', inquiry });
  } catch (error) { next(error); }
});
router.put('/inquiries/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.respond(req.params.id, req.body.admin_response);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: inquiry.email,
      subject: 'Response to your inquiry',
      html: NewsletterServiceImpl.renderNewsletterTemplate({
        name: inquiry.name,
        content: `<p>${req.body.admin_response}</p><p>Thank you for contacting us!</p>`
      })
    });
    await redisClient.del('admin:inquiries:list');
    res.json({ message: 'Response sent successfully', inquiry });
  } catch (error) { next(error); }
});
router.delete('/inquiries/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const inquiry = await inquiryService.delete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await redisClient.del('admin:inquiries:list');
    res.json({ message: 'Inquiry deleted' });
  } catch (error) { next(error); }
});

// --- NEWSLETTER ---
router.post('/newsletter', authenticateAdmin, async (req, res, next) => {
  try {
    const { subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }
    const sentCount = await newsletterService.sendNewsletter(subject, content);
    res.json({ message: `Newsletter sent to ${sentCount} subscribers`, sentCount });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ message: 'Failed to send newsletter', error: error.message });
  }
});



router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    const admin = await adminService.getProfile(req.admin.id);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

router.patch('/profile', authenticateAdmin, async (req, res) => {
  try {
    const { username, email, profilePic } = req.body;
    const updated = await adminService.updateProfile(req.admin.id, { username, email, profilePic });
    res.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      profile_pic: updated.profile_pic,
      created_at: updated.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

router.post('/upload-image', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    // Convert buffer to base64 data URI
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const url = await cloudinaryService.uploadImage(base64, 'profile-images');
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

router.delete('/profile-picture', authenticateAdmin, async (req, res) => {
  try {
    // Fetch current admin's username and email
    const adminRow = await db.query('SELECT username, email FROM admins WHERE id = $1', [req.admin.id]);
    const admin = adminRow.rows[0];
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const updated = await adminService.updateProfile(req.admin.id, { username: admin.username, email: admin.email, profilePic: null });
    res.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      profile_pic: updated.profile_pic,
      created_at: updated.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove profile picture', error: error.message });
  }
});

// --- ADMIN MANAGEMENT (SUPER ADMIN ONLY) ---
function requireSuperAdmin(req, res, next) {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ message: 'Only super admin can perform this action' });
  }
  next();
}
router.get('/admins', authenticateAdmin, requireSuperAdmin, async (req, res, next) => {
  try {
    const cacheKey = 'admin:admins:list';
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
    const admins = await adminService.getAll();
    await redisClient.setEx(cacheKey, 300, JSON.stringify(admins));
    res.json(admins);
  } catch (error) { next(error); }
});
router.post('/admins', authenticateAdmin, requireSuperAdmin, async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Username, email, and password are required' });
    const bcrypt = require('bcryptjs');
    const password_hash = await bcrypt.hash(password, 10);
    const admin = await adminService.create({ username, email, password_hash, role });
    await redisClient.del('admin:admins:list');
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your CPN Admin Account',
      html: NewsletterServiceImpl.renderNewsletterTemplate({
        name: username,
        content: `<p>Hello <b>${username.split(' ')[0]}</b>,<br>Your admin account has been created.<br><br><b>Username:</b> ${username}<br><b>Password:</b> ${password}</p><p>Please log in and change your password after your first login.</p>`
      })
    });
    res.status(201).json({ message: 'Admin added', admin });
  } catch (error) { next(error); }
});
router.delete('/admins/:id', authenticateAdmin, requireSuperAdmin, async (req, res, next) => {
  try {
    if (req.admin.id == req.params.id) return res.status(400).json({ message: 'Cannot delete yourself' });
    const admin = await adminService.delete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    await redisClient.del('admin:admins:list');
    res.json({ message: 'Admin deleted' });
  } catch (error) { next(error); }
});
router.post('/admins/:id/reset-password', authenticateAdmin, requireSuperAdmin, async (req, res, next) => {
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
      html: NewsletterServiceImpl.renderNewsletterTemplate({
        name: admin.username,
        content: `<p>Hello <b>${admin.username.split(' ')[0]}</b>,<br>Your new password is: <b>${newPassword}</b></p>`
      })
    });
    res.json({ message: 'Password reset and emailed to admin' });
  } catch (error) { next(error); }
});



module.exports = router; 