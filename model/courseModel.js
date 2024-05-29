// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema({
//     courseName: {
//         type: String,
//         required: true,
//         trim: true,
//     }
// })

// const Course = mongoose.model('Course', courseSchema)
// module.exports = Course

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  expectedFees: {
    type: String, // To allow ranges like "1-2 lakh"
    required: true,
  },
  averageDuration: {
    type: Number, // Duration in years
    required: true,
  },
  colleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
