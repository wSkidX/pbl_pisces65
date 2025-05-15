/**
 * Shared Utilities for Pisces65 Services
 * Berisi utility dan middleware yang bisa digunakan di semua service
 */

// Export middleware
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

module.exports = {
  // Auth middleware
  authMiddleware,
  // Error handling middleware
  errorMiddleware
};
