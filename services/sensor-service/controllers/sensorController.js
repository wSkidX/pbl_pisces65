const SensorData = require('../models/sensorData');

class SensorController {
  // Rate limit: minimal 1 detik antar data per tipe sensor
  static lastReceived = {};
  static async createSensorData(req, res) {
    const { type, value } = req.body;
    const now = Date.now();
    if (type) {
      if (SensorController.lastReceived[type] && now - SensorController.lastReceived[type] < 1000) {
        return res.status(429).json({ error: 'Terlalu sering mengirim data sensor yang sama, coba lagi nanti.' });
      }
      SensorController.lastReceived[type] = now;
    }
    try {
      const data = await SensorData.create({ type, value });
      res.status(201).json({ message: 'Sensor data created', dataId: data.id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create sensor data' });
    }
  }

  static async getSensorData(req, res) {
    try {
      const data = await SensorData.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve sensor data' });
    }
  }

  static async getSensorDataById(req, res) {
    try {
      const data = await SensorData.findByPk(req.params.id);
      if (data) res.json(data);
      else res.status(404).json({ error: 'Sensor data tidak ditemukan' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve sensor data' });
    }
  }

  static async updateSensorData(req, res) {
    try {
      const data = await SensorData.findByPk(req.params.id);
      if (!data) return res.status(404).json({ error: 'Sensor data tidak ditemukan' });
      await data.update(req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update sensor data' });
    }
  }

  static async deleteSensorData(req, res) {
    try {
      const data = await SensorData.findByPk(req.params.id);
      if (!data) return res.status(404).json({ error: 'Sensor data tidak ditemukan' });
      await data.destroy();
      res.json({ message: 'Sensor data dihapus' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete sensor data' });
    }
  }
}

module.exports = SensorController;