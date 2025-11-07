import config from '../config/config.js';

/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Handler
 */
export const notFound = (req, res, next) => {
  const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: error.statusCode
    });
  }

  // Mongoose Bad ObjectId Error
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new AppError(message, 401);
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = new AppError(message, 401);
  }

  // Multer Error
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('File too large', 400);
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error = new AppError('Too many files', 400);
    } else {
      error = new AppError(err.message, 400);
    }
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

/**
 * Handle Unhandled Promise Rejections
 */
export const handleUnhandledRejection = (server) => {
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

/**
 * Handle Uncaught Exceptions
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
  });
};

/**
 * Validation Error Creator
 */
export const createValidationError = (message) => {
  return new AppError(message, 400);
};

/**
 * Not Found Error Creator
 */
export const createNotFoundError = (resource) => {
  return new AppError(`${resource} not found`, 404);
};

/**
 * Unauthorized Error Creator
 */
export const createUnauthorizedError = (message = 'Unauthorized access') => {
  return new AppError(message, 401);
};

/**
 * Forbidden Error Creator
 */
export const createForbiddenError = (message = 'Access forbidden') => {
  return new AppError(message, 403);
};

export default {
  AppError,
  asyncHandler,
  notFound,
  errorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  createValidationError,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError
};
