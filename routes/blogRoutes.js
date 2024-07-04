const router = require('express').Router();
const blogController = require('../controllers/blogController');
const { authGuardAdmin } = require('../middleware/authGuard');

// Blog routes
router.post('/create_blog', authGuardAdmin, blogController.createBlog);
router.put('/update_blog/:id', authGuardAdmin, blogController.updateBlog);
router.delete('/delete_blog/:id', authGuardAdmin, blogController.deleteBlog);

router.get('/get_blogs', blogController.getBlogs);
router.get('/get_blog/:id', blogController.getSingleBlog);
module.exports = router;
