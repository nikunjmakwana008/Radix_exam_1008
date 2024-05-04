const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Customer = require('./../models/customerModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { json } = require('express');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  });
};

const createSendToken = (customer, statusCode, res) => {
    const token = signToken(customer._id);
    // Remove password from output
    customer.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            customer
        }
    });
};

exports.register = async (req, res, next) => {

    const newCustomer = await Customer.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        gender: req.body.gender,
        address: req.body.address,
        photo: req.body.photo
    });

    createSendToken(newCustomer, 201, res);
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body);

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const costomer = await Customer.findOne({ email }).select('+password');

  if (!costomer || !(await costomer.correctPassword(password, costomer.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(costomer, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if currentCustomer still exists
  const currentCustomer = await Customer.findById(decoded.id);
  if (!currentCustomer) {
    return next(
      new AppError(
        'User not exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentCustomer;
  next();
});