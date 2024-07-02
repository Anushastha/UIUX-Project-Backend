const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
        trim: true,
    },
    blogDescription: {
        type: String,
        required: true,
        trim: true,
    },
    blogImageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    }
});

const Blogs = mongoose.model('blogs', blogSchema);

module.exports = Blogs;
