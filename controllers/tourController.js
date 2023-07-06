const tour = require('../models/tourSchema');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerController');

exports.getAllTours = catchAsync(async(req, res, next) => {
    const newTour = await tour.find();
    res.status(200).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
    next();
});

exports.getTour = factory.getOne(tour, { path: 'reviews' });
exports.createTour = factory.createOne(tour);
exports.updateTour = factory.updateOne(tour);
exports.deleteTour = factory.deleteOne(tour);
/* 
exports.getTour = catchAsync(async(req, res, next) => {
    const tourDetails = (await tour.findById(req.params.id)).populate('reviews');
    if (!tourDetails) {
        return next(new AppError('No tour found with that Id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: tourDetails,
        },
    });
    next();
});
exports.createTour = catchAsync(async(req, res, next) => {
    const newTour = await tour.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
    next();
});

exports.updateTour = catchAsync(async(req, res, next) => {
    const newTour = await tour.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
    next();
});

exports.deleteTour = catchAsync(async(req, res, next) => {
    console.log('Delete tour');
    const Tour = await tour.findByIdAndDelete(req.params.id);
    if (!Tour) {
        return next(new AppError('No tour with the given Id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            Tour,
        },
    });
    next();
}); */