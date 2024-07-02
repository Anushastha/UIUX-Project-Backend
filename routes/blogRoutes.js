const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Blog routes
router.post('/create_blog', blogController.createBlog);
router.get('/get_blogs', blogController.getBlogs);
router.get('/get_blog/:id', blogController.getSingleBlog);
router.put('/update_blog/:id', blogController.updateBlog);
router.delete('/delete_blog/:id', blogController.deleteBlog);

module.exports = router;
