module.exports = async () => {
  const mongoose = require('mongoose');
  
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      await mongoose.disconnect();
      console.log('MongoDB connection closed in global teardown');
    }
  } catch (e) {
    console.log('Error closing MongoDB connection:', e.message);
  }
};