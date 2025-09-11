const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  author_name: {
    type: String,
    required: true,
    trim: true
  },
  featured_image: {
    type: String,
    default: null
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  content_type: {
    type: String,
    enum: ['markdown', 'html'],
    default: 'markdown'
  }
}, {
  timestamps: true
});

// Index for better query performance
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ createdAt: -1 });
blogPostSchema.index({ author_id: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);