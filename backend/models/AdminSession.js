const mongoose = require('mongoose');

const adminSessionSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Index for better query performance
adminSessionSchema.index({ admin_id: 1 });

module.exports = mongoose.model('AdminSession', adminSessionSchema);
