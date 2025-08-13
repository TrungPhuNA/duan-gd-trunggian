const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = null;

  // Sequelize validation errors
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Validation error';
    errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
  }

  // Sequelize unique constraint errors
  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'Resource already exists';
    errors = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} already exists`,
      value: error.value
    }));
  }

  // Sequelize foreign key constraint errors
  if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File too large';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  // Database connection errors
  if (err.name === 'SequelizeConnectionError') {
    statusCode = 503;
    message = 'Database connection error';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  AppError
};
