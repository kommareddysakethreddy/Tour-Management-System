const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const Tour = require('../models/tourSchema');
// const user = require('../models/userSchema');
const AppError = require('../utils/appError');
const booking = require('../models/bookingSchema');
const paymentDetails = require('./../models/paymentDetails');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerController');
const Razorpay = require('razorpay');
const tour = require('../models/tourSchema');
exports.getBooking = factory.getOne(booking);
exports.getAllBookings = factory.getAll(booking);
exports.updateBooking = factory.updateOne(booking);
exports.deleteBooking = factory.deleteOne(booking);
let razorPayInstance = new Razorpay({
    key_id: 'rzp_test_bAVKrjoiT2XF9U',
    key_secret: 'nKntTxOOt0XM7EhJgPX1zdR3',
});
exports.createBooking = catchAsync(async(req, res, next) => {
    const id = req.body.tour;
    let updated = await Tour.findById(id);
    if (updated.maxGroupSize - req.body.nop < 0) {
        return next(
            AppError(
                'error in Placing order, No of seats requested is not available',
                500
            )
        );
    }

    const params = {
        amount: req.body.price,
        currency: 'INR',
        receipt: 'receipt1',
        payment_capture: '1',
    };
    // console.log('first in create Booking');
    const data = await razorPayInstance.orders.create(params);

    if (!data) {
        return next(
            AppError('error in Placing order, please try again later', 500)
        );
    }
    // console.log('data: ', data);
    const paymentDetail = await paymentDetails.create({
        orderId: data.id,
        receiptId: data.receipt,
        amount: data.amount,
        currency: data.currency,
        createdAt: data.created_at,
        status: data.status,
    });
    if (!paymentDetail) {
        return next(AppError('error in placing order', 500));
    }

    const order = await booking.create({
        ...req.body,
    });
    console.log('Order done');
    console.log(order);
    updated.maxGroupSize = updated.maxGroupSize - req.body.nop;
    updated.save();
    console.log(updated);
    if (updated) {
        console.log('Updated successfully');
    }
    // console.log('payment detail', req.body);

    // if (!order) {
    //     return next(AppError('Sorry cannot place order. Incase money is debited, it will be credted very soon.', 500));
    // }
    res.status(200).json({
        status: 'status',
        paymentDetail,
    });
    next();
});
exports.getBookingsById = catchAsync(async(req, res, nex) => {
    const data = await booking.find({ user: req.params.id });
    if (!data) {
        res.status(404).json({
            status: 'fail',
            message: 'No tours found',
        });
    }
    // console.log(data);
    res.status(200).json({
        status: 'success',
        data,
    });
});