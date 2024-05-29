// const mongoose = require('mongoose');

// const collegeSchema = new mongoose.Schema({
//     collegeName: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     collegeDescription: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     collegeFees: {
//         type: Number,
//         required: true,
//         trim: true,
//     },
//     collegeType: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     courseName: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course',
//         required: true,
//     }],
//     collegeImageUrl: {
//         type: String,
//         required: true,
//     },
//     // createdAt: {
//     //     type: Date,
//     //     default: Date.now(),
//     // }

// })

// const College = mongoose.model('College', collegeSchema);
// module.exports = College;


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
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  collegeImageUrl: {
    type: String,
    required: true,
  },
  establishedAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;
