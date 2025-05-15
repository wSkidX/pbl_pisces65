/**
 * App configuration untuk API Gateway
 * Menggunakan Express.js
 */
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Pisces65 API Gateway',
    services: [
      { name: 'auth-service', path: '/api/auth' },
      { name: 'jadwal-service', path: '/api/jadwal' },
      { name: 'sensor-service', path: '/api/sensor' },
      { name: 'notification-service', path: '/api/notifications' },
      { name: 'dashboard', path: '/api/dashboard' }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

module.exports = app;
