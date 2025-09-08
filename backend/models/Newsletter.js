const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  recipients: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'queued', 'sent', 'failed'],
    default: 'draft'
  },
  sentAt: {
    type: Date,
    default: null
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

newsletterSchema.index({ createdAt: -1 });
newsletterSchema.index({ status: 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);


