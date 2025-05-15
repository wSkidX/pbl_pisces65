/**
 * App configuration untuk notification-service
 * Menggunakan Express.js
 */
const express = require('express');
const cors = require('cors');
const { errorMiddleware } = require('pisces65-shared');
const notificationRoutes = require('./routes/notificationRoutes');

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

// Error handling middleware
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.validationErrorHandler);
app.use(errorMiddleware.errorHandler);

module.exports = app;
