const router = require('express').Router();
const collegeController = require('../controllers/collegeController');
const { authGuardAdmin } = require('../middleware/authGuard');


// College routes
router.post('/create_college', authGuardAdmin, collegeController.createCollege);
router.put('/update_college/:id', authGuardAdmin, collegeController.updateCollege);
router.delete('/delete_college/:id', authGuardAdmin, collegeController.deleteCollege);

router.get('/get_colleges', collegeController.getColleges);
router.get('/get_college/:id', collegeController.getSingleCollege);
router.get('/search', collegeController.searchColleges);


module.exports = router;
