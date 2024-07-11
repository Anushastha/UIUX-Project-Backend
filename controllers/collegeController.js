const cloudinary = require("cloudinary");
const Colleges = require("../model/collegeModel");
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
      googleMapsUrl,
      applyNow,
      galleryImages: galleryImagesBody
    } = req.body;
    const { collegeImage, brochure, galleryImages } = req.files;

    console.log(req.files)

    // Check required fields
    if (!collegeName || !collegeDescription || !collegeEmail || !collegeNumber || !collegeType || !affiliation || !collegeWebsiteUrl || !establishedAt || !location || !location.googleMapsUrl || !applyNow || !collegeImage || !brochure) {
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
      resource_type: "image",
    });

    //Upload bruckure to cloudinary
    const uploadedBrochure = await cloudinary.uploader.upload(brochure.path, {
      folder: "colleges/brochures",
      resource_type: "raw"
    });

    // Upload gallery images to Cloudinary
    const uploadedGalleryImages = [];
    if (galleryImages && galleryImages.length > 0) {
      for (const image of galleryImages) {
        const uploadedImage = await cloudinary.uploader.upload(image.path, {
          folder: "colleges/gallery",
          crop: "scale",
          resource_type: "image",
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
        address: location,
        googleMapsUrl: googleMapsUrl,
      },
      brochure: uploadedBrochure.secure_url,
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
      message: "Internal server error dfdf",
      error: error.message,
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
        collegeNumber: college.collegeNumber,
        collegeType: college.collegeType,
        affiliation: college.affiliation,
        collegeWebsiteUrl: college.collegeWebsiteUrl,
        coursesAvailable: college.coursesAvailable,
        establishedAt: college.establishedAt,
        collegeImageUrl: college.collegeImageUrl,
        location: {
          address: college.location.address,
          googleMapsUrl: college.location.googleMapsUrl,
        },
        brochure: college.brochure,
        applyNow: college.applyNow,
        galleryImages: college.galleryImages,
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
  try {
    const { id } = req.params;
    const college = await Colleges.findById(id).populate('coursesAvailable');

    if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }

    res.json({ success: true, college });
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
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
