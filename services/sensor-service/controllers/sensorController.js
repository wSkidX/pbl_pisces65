const SensorData = require('../models/sensorData');

class SensorController {
  // Rate limit: minimal 1 detik antar data per tipe sensor
  static lastReceived = {};
  static async createSensorData(req, res) {
    try {
      const now = Date.now();
      const { type } = req.body;
      if (type) {
        if (SensorController.lastReceived[type] && now - SensorController.lastReceived[type] < 1000) {
          return res.status(429).json({ error: 'Terlalu sering mengirim data sensor yang sama, coba lagi nanti.' });
        }
        SensorController.lastReceived[type] = now;
      }
      // allowedFields diupdate sesuai field model
      const allowedFields = ['jumlahPakanKering', 'jumlahAir', 'mode', 'waktu_pakan'];
      const payload = {};
      allowedFields.forEach(f => {
        if (req.body[f] !== undefined) payload[f] = req.body[f];
      });
      // Default mode dan waktu_pakan kalau tidak dikirim dari frontend
      if (!payload.mode) payload.mode = 'manual';
      if (!payload.waktu_pakan) payload.waktu_pakan = new Date();
      const data = await SensorData.create(payload);
      res.status(201).json({ message: 'Sensor data created', dataId: data.id });
    } catch (error) {
      console.error('SensorData Create Error:', error);
      res.status(400).json({ error: 'Failed to create sensor data', detail: error.message });
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

      const allowedFields = ['jumlahPakanKering', 'jumlahAir', 'mode', 'waktu_pakan'];
      const payload = {};
      allowedFields.forEach(f => {
        if (req.body[f] !== undefined) payload[f] = req.body[f];
      });
      await data.update(payload);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update sensor data', detail: error.message });
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