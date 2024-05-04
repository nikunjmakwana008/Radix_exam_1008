const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type:String
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  phone: {
    type: Number,
    required: [true, 'Please provide a Phone Number'],
    maxlenght: 10,
  },
  address: {
    type: String,
    maxlenght: 255,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
});

customerSchema.pre('save', async function(next) {
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

customerSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;