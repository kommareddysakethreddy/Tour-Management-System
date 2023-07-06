const mongoose = require('mongoose');
const user = require('./../models/userSchema');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerController');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
/* const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/user');
    },
    filename: function(req, file, cb) {
        const binary = Math.random().toString(16).substr(2, 8);
        const fieldname = file.mimetype.split('/')[1];
        const filename = `user-${req.user._id}-${binary}.${fieldname}`;
        cb(null, filename);
    },
}); */
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  console.log(file, 'file');
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please upload an Image', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const binary = Math.random().toString(16).substring(2, 8);
  req.file.filename = `user-${req.body.id}-${binary}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/user/${req.file.filename}`);
  next();
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const exludeFields = ['page', 'sort', 'limit', 'fields'];
  exludeFields.forEach((el) => delete queryObj[el]);
  // console.log(queryObj);
  const query = user.find(queryObj);
  const users = await query;
  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  console.log(req.body, req.file);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const id = req.body.id;
  // console.log(id, 'id');
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const data = await user.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(new AppError('No user found', 404));
  }
  console.log('first', data);
  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.body.id).select('+password');
  // console.log('user', user);
  if (!user) {
    return next(new AppError('please login to change password', 401));
  }
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('please enter valid password', 401));
  }
  // console.log(user, req.body);
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  const freshUser = await user.save();
  createSendToken(freshUser, 200, res);
  // console.log(freshUser);
  next();
});
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
exports.getUserById = factory.getOne(user);
exports.deleteUser = factory.deleteOne(user);
// exports.getAllUsers = factory.getAll(user);

// exports.deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined!',
//     });
// };
