const express = require('express');
const reviewController = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
    .get('/getAllReviews', reviewController.getAllReviews)
    .post(
        '/createReview',
        reviewController.setTourId,
        reviewController.createReview
    )
    .patch('/updateReview/:id', reviewController.updateReview)
    .delete('/deleteReview/:id', reviewController.deleteReview);

module.exports = router;