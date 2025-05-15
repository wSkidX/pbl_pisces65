/**
 * Routes untuk SensorData
 * Menggunakan pendekatan DDD dengan resource-based URL
 * Menggunakan shared middleware autentikasi
 */
const express = require('express');
const SensorController = require('../controllers/sensorController');
const { Op } = require('sequelize');

// Import shared middleware
// Catatan: Perlu menambahkan dependency di package.json:
// "pisces65-shared": "file:../../shared"
const { authMiddleware } = require('pisces65-shared');

const router = express.Router();

// CRUD operations dengan resource-based URL - memerlukan autentikasi untuk write operations
router.post('/sensors', authMiddleware.authenticateJWT, SensorController.createSensorData);       // Create sensor data baru
router.get('/sensors', authMiddleware.optionalAuthenticateJWT, SensorController.getSensorData);    // Get semua sensor data
router.get('/sensors/:id', authMiddleware.optionalAuthenticateJWT, SensorController.getSensorDataById); // Get sensor data by ID
router.put('/sensors/:id', authMiddleware.authenticateJWT, SensorController.updateSensorData);    // Update sensor data
router.delete('/sensors/:id', authMiddleware.authenticateJWT, SensorController.deleteSensorData); // Delete sensor data

// Endpoint untuk monitoring dan dashboard - opsional autentikasi
router.get('/monitoring/current-stock', authMiddleware.optionalAuthenticateJWT, SensorController.getCurrentStock);  // Stok pakan dan air terkini
router.get('/monitoring/status', authMiddleware.optionalAuthenticateJWT, SensorController.getAllSensorStatus);      // Status semua sensor
router.get('/monitoring/system', authMiddleware.optionalAuthenticateJWT, SensorController.getSystemStatus);         // Status sistem
router.get('/monitoring/stats', authMiddleware.optionalAuthenticateJWT, SensorController.getSensorStats);           // Statistik sensor
router.get('/monitoring/feeding-logs', authMiddleware.optionalAuthenticateJWT, SensorController.getFeedingLogs);    // Log feeding

// Backward compatibility untuk API lama - dengan autentikasi yang sama
router.post('/data', authMiddleware.authenticateJWT, SensorController.createSensorData);
router.get('/data', authMiddleware.optionalAuthenticateJWT, SensorController.getSensorData);
router.get('/data/:id', authMiddleware.optionalAuthenticateJWT, SensorController.getSensorDataById);
router.put('/data/:id', authMiddleware.authenticateJWT, SensorController.updateSensorData);
router.delete('/data/:id', authMiddleware.authenticateJWT, SensorController.deleteSensorData);
router.get('/current_stock', authMiddleware.optionalAuthenticateJWT, SensorController.getCurrentStock);
router.get('/status', authMiddleware.optionalAuthenticateJWT, SensorController.getAllSensorStatus);
router.get('/logs', authMiddleware.optionalAuthenticateJWT, SensorController.getFeedingLogs);
router.get('/system_status', authMiddleware.optionalAuthenticateJWT, SensorController.getSystemStatus);

module.exports = router;
