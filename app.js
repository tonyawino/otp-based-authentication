const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const registerRouter = require('./routes/register');
const getOtpRouter = require('./routes/getotp');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const app = express();

// db connection
const db =require('./helper/db')();

//Config Files
require('dotenv').config();

// Middleware
const verifyBaseToken=require('./middleware/basetoken');
const verifyTempToken=require('./middleware/temptoken');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRouter);
app.use('/getotp', getOtpRouter);
app.use('/login', verifyTempToken, loginRouter);
app.use('/api', verifyBaseToken);
app.use('/api/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
