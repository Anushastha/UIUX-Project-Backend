const router = require('express').Router();
const blogController = require('../controllers/blogController');

// Blog routes
router.post('/create_blog', blogController.createBlog);
router.put('/update_blog/:id', blogController.updateBlog);
router.delete('/delete_blog/:id', blogController.deleteBlog);

router.get('/get_blogs', blogController.getBlogs);
router.get('/get_blog/:id', blogController.getSingleBlog);
module.exports = router;
