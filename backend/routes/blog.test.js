const request = require('supertest');
const express = require('express');
const blogRoutes = require('./blog');

jest.mock('../config/redisClient', () => ({
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../services/BlogService', () => ({
  BlogServiceImpl: jest.fn().mockImplementation(() => ({
    getPublished: jest.fn().mockResolvedValue([
      { id: 1, title: 'Test Blog', content: 'Test content' }
    ]),
    getBySlug: jest.fn().mockResolvedValue({
      id: 1, title: 'Test Blog', content: 'Test content', slug: 'test-blog' })
  }))
}));

const app = express();
app.use(express.json());
app.use('/api/blog', blogRoutes);

describe('Blog API', () => {
  it('GET /api/blog should return { blogs: [...] }', async () => {
    const res = await request(app).get('/api/blog');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('blogs');
    expect(Array.isArray(res.body.blogs)).toBe(true);
  });
}); 