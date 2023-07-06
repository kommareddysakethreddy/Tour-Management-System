const review = require('../models/reviewSchema');
// const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerController');

exports.setTourId = catchAsync(async(req, res, next) => {
    if (!req.body.tourId) req.body.tourId = req.params.tourId;
    next();
});
//exports.getAllReviews = factory.getAll(review);
exports.getAllReviews = catchAsync(async(req, res, next) => {
    console.log('getAllReviews');
    // const reviews = await review.find({ tourId: req.params.tourId });

    const reviews = await review.find();
    console.log(reviews);
    res.status(200).json({
        status: 'success',
        length: reviews.length,
        data: {
            reviews,
        },
    });
    next();
});
exports.getAllReviewsById = catchAsync(async(req, res, next) => {
    console.log(req.params.id);
    const reviews = await review.find({ userId: req.params.id });
    res.status(200).json({
        status: 'success',
        length: reviews.length,
        data: {
            reviews,
        },
    });
    next();
});
exports.createReview = factory.createOne(review);
exports.updateReview = factory.updateOne(review);
exports.deleteReview = factory.deleteOne(review);
/* exports.createReview = catchAsync(async(req, res, next) => {
    // console.log(req.body);
    const newReview = await review.create(req.body,
        tourId: req.params.tourId,
    });
    res.status(200).json({
        status: 'success',
        data: {
            review: newReview,
        },
    });
    next();
});
exports.updateReview = catchAsync(async(req, res, next) => {
    console.log(req.body);
    const newReview = await review.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
        status: 'success',
        data: {
            data: newReview,
        },
    });
    next();
});
exports.deleteReview = catchAsync(async(req, res, next) => {
    console.log(req.body);
    await review.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
    });
    next();
}); */