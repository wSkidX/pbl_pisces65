const express = require('express');
const SensorController = require('../controllers/sensorController');

const router = express.Router();

router.post('/data', SensorController.createSensorData);
router.get('/data', SensorController.getSensorData);
router.get('/data/:id', SensorController.getSensorDataById);
router.put('/data/:id', SensorController.updateSensorData);
router.delete('/data/:id', SensorController.deleteSensorData);

module.exports = router;
