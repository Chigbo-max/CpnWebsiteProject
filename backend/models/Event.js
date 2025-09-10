const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  event_type: {
    type: String,
    enum: ['physical', 'virtual'],
    required: true
  },
  location_address: {
    type: String,
    default: null
  },
  location_map_url: {
    type: String,
    default: null
  },
  virtual_link: {
    type: String,
    default: null
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ start_time: 1 });
eventSchema.index({ event_type: 1 });

module.exports = mongoose.model('Event', eventSchema);
