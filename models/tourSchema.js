const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [4, 'A tour name must have more or equal then 10 characters'],
        unique: true,
        trim: true,
    },
    state: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
        default: 2,
    },
    price: {
        type: Number,
        // required: [true, 'A tour must have a price'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult',
        },
        default: 'medium',
    },
    maxGroupSize: {
        type: Number,
        default: 20,
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
    },
    description: {
        type: String,
        required: [true, 'A tour must have a description'],
    },
    type: {
        type: String,
        enum: {
            values: [
                'Hill Station',
                'Beach',
                'Lake & Backwater',
                'Waterfall',
                'Nature & Scenic',
                'Adventure / Trekking',
                'City',
                'Pilgrimage',
                'Historical & Heritage',
            ],
            message: 'Please enter valid location',
        },
    },
    image: String,
    imageCover: [String],
    /*  locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
    }, ], */
    location: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }, ],
    reviews: {
        type: mongoose.ObjectId,
        ref: 'Review',
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
tourSchema.pre(/^find/, function() {
    this.populate({
        path: 'guides',
        select: 'name',
    });
});
// tourSchema.pre('save', function() {
//     this.price = this.duration * 25;
//     this.image = `${this.name}-1`;
// });
const tour = mongoose.model('Tour', tourSchema);
module.exports = tour;