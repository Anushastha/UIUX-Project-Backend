const cloudinary = require("cloudinary");
const Blogs = require("../model/blogModel");
const { format } = require('date-fns');

// Create a new blog
const createBlog = async (req, res) => {
    // Step 1: Validate incoming data
    const { blogTitle, blogDescription, createdAt } = req.body;
    const { blogImage } = req.files;

    if (!blogTitle || !blogDescription || !createdAt || !blogImage) {
        return res.json({
            success: false,
            message: "Please fill all the fields",
        });
    }

    try {
        // Format the createdAt date
        const formattedDate = format(new Date(createdAt), "MMMM d, yyyy");

        // Step 2: Upload image to Cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(blogImage.path, {
            folder: "blogs",
            crop: "scale",
        });

        // Step 3: Save blog to database
        const newBlog = new Blogs({
            blogTitle: blogTitle,
            blogDescription: blogDescription,
            createdAt: formattedDate,
            blogImageUrl: uploadedImage.secure_url,
        });

        await newBlog.save();

        res.json({
            success: true,
            message: "Blog created successfully",
            blog: newBlog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Get all blogs
const getBlogs = async (req, res) => {
    try {
        const allBlogs = await Blogs.find({});
        res.json({
            success: true,
            message: "All blogs fetched successfully!",
            blogs: allBlogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get a single blog by ID
const getSingleBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const singleBlog = await Blogs.findById(blogId);
        if (!singleBlog) {
            return res.json({
                success: false,
                message: "Blog not found",
            });
        }
        res.json({
            success: true,
            message: "Blog fetched successfully",
            blog: singleBlog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update a Blog by ID
const updateBlog = async (req, res) => {
    const { blogTitle, blogDescription, createdAt } = req.body;
    const { blogImage } = req.files;

    if (!blogTitle || !blogDescription || !createdAt) {
        return res.json({
            success: false,
            message: "Required fields are missing.",
        });
    }

    try {
        // Format the createdAt date
        const formattedDate = format(new Date(createdAt), "MMMM d, yyyy");

        let updatedData = {
            blogTitle: blogTitle,
            blogDescription: blogDescription,
            createdAt: formattedDate,
        };

        if (blogImage) {
            const uploadedImage = await cloudinary.v2.uploader.upload(
                blogImage.path, {
                folder: "blogs",
                crop: "scale",
            });

            updatedData.blogImageUrl = uploadedImage.secure_url;
        }

        const blogId = req.params.id;
        await Blogs.findByIdAndUpdate(blogId, updatedData);

        res.json({
            success: true,
            message: blogImage ? "Blog updated successfully with image." : "Blog updated successfully without image.",
            updateBlog: updatedData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Delete a Blog by ID
const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        await Blogs.findByIdAndDelete(blogId);
        res.json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    createBlog,
    updateBlog,
    getBlogs,
    getSingleBlog,
    deleteBlog
};
