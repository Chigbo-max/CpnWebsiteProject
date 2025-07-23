const request = require('supertest');
const express = require('express');
const adminRoutes = require('./admin');

const app = express();
app.use(express.json());
app.use('/api/admin', (req, res, next) => { req.admin = { id: 1, role: 'superadmin' }; next(); }, adminRoutes);

jest.mock('../config/database', () => ({}));
jest.mock('../config/redisClient', () => ({
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../services/BlogService', () => ({
  BlogServiceImpl: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      { id: 1, title: 'Test Blog', content: 'Test content' }
    ]),
    create: jest.fn().mockResolvedValue({ id: 2, title: 'New Blog', content: 'New content' }),
    update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Blog', content: 'Updated content' })
  }))
}));
jest.mock('../services/SubscriberService', () => ({
  SubscriberServiceImpl: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      { id: 1, email: 'test@example.com', name: 'Test User' }
    ]),
    create: jest.fn().mockResolvedValue({ id: 2, email: 'new@example.com', name: 'New User' }),
    update: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', name: 'Updated User' })
  }))
}));
jest.mock('../services/InquiryService', () => ({
  InquiryServiceImpl: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, message: 'Test inquiry' })
  }))
}));
jest.mock('../services/AdminService', () => ({
  AdminServiceImpl: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, name: 'Admin' })
  }))
}));
jest.mock('../services/NewsletterService', () => ({
  NewsletterServiceImpl: jest.fn().mockImplementation(() => ({
    renderNewsletterTemplate: jest.fn().mockReturnValue('<html></html>')
  }))
}));
jest.mock('../services/CloudinaryService', () => ({
  CloudinaryServiceImpl: jest.fn().mockImplementation(() => ({
    uploadImage: jest.fn().mockResolvedValue('https://cloudinary.com/image.jpg')
  }))
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(undefined)
  })
}));
jest.mock('multer', () => () => ({ single: () => (req, res, next) => next() }));
jest.mock('../middleware/auth', () => ({
  authenticateAdmin: (req, res, next) => {
    req.admin = { id: 1, role: 'superadmin' };
    next();
  }
}));

describe('Admin Dashboard API', () => {
  it('GET /api/admin/blog should return { blogs: [...] }', async () => {
    const res = await request(app).get('/api/admin/blog');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('blogs');
    expect(Array.isArray(res.body.blogs)).toBe(true);
  });

  it('GET /api/admin/subscribers should return { subscribers: [...] }', async () => {
    const res = await request(app).get('/api/admin/subscribers');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('subscribers');
    expect(Array.isArray(res.body.subscribers)).toBe(true);
  });
}); 