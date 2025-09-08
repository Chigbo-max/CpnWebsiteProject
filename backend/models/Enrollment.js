const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  enrollment_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  course: {
    type: String,
    required: true,
    trim: true
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
  whatsapp: {
    type: String,
    trim: true
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolled_at: -1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
