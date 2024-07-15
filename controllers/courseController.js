const cloudinary = require("cloudinary");
const Courses = require("../model/courseModel");

// Create a new course
const createCourse = async (req, res) => {
  // Step 1: Validate incoming data
  const { courseName, courseDescription, expectedFeesMin, expectedFeesMax, averageDurationMin, averageDurationMax } = req.body;
  const { courseImage } = req.files;

  if (!courseName || !courseDescription || !expectedFeesMin || !expectedFeesMax || !averageDurationMin || !averageDurationMax || !courseImage) {
    return res.json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  try {
    // Step 2: Upload image to Cloudinary
    const uploadedImage = await cloudinary.v2.uploader.upload(courseImage.path, {
      folder: "courses",
      crop: "scale",
    });

    // Step 3: Save course to database
    const newCourse = new Courses({
      courseName: courseName,
      courseDescription: courseDescription,
      expectedFeesMin: expectedFeesMin,
      expectedFeesMax: expectedFeesMax,
      averageDurationMin: averageDurationMin,
      averageDurationMax: averageDurationMax,
      courseImageUrl: uploadedImage.secure_url,
    });

    await newCourse.save();

    res.json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const allCourses = await Courses.find({});
    res.json({
      success: true,
      message: "All courses fetched successfully!",
      courses: allCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a single course by ID
const getSingleCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const singleCourse = await Courses.findById(courseId);
    if (!singleCourse) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }
    res.json({
      success: true,
      message: "Course fetched successfully",
      course: singleCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a course by ID
const updateCourse = async (req, res) => {
  const { courseName, courseDescription, expectedFeesMin, expectedFeesMax, averageDurationMin, averageDurationMax } = req.body;
  const { courseImage } = req.files;

  if (!courseName || !courseDescription || !expectedFeesMin || !expectedFeesMax || !averageDurationMin || !averageDurationMax) {
    return res.json({
      success: false,
      message: "Required fields are missing.",
    });
  }

  try {
    let updatedData = {
      courseName: courseName,
      courseDescription: courseDescription,
      expectedFeesMin: expectedFeesMin,
      expectedFeesMax: expectedFeesMax,
      averageDurationMin: averageDurationMin,
      averageDurationMax: averageDurationMax,
    };

    if (courseImage) {
      const uploadedImage = await cloudinary.v2.uploader.upload(courseImage.path, {
        folder: "courses",
        crop: "scale",
      });

      updatedData.courseImageUrl = uploadedImage.secure_url;
    }

    const courseId = req.params.id;
    await Courses.findByIdAndUpdate(courseId, updatedData);

    res.json({
      success: true,
      message: courseImage ? "Course updated successfully with image." : "Course updated successfully without image.",
      updateCourse: updatedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    await Courses.findByIdAndDelete(courseId);
    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const searchCourses = async (req, res) => {
  const query = req.query.query;
  try {
    const courses = await Courses.find({
      courseName: { $regex: query, $options: "i" },
    });
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error searching courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  searchCourses
};
