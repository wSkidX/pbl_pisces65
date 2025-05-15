/**
 * Main routes untuk API Gateway
 * Menghubungkan semua service
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dashboardRoutes = require('./dashboard');

const router = express.Router();

// Auth Service Proxy
const authServiceProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api', // Rewrite path
  },
});

// Jadwal Service Proxy
const jadwalServiceProxy = createProxyMiddleware({
  target: process.env.JADWAL_SERVICE_URL || 'http://jadwal-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/jadwal': '/api', // Rewrite path
  },
});

// Sensor Service Proxy
const sensorServiceProxy = createProxyMiddleware({
  target: process.env.SENSOR_SERVICE_URL || 'http://sensor-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/sensor': '/api', // Rewrite path
  },
});

// Notification Service Proxy
const notificationServiceProxy = createProxyMiddleware({
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/api', // Rewrite path
  },
});

// Routes
router.use('/auth', authServiceProxy);
router.use('/jadwal', jadwalServiceProxy);
router.use('/sensor', sensorServiceProxy);
router.use('/notifications', notificationServiceProxy);
router.use('/dashboard', dashboardRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

module.exports = router;
