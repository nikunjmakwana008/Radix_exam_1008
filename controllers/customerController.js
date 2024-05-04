const Customer = require('./../models/customerModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
// const multipart = require('connect-multiparty');
// const express = require('express');

// const app = express();
// app.use(multipart());

exports.getAllCustomers = catchAsync( async (req, res, next) => {


    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
   
    const customer = await Customer.find(req.query).skip(skip).limit(limit);

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: customer.length,
        data: {
            customer
        }
    });
});

exports.getCustomer = catchAsync( async (req, res, next) => {

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            customer: customer
        }
    });
});

exports.createCustomer = catchAsync( async (req, res, next) => {
    // const uploadImg = multer({storage: storage}).single('photo');

    const newUser = await Customer.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        gender: req.body.gender,
        address: req.body.address,
        photo: req.body.photo
    });

    res.status(201).json({
        status: 'success',
        data: {
            newUser: newUser
        }
    });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            customer
        }
    });
});

exports.deleteCustomer = catchAsync(async (req, res, next) => {

    console.log(req.params.id);

    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            customer: "Deleted"
        }
    });
});

exports.getProfileImage = catchAsync( async (req, res, next) => {

    const customer = await Customer.findById(req.params.id).select('photo');

    if (!customer) {
        return next(new AppError('No customer found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            customer: customer
        }
    });
});