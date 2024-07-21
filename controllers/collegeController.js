const cloudinary = require("cloudinary");
const Colleges = require("../model/collegeModel");
const Courses = require('../model/courseModel'); 
const { default: mongoose } = require("mongoose");

const createCollege = async (req, res) => {
  try {
    const {
      collegeName,
      collegeDescription,
      collegeEmail,
      collegeNumber,
      collegeType,
      affiliation,
      collegeWebsiteUrl,
      coursesAvailable,
      establishedAt,
      location,
      applyNow,
      galleryImages: galleryImagesBody
    } = req.body;
    const { collegeImage, brochure, galleryImages } = req.files;

    // Check required fields
    if (!collegeName || !collegeDescription || !collegeEmail || !collegeNumber || !collegeType || !affiliation || !collegeWebsiteUrl || !establishedAt || !location || !location.address || !location.googleMapsUrl || !applyNow || !collegeImage || !brochure) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Handle coursesAvailable as array of ObjectIds
    let courses = Array.isArray(coursesAvailable) ? coursesAvailable : [coursesAvailable];
    courses = courses.map(course => new mongoose.Types.ObjectId(course));

    // Upload college image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(collegeImage.path, {
      folder: "colleges",
      crop: "scale",
    });

    // Upload brochure file to Cloudinary
    const uploadedBrochure = await cloudinary.uploader.upload(brochure.path, {
      folder: "brochures",
    });

    // Upload gallery images to Cloudinary
    const uploadedGalleryImages = [];
    if (galleryImages && galleryImages.length > 0) {
      for (const image of galleryImages) {
        const uploadedImage = await cloudinary.uploader.upload(image.path, {
          folder: "gallery",
          crop: "scale",
        });
        uploadedGalleryImages.push(uploadedImage.secure_url);
      }
    }

    // Save to database
    const newCollege = new Colleges({
      collegeName,
      collegeDescription,
      collegeEmail,
      collegeNumber,
      collegeType,
      affiliation,
      collegeWebsiteUrl,
      coursesAvailable: courses,
      establishedAt,
      collegeImageUrl: uploadedImage.secure_url,
      location: {
        address: location.address,
        googleMapsUrl: location.googleMapsUrl,
      },
      brochure: uploadedBrochure.secure_url, // Store the brochure URL
      applyNow,
      galleryImages: uploadedGalleryImages.length > 0 ? uploadedGalleryImages : galleryImagesBody,
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
      error: error.message, // Optionally include error details
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
      colleges: allColleges.map(college => ({
        id: college._id,
        collegeName: college.collegeName,
        collegeDescription: college.collegeDescription,
        collegeEmail: college.collegeEmail,
        affiliation: college.affiliation,
        collegeNumber: college.collegeNumber,
        collegeType: college.collegeType,
        establishedAt: college.establishedAt,
        collegeImageUrl: college.collegeImageUrl,
        location: {
          address: college.location.address,
          googleMapsUrl: college.location.googleMapsUrl,
        },
        brochure: college.brochure,
        applyNow: college.applyNow,
        galleryImages: college.galleryImages,
        coursesAvailable: college.coursesAvailable,
      })),
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
  // Destructuring data from req.body and req.files
  const {
    collegeName,
    collegeDescription,
    collegeEmail,
    collegeNumber,
    collegeType,
    affiliation,
    collegeWebsiteUrl,
    coursesAvailable,
    establishedAt,
    location,
    applyNow,
  } = req.body;
  const { collegeImage, galleryImages, brochure } = req.files;

  // Validate required fields
  if (
    !collegeName ||
    !collegeDescription ||
    !collegeEmail ||
    !collegeNumber ||
    !collegeType ||
    !affiliation ||
    !collegeWebsiteUrl ||
    !establishedAt ||
    !location ||
    !location.address ||
    !location.googleMapsUrl ||
    !applyNow ||
    !brochure ||
    !collegeImage
  ) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing.",
    });
  }

  try {
    // Handle coursesAvailable as array of ObjectIds
    let courses = Array.isArray(coursesAvailable) ? coursesAvailable : [coursesAvailable];
    courses = courses.map((course) => new mongoose.Types.ObjectId(course));

    let updatedData = {
      collegeName,
      collegeDescription,
      collegeEmail,
      collegeNumber,
      collegeType,
      affiliation,
      collegeWebsiteUrl,
      coursesAvailable: courses,
      establishedAt,
      location: {
        address: location.address,
        googleMapsUrl: location.googleMapsUrl,
      },
      applyNow,
    };

    // Case: If there is an image
    if (collegeImage) {
      // Upload image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(collegeImage.path, {
        folder: "colleges",
        crop: "scale",
      });
      updatedData.collegeImageUrl = uploadedImage.secure_url;
    }

    // Case: If there are gallery images
    const uploadedGalleryImages = [];
    if (galleryImages && galleryImages.length > 0) {
      for (const image of galleryImages) {
        const uploadedImage = await cloudinary.uploader.upload(image.path, {
          folder: "gallery",
          crop: "scale",
        });
        uploadedGalleryImages.push(uploadedImage.secure_url);
      }
      updatedData.galleryImages = uploadedGalleryImages;
    }

    // Upload brochure file to Cloudinary if updated
    if (brochure) {
      const uploadedBrochure = await cloudinary.uploader.upload(brochure.path, {
        folder: "brochures",
      });
      updatedData.brochure = uploadedBrochure.secure_url;
    }

    // Find college and update
    const collegeId = req.params.id;
    const updatedCollege = await Colleges.findByIdAndUpdate(
      collegeId,
      updatedData,
      { new: true }
    );

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
      error: error.message,
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

const filterOptions = async (req, res) => {
  try {
    const courses = await Colleges.distinct('coursesAvailable');
    const locations = await Colleges.distinct('location.address');
    const affiliations = await Colleges.distinct('affiliation');
    const collegeTypes = await Colleges.distinct('collegeType');

    res.json({
      success: true,
      courses,
      locations,
      affiliations,
      collegeTypes,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

const filterColleges = async (req, res) => {
  try {
    const { courses, location, affiliation, collegeType } = req.query;
    let filter = {};

    if (courses) {
      filter.coursesAvailable = { $in: courses.split(',') };
    }
    if (location) {
      filter['location.address'] = location;
    }
    if (affiliation) {
      filter.affiliation = affiliation;
    }
    if (collegeType) {
      filter.collegeType = collegeType;
    }

    const filteredColleges = await Colleges.find(filter);

    res.json({
      success: true,
      colleges: filteredColleges,
    });
  } catch (error) {
    console.error('Error filtering colleges:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}

const getCollegesOfferingCourse = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    // Fetch colleges that offer the course with the given ID
    const colleges = await Colleges.find({ coursesAvailable: courseId });

    if (!colleges.length) {
      return res.json({
        success: false,
        message: "No colleges found for this course",
      });
    }

    res.json({
      success: true,
      message: "Colleges fetched successfully",
      colleges: colleges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
  filterColleges,
  filterOptions,
  getCollegesOfferingCourse
};