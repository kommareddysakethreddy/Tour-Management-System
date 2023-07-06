const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!'],
    },
    nop: {
        type: Number,
        required: [true, 'Number of people is required'],
    },
    price: {
        type: Number,
        require: [true, 'Booking must have a price.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },
});

bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name summary',
    });
    next();
});

const booking = mongoose.model('Booking', bookingSchema);

module.exports = booking;