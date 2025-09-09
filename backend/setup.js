const mongoose = require('mongoose');

async function setupDatabase() {
    const uri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI_DEV;


  if (!uri) {
    console.error("MONGODB_URI is not set in environment variables");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

module.exports = setupDatabase;
