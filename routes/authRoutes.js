const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// router.patch(
//   '/updateMyPassword',
//   authController.protect,
//   authController.updatePassword
// );

// router.patch('/updateMe', authController.protect, customerController.updateMe);
// router.delete('/deleteMe', authController.protect, customerController.deleteMe);

module.exports = router;