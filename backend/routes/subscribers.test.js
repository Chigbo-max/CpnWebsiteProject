const request = require('supertest');
const { app } = require('../server');

jest.mock('../config/database', () => ({}));
jest.mock('../config/redisClient', () => ({
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../services/SubscriberService', () => ({
  SubscriberServiceImpl: jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([
      { id: 1, email: 'test@example.com', name: 'Test User' }
    ]),
    findByEmail: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 2, email: 'new@example.com', name: 'New User' }),
    deleteByEmail: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', name: 'Updated User' }),
    getMonthlyCounts: jest.fn().mockResolvedValue([])
  }))
}));
jest.mock('../middleware/auth', () => ({
  authenticateAdmin: (req, res, next) => {
    req.admin = { id: 1, role: 'superadmin' };
    next();
  }
}));

describe('Subscribers API', () => {
  it('GET /api/subscribers should return { subscribers: [...] }', async () => {
    const res = await request(app).get('/api/subscribers');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('subscribers');
    expect(Array.isArray(res.body.subscribers)).toBe(true);
  });
}); 