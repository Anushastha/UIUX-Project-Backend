const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
  },
  collegeDescription: {
    type: String,
    required: true,
    trim: true,
  },
  collegeFees: {
    type: Number,
    required: true,
  },
  collegeType: {
    type: String,
    required: true,
  },
  coursesAvailable: [{
    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    }
  }],
  establishedAt: {
    type: Date,
    required: true,
  },
  collegeImageUrl: {
    type: String,
    required: true,
  },
});

const Colleges = mongoose.model('colleges', collegeSchema);

module.exports = Colleges;
