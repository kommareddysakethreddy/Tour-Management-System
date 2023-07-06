const express = require('express');
const tourController = require('./../controllers/tourController');
const reviewRoutes = require('./reviewRoutes');
const router = express.Router();
router.use('/:tourId/reviews', reviewRoutes);

router
    .get('/getAllTours', tourController.getAllTours)
    .post('/createTour', tourController.createTour)
    .patch('/updateTour/:id', tourController.updateTour)
    .delete(
        '/deleteTour/:id',
        // tourcontrollwer.resrtictTo('admin'),
        tourController.deleteTour
    );
router.get('/:id', tourController.getTour);

module.exports = router;