const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
resetTokenSchema.index({ token: 1 });
resetTokenSchema.index({ expires_at: 1 });

module.exports = mongoose.model('ResetToken', resetTokenSchema);
