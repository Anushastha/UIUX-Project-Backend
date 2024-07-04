const express = require('express');
const courseController = require('../controllers/courseController');
const {authGuardAdmin } = require('../middleware/authGuard');

const router = express.Router();

// Course routes
router.get('/get_courses', courseController.getCourses);
router.get('/get_course/:id', courseController.getSingleCourse);

router.post('/create_course',authGuardAdmin, courseController.createCourse);
router.put('/update_course/:id',authGuardAdmin, courseController.updateCourse);
router.delete('/delete_course/:id',authGuardAdmin, courseController.deleteCourse);

module.exports = router;
