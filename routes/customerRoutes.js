const express = require('express');
const customerController = require('./../controllers/customerController');
const authController = require('./../controllers/authController');

const router = express.Router();


router
  .route('/profile/:id')
  .get(customerController.getProfileImage);

router
  .route('/')
  .get(authController.protect,customerController.getAllCustomers)
  .post(authController.protect,customerController.createCustomer);

router
  .route('/:id')
  .get(authController.protect,customerController.getCustomer)
  .patch(authController.protect,customerController.updateCustomer)
  .delete(authController.protect,customerController.deleteCustomer);

module.exports = router;