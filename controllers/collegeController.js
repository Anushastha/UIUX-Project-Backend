const cloudinary = require("cloudinary");
const Colleges = require("../model/collegeModel");

const createCollege = async (req, res) => {
  try {
    const { collegeName, collegeDescription, collegeFees, collegeType, establishedAt } = req.body;
    const { collegeImage } = req.files;
    let { courses } = req.body;

    if (!collegeName || !collegeDescription || !collegeFees || !collegeType || !establishedAt || !collegeImage) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Ensure courses is an array
    if (!Array.isArray(courses)) {
      courses = [courses];
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(collegeImage.path, {
      folder: "colleges",
      crop: "scale",
    });

    // Save to database
    const newCollege = new Colleges({
      collegeName,
      collegeDescription,
      collegeFees,
      collegeType,
      coursesAvailable: courses,
      establishedAt,
      collegeImageUrl: uploadedImage.secure_url,
    });
    await newCollege.save();

    res.json({
      success: true,
      message: "College created successfully",
      college: newCollege,
    });
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getColleges = async (req, res) => {
  try {
    const allColleges = await Colleges.find({})
      .populate('coursesAvailable')  // Populate coursesAvailable with actual courses
      .exec();

    res.json({
      success: true,
      message: "All colleges fetched successfully!",
      colleges: allColleges,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSingleCollege = async (req, res) => {
  const collegeId = req.params.id;
  try {
    const singleCollege = await Colleges.findById(collegeId);
    if (!singleCollege) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }
    res.json({
      success: true,
      message: "College fetched successfully",
      college: singleCollege,
    });
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCollege = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  // Destructuring data
  const { collegeName, collegeDescription, collegeFees, collegeType, courses, establishedAt } = req.body;
  const { collegeImage } = req.files;

  // Validate data
  if (!collegeName || !collegeDescription || !collegeFees || !collegeType || !courses || !establishedAt) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing.",
    });
  }

  try {
    let updatedData = {
      collegeName,
      collegeDescription,
      collegeFees,
      collegeType,
      courses,
      establishedAt,
    };

    // Case 1: If there is an image
    if (collegeImage) {
      // Upload image to Cloudinary
      const uploadedImage = await cloudinary.v2.uploader.upload(collegeImage.path, {
        folder: "colleges",
        crop: "scale",
      });
      updatedData.collegeImageUrl = uploadedImage.secure_url;
    }

    // Find college and update
    const collegeId = req.params.id;
    const updatedCollege = await Colleges.findByIdAndUpdate(collegeId, updatedData, { new: true });

    if (!updatedCollege) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({
      success: true,
      message: "College updated successfully",
      updatedCollege,
    });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCollege = async (req, res) => {
  const collegeId = req.params.id;

  try {
    const deletedCollege = await Colleges.findByIdAndDelete(collegeId);

    if (!deletedCollege) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    res.json({
      success: true,
      message: "College deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const searchColleges = async (req, res) => {
  const query = req.query.query;
  try {
    const colleges = await Colleges.find({
      collegeName: { $regex: query, $options: "i" },
    });
    res.status(200).json({
      success: true,
      colleges,
    });
  } catch (error) {
    console.error("Error searching colleges:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCollege,
  getColleges,
  getSingleCollege,
  updateCollege,
  deleteCollege,
  searchColleges,
};
