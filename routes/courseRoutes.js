const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Course routes
router.post('/create_course', courseController.createCourse);
router.get('/get_courses', courseController.getCourses);
router.get('/get_course/:id', courseController.getSingleCourse);
router.put('/update_course/:id', courseController.updateCourse);
router.delete('/delete_course/:id', courseController.deleteCourse);

module.exports = router;
