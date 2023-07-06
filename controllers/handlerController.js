const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerController');

exports.createOne = (Model) =>
    catchAsync(async(req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(200).json({
            status: 'success',
            data: { doc },
        });
        next();
    });
exports.updateOne = (Model) =>
    catchAsync(async(req, res, next) => {
        const doc = await tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError('No document found with the given Id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
        next();
    });
exports.deleteOne = (Model) =>
    catchAsync(async(req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(new AppError('No document found with the given Id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: null,
        });
        next();
    });

exports.getOne = (Model, populateOptions) =>
    catchAsync(async(req, res, next) => {
        console.log(req.params.id);
        let query = Model.findById(req.params.id);
        if (populateOptions) query.populate(populateOptions);
        const doc = await query;
        if (!doc) {
            return next(new AppError('No document found with that Id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
        next();
    });

exports.getAll = (Model) =>
    catchAsync(async(req, res, next) => {
        let query = Model.find();
        const doc = await query;
        if (!doc) {
            return next(new AppError('No document found with that Id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
        next();
    });