const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const Email = require('../utils/Email');
const User = require('../models/userSchema');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const { findById } = require('../models/userSchema');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // console.log('sign up');
  req.body.OTPcreatedAt = Date.now();
  const newUser = await User.create(req.body);
  // await new Email(newUser, 'Upload image by logging in').sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select('+password');
  // console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email Id or password', 404));
  }
  createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError('No user exist with provided email id', 404));
  }
  const resetToken = user.passwordResetToken();
  const updated = await user.save({ validateBeforeSave: false });
  console.log(updated);
  // const URL = `https://localhost/resetPassword.html/${resetToken}`;
  const URL = `${resetToken}`;

  // console.log('Hey!', URL);
  await new Email(user, URL).sendPasswordReset();
  res.status(200).json({
    status: 'success',
    message: 'Mail sent successfully',
  });
  next();
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. whether token with user exist
  //2. get password and confirm password
  const token = req.body.token;
  console.log(token);
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordresetToken: hashedToken,
    // resetTokenExpriresIn: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return next(new AppError('Invalid token or has expired!', 404));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordresetToken = undefined;
  user.resetTokenExpriresIn = undefined;
  await user.save();
  createSendToken(User, 200, res);
  next();
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
exports.protect = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({
      status: 'fail',
      message: `please login to access portal`,
    });
    return;
  }
  const arr = req.headers.authorization.split(' ');
  if (req.headers.authorization && arr[0] === 'Bearer') {
    if (!arr[1]) {
      res.status(401).json({
        status: 'fail',
        message: `you are not logged in! please login to get access`,
      });
      return next();
    }
  }
  // console.log(req.headers.authorization);
  try {
    const decoded = await jwt.verify(arr[1], process.env.JWT_SECRET);
    // console.log(decoded);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      res.status(401).json({
        status: 'fail',
        message: `please login again!`,
      });
    }
    req.user = freshUser;
    res.locals.user = freshUser;
    // console.log("User found");
    next();
  } catch (err) {
    // console.log(err);
    res.status(401).json({
      status: 'fail',
      message: 'Something went wrong! Please try logging in or try again later',
    });
  }
};
exports.getMe = catchAsync(async (req, res, next) => {
  const freshUser = await User.findById(req.user._id);
  if (!freshUser) {
    return next(new AppError('please login again!', 401));
  }
  // console.log(freshUser);
  next();
});
