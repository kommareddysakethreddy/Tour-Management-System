const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is required'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Review must have a rating'],
    },
    tourId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Tour Id is required'],
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User Id is required'],
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.pre(/^find/, function() {
    this.populate({ path: 'tourId', select: 'name state' });
    this.populate({
        path: 'userId',
        select: 'name',
    });
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;