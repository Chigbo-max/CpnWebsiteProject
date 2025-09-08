const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    ref: 'Event'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  registration_code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  registered_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
eventRegistrationSchema.index({ event_id: 1 });
eventRegistrationSchema.index({ registered_at: -1 });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
