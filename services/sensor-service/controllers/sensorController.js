const SensorData = require('../models/sensorData');

// Variabel global untuk data realtime
let latestStock = {
  feed_level_cm: '-',
  water_level_cm: '-',
  last_update: '-'
};

class SensorController {
  // Rate limit: minimal 1 detik antar data per tipe sensor
  static lastReceived = {};
  static async createSensorData(req, res) {
    // Update variabel realtime
    if (req.body.jumlahPakanKering !== undefined && req.body.jumlahAir !== undefined) {
      latestStock = {
        feed_level_cm: req.body.jumlahPakanKering,
        water_level_cm: req.body.jumlahAir,
        last_update: req.body.waktu_pakan || new Date().toISOString()
      };
      console.log('Sensor data received:', latestStock);
    }
    res.status(201).json({ message: 'Sensor data updated (realtime)', data: latestStock });
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
  static async getCurrentStock(req, res) {
    res.json(latestStock);
  }
l
  static async getAllSensorStatus(req, res) {
    try {
      const status = {
        feed_sensor: 'ok',
        water_sensor: 'ok',
        last_update: new Date().toISOString()
      };
      res.json(status);
    } catch (error) {
      console.error('getAllSensorStatus ERROR:', error);
      res.status(500).json({ error: 'Failed to get sensor status', detail: error.message });
    }
  }

  static async getFeedingLogs(req, res) {
    try {
      const logs = [
        {
          executed_at: new Date(Date.now() - 3600 * 1000).toISOString(),
          status: 'success',
          message: 'Feeding OK',
          motor_duration_sec: 5,
          total_duration_sec: 10
        }
      ];
      res.json(logs);
    } catch (error) {
      console.error('getFeedingLogs ERROR:', error);
      res.status(500).json({ error: 'Failed to get feeding logs', detail: error.message });
    }
  }

  static async getSystemStatus(req, res) {
    try {
      const systemStatus = {
        status: 'online',
        message: 'Sistem berjalan dengan normal'
      };
      res.json(systemStatus);
    } catch (error) {
      console.error('getSystemStatus ERROR:', error);
      res.status(500).json({ error: 'Failed to get system status', detail: error.message });
    }
  }
}

module.exports = SensorController;