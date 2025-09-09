const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PROD 
      : process.env.MONGODB_URI_DEV;

    if (!uri) {
      throw new Error("MongoDB URI not set in environment variables");
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV != 'test'){
    process.exit(1);
    }
  }
};

module.exports = connectDB;
