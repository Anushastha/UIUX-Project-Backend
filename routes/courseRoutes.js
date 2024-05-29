const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Course routes
router.post('/courses', courseController.createCourse);
router.get('/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getSingleCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

module.exports = router;
