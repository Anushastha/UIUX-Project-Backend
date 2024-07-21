const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },
  expectedFeesMin: {
    type: Number, 
    required: true,
  },
  expectedFeesMax: {
    type: Number, 
    required: true,
  },
  averageDurationMin: {
    type: String, 
    required: true,
  },
  averageDurationMax: {
    type: String, 
    required: true,
  },
  courseImageUrl: {
    type: String,
    required: true,
  },
});

const Courses = mongoose.model('Courses', courseSchema);

module.exports = Courses;


