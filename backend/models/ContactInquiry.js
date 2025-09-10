const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
  },
  admin_response: {
    type: String,
    default: null
  },
  responded_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
