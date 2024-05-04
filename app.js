const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const app = express();

const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// All routers 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use('/api/customers',customerRoutes);
app.use('/api/auth',authRoutes);

app.use(mongoSanitize());


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
