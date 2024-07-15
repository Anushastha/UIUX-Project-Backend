const router = require('express').Router();
const collegeController = require('../controllers/collegeController');

// College routes
router.post('/create_college', collegeController.createCollege);
router.put('/update_college/:id', collegeController.updateCollege);
router.delete('/delete_college/:id', collegeController.deleteCollege);

router.get('/get_colleges', collegeController.getColleges);
router.get('/get_college/:id', collegeController.getSingleCollege);
router.get('/search', collegeController.searchColleges);
router.get('/filter', collegeController.filterColleges);
router.get('/filter_options', collegeController.filterOptions);


module.exports = router;
