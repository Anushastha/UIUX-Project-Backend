const Course = require('../model/courseModel');

const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('colleges');
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('colleges');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Course fetched successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('colleges');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
