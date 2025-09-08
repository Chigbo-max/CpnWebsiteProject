const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  subscribed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriberSchema.index({ subscribed_at: -1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);
