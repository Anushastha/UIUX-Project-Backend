const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Course routes
router.get('/get_courses', courseController.getCourses);
router.get('/get_course/:id', courseController.getSingleCourse);

router.post('/create_course', courseController.createCourse);
router.put('/update_course/:id', courseController.updateCourse);
router.delete('/delete_course/:id', courseController.deleteCourse);
router.get('/search', courseController.searchCourses);

module.exports = router;
