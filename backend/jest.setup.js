const mongoose = require('mongoose');

// Ensure required envs for tests have safe defaults
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cpn_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.SUPERADMIN_USERNAME = process.env.SUPERADMIN_USERNAME || 'Uju';
process.env.SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD || 'password';
process.env.SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL || 'uju@example.com';

beforeAll(async () => {
  // Increase timeout for CI cold starts
  jest.setTimeout(30000);
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (e) {
    // ignore
  }
});

afterEach(async () => {
  // Optionally clear DB between tests if tests rely on clean state
  const collections = Object.values(mongoose.connection.collections);
  for (const collection of collections) {
    try {
      await collection.deleteMany({});
    } catch (e) {
      // ignore per collection errors
    }
  }
});


