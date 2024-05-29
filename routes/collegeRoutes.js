const express = require('express');
const collegeController = require('../controllers/collegeController');

const router = express.Router();

// College routes
router.post('/colleges', collegeController.createCollege);
router.get('/colleges', collegeController.getColleges);
router.get('/colleges/:id', collegeController.getSingleCollege);
router.put('/colleges/:id', collegeController.updateCollege);
router.delete('/colleges/:id', collegeController.deleteCollege);
router.post('/colleges/addCourse', collegeController.addCourseToCollege);

module.exports = router;
