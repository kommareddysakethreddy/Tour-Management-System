const express = require('express');
const userController = require('./../controllers/userControllers');
const authController = require('./../controllers/authControllers');
//ROUTER
const router = express.Router();

//ROUTES
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/updatePassword').post(authController.updatePassword);
router.route('/forgotPassword').post(authController.forgotPassword);

router.route('/:id').get(userController.getUserById);
// router.use(authController.protect);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.updatePassword);

router.delete('/deleteUser', userController.deleteUser);

router.route('/').get(userController.getAllUsers);

module.exports = router;
