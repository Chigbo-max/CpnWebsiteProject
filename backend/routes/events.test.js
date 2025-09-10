const request = require('supertest');
const server = require('../server');
const app = server.app;

jest.mock('../config/redisClient', () => ({
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../services/EventService', () => ({
  EventServiceImpl: jest.fn().mockImplementation(() => ({
    getEvents: jest.fn().mockResolvedValue([
      { id: 1, title: 'Test Event', date: '2024-01-01' }
    ]),
    getEventById: jest.fn().mockResolvedValue({
      id: 1, title: 'Test Event', date: '2024-01-01', event_type: 'virtual', virtual_link: 'https://example.com' }),
    isEventPast: jest.fn().mockResolvedValue(false),
    registerForEvent: jest.fn().mockResolvedValue({ registration_code: 'ABC123' }),
    createEvent: jest.fn().mockResolvedValue({ id: 1, title: 'Test Event', date: '2024-01-01' })
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
jest.mock('../services/NewsletterService', () => ({
  renderNewsletterTemplate: jest.fn().mockReturnValue('<html></html>')
}));
jest.mock('../middleware/auth', () => ({
  authenticateAdmin: (req, res, next) => {
    req.admin = { id: 1, role: 'superadmin' };
    next();
  }
}));

// app from server already mounts /api/events

describe('Events API', () => {
  it('GET /api/events should return { events: [...] }', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('events');
    expect(Array.isArray(res.body.events)).toBe(true);
  });
}); 