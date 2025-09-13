const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true
  },
  nationality: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },

  dateOfBirth: {
    day: {
      type: Number,
      min: 1,
      max: 31,
      required: true
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      required: true
    }
  },
  industry: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  occupation: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },

  registeredAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ registeredAt: -1 });

module.exports = mongoose.model('User', userSchema);
