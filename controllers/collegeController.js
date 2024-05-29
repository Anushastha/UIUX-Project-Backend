const College = require('../models/college');
const Course = require('../models/course');

const createCollege = async (req, res) => {
  try {
    const college = new College(req.body);
    await college.save();
    res.status(201).json({
      success: true,
      message: 'College created successfully',
      college,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().populate('courses');
    res.status(200).json({
      success: true,
      message: 'Colleges fetched successfully',
      colleges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate('courses');
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    res.status(200).json({
      success: true,
      message: 'College fetched successfully',
      college,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('courses');
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    res.status(200).json({
      success: true,
      message: 'College updated successfully',
      college,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    res.status(200).json({
      success: true,
      message: 'College deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCourseToCollege = async (req, res) => {
  try {
    const { collegeId, courseId } = req.body;
    const college = await College.findById(collegeId);
    const course = await Course.findById(courseId);

    if (!college || !course) {
      return res.status(404).json({ success: false, message: 'College or Course not found' });
    }

    college.courses.push(courseId);
    course.colleges.push(collegeId);

    await college.save();
    await course.save();

    res.status(200).json({ success: true, message: 'Course added to College successfully', college, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCollege,
  getColleges,
  getSingleCollege,
  updateCollege,
  deleteCollege,
  addCourseToCollege,
};
