const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const razorpayRouter = require('./routes/razorpay');
const app = express();
dotenv.config({ path: './config.env' });

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.use(cors());

app.options('*', cors());
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.set('view engine', 'ejs');
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
mongoose.connect(process.env.DATABASE_LOCAL);

mongoose.connection.on('connected', () =>
  console.log('connected to database successfully')
);

app.use('/checkout', razorpayRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/users/:id', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`), 404);
});

app.use(globalErrorHandler);
// //STARTING A SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
