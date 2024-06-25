const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true,
    trim: true,
  },
  blogsDescription: {
    type: String,
    required: true,
    trim: true,
  },
  blogImageUrl: {
    type: String,
    required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Blogs = mongoose.model('blogs', blogSchema);

module.exports = Blogs;
