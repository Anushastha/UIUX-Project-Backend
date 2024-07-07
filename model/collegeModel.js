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
  collegeEmail: {
    type: String,
    required: true,
  },
  collegeNumber: {
    type: Number,
    required: true,
  },
  collegeType: {  //private/public/government
    type: String,
    required: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  collegeWebsiteUrl: {
    type: String,
    required: true,
  },
  coursesAvailable: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true,
  }],

  establishedAt: {
    type: Date,
    required: true,
  },
  collegeImageUrl: {  //logo or display image
    type: String,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    googleMapsUrl: {
      type: String, // URL to Google Maps
      required: true,
    }
  },
  brochure: {
    type: String,
    required: true,
  },
  applyNow: {
    type: String,
    required: true,
  },
  galleryImages: [{
    type: String, // Array of image URLs
    required: true,
  }],
});

const Colleges = mongoose.model('colleges', collegeSchema);
module.exports = Colleges;
