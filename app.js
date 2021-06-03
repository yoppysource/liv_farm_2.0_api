const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const couponRouter = require('./routes/couponRoutes');
const itemRouter = require('./routes/itemRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const appInfoRouter = require('./routes/appInfoRoutes');
const openingHourRouter = require('./routes/openingHourRoutes');
const eventRouter = require('./routes/eventRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public-flutter')));

/* GLOBAL MIDDLEWARE */

// Set security HTTP headers
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Limit requests from same IP
const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
// Body larger than 10kb it will not be accepted
app.use(
  express.json({
    limit: '10kb',
  })
);

//Allow Cross-Origin Resource Sharing
//TODO: For depolying it should be managed with whitelist
// if (process.env.NODE_ENV === "development")
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//Prevent malicious query injection
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//Read Cookie
app.use(cookieParser());
// Data sanitization against NOSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

// Add requestTime for debugging
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/* API ROUTER */
//USER
app.use('/api/v1/users', userRouter);

//TODO: Implement.
// //PRODUCT
app.use('/api/v1/products', productRouter);

// //SERVICE
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/coupons', couponRouter);
// Cart Router include items as well.
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);

app.use('/api/v1/appInfo', appInfoRouter);
app.use('/api/v1/openingHour', openingHourRouter);

app.use('/api/v1/events', eventRouter);

/* GLOBAL ERROR MANAGEMENT */
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
