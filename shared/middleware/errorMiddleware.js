/**
 * Error Middleware
 * Middleware untuk handling error di semua service
 */

/**
 * Middleware untuk handling 404 Not Found
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware untuk handling error
 * Format error response sesuai dengan standar API
 */
const errorHandler = (err, req, res, next) => {
  // Status code defaultnya 500 jika tidak ada status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    detail: err.detail || 'Terjadi kesalahan pada server'
  });
};

/**
 * Middleware untuk handling validation error dari Sequelize
 */
const validationErrorHandler = (err, req, res, next) => {
  // Cek apakah error dari Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      detail: 'Data yang dikirim tidak valid',
      errors
    });
  }
  
  // Jika bukan error dari Sequelize, lanjutkan ke middleware berikutnya
  next(err);
};

/**
 * Middleware untuk handling async error
 * Ini akan menangkap error yang terjadi di async function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  notFound,
  errorHandler,
  validationErrorHandler,
  asyncHandler
};
