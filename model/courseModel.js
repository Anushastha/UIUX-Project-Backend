const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    }
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course