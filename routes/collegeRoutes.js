const router = require('express').Router();
const collegeController = require('../controllers/collegeController');

// College routes
router.post('/create_college', collegeController.createCollege);
router.put('/update_college/:id', collegeController.updateCollege);
router.delete('/delete_college/:id', collegeController.deleteCollege);

router.get('/get_colleges', collegeController.getColleges);
router.get('/get_college/:id', collegeController.getSingleCollege);
// router.post('/colleges/addCourse', collegeController.addCourseToCollege);

module.exports = router;
