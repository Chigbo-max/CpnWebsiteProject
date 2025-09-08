const mongoose = require('mongoose');

const passwordResetAuditSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false
  },
  token: {
    type: String,
    required: false
  },
  ip: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
passwordResetAuditSchema.index({ email: 1 });
passwordResetAuditSchema.index({ timestamp: -1 });

module.exports = mongoose.model('PasswordResetAudit', passwordResetAuditSchema);
