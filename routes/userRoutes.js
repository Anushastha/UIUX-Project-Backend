// import
const router = require('express').Router();
const userController = require("../controllers/userController");

router.post('/create', userController.createUser)
router.post('/login', userController.loginUser)

router.post('/reset_password', userController.resetPassword);
router.post('/reset_code', userController.verifyResetCode);
router.post('/update_password', userController.updatePassword);

router.post('/change_password', userController.changePassword);
router.get("/profile", userController.getUserProfile);
router.put("/update_profile/:id", userController.updateUserProfile);


// exporting
module.exports = router;