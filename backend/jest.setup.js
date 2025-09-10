const mongoose = require('mongoose');

// Ensure required envs for tests have safe defaults
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI_DEV = process.env.MONGODB_URI_DEV || 'mongodb://localhost:27017/cpn_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'Uju';
process.env.SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'password';
process.env.SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'uju@example.com';

// Mock the server startup to prevent actual HTTP server creation
jest.mock('../server', () => {
  return {
    server: {
      listen: jest.fn(),
      close: jest.fn()
    },
    app: require('express')(),
    broadcastDashboardUpdate: jest.fn()
  };
});

beforeAll(async () => {
  // Increase timeout for CI cold starts
  jest.setTimeout(30000);
  
  // Only connect if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  // Close all mongoose connections
  try {
    await mongoose.connection.close();
    await mongoose.disconnect();
  } catch (e) {
    console.log('Error closing mongoose connection:', e.message);
  }
});

afterEach(async () => {
  // Clear DB between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch (e) {
      // ignore per collection errors
    }
  }
});