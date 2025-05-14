const express = require('express');
const SensorController = require('../controllers/sensorController');

const router = express.Router();

router.post('/data', SensorController.createSensorData);
router.get('/data', SensorController.getSensorData);
router.get('/data/:id', SensorController.getSensorDataById);
router.put('/data/:id', SensorController.updateSensorData);
router.delete('/data/:id', SensorController.deleteSensorData);

// Endpoint baru untuk fitur monitoring dan histori
router.get('/current_stock', SensorController.getCurrentStock);
router.get('/status', SensorController.getAllSensorStatus);
router.get('/logs', SensorController.getFeedingLogs);
router.get('/system_status', SensorController.getSystemStatus);

module.exports = router;
