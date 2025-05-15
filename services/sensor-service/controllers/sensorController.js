/**
 * Controller untuk SensorData
 * Menggunakan repository pattern dan domain service
 */
const sensorDataRepository = require('../repositories/sensorDataRepository');
const sensorMonitoringService = require('../domain/sensorMonitoringService');

class SensorController {
  // Rate limit: minimal 1 detik antar data per tipe sensor
  static lastReceived = {};
  
  /**
   * Membuat atau update data sensor
   */
  static async createSensorData(req, res) {
    try {
      // Mapping dari format lama ke format baru
      const sensorData = {
        feed_level: req.body.jumlahPakanKering !== undefined ? req.body.jumlahPakanKering : req.body.feed_level,
        water_level: req.body.jumlahAir !== undefined ? req.body.jumlahAir : req.body.water_level,
        temperature: req.body.temperature,
        device_id: req.body.device_id,
        mode: req.body.mode || 'manual',
        waktu_pakan: req.body.waktu_pakan || new Date().toISOString(),
        user_id: req.body.user_id
      };
      
      // Validasi data sensor
      if (sensorData.feed_level === undefined || sensorData.water_level === undefined) {
        return res.status(400).json({ 
          error: 'Feed level and water level are required',
          detail: 'Please provide feed_level and water_level values'
        });
      }
      
      // Update data sensor via domain service
      const newData = await sensorMonitoringService.updateSensorData(sensorData);
      
      res.status(201).json({ 
        message: 'Sensor data updated successfully', 
        data: newData
      });
    } catch (error) {
      console.error('Create Sensor Data Error:', error);
      res.status(500).json({ 
        error: 'Failed to create sensor data', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan semua data sensor
   */
  static async getSensorData(req, res) {
    try {
      // Bisa tambahkan filter berdasarkan query params
      const options = {};
      
      // Filter berdasarkan device_id jika ada
      if (req.query.device_id) {
        options.where = { device_id: req.query.device_id };
      }
      
      // Filter berdasarkan rentang tanggal jika ada
      if (req.query.start_date && req.query.end_date) {
        options.where = options.where || {};
        options.where.created_at = {
          [Op.between]: [new Date(req.query.start_date), new Date(req.query.end_date)]
        };
      }
      
      const data = await sensorDataRepository.findAll(options);
      res.json(data);
    } catch (error) {
      console.error('Get Sensor Data Error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve sensor data',
        detail: error.message
      });
    }
  }

  /**
   * Mendapatkan data sensor berdasarkan ID
   */
  static async getSensorDataById(req, res) {
    try {
      const data = await sensorDataRepository.findById(req.params.id);
      
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'Sensor data tidak ditemukan' });
      }
    } catch (error) {
      console.error('Get Sensor Data By Id Error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve sensor data',
        detail: error.message
      });
    }
  }

  /**
   * Update data sensor berdasarkan ID
   */
  static async updateSensorData(req, res) {
    try {
      // Hanya update field yang diizinkan
      const allowedFields = ['feed_level', 'water_level', 'temperature', 'device_id', 'mode', 'waktu_pakan'];
      const updateData = {};
      
      // Mapping dari format lama ke format baru
      if (req.body.jumlahPakanKering !== undefined) updateData.feed_level = req.body.jumlahPakanKering;
      if (req.body.jumlahAir !== undefined) updateData.water_level = req.body.jumlahAir;
      
      // Field lainnya
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
      
      const updatedData = await sensorDataRepository.update(req.params.id, updateData);
      
      if (!updatedData) {
        return res.status(404).json({ error: 'Sensor data tidak ditemukan' });
      }
      
      res.json(updatedData);
    } catch (error) {
      console.error('Update Sensor Data Error:', error);
      res.status(500).json({ 
        error: 'Failed to update sensor data', 
        detail: error.message 
      });
    }
  }

  /**
   * Menghapus data sensor berdasarkan ID
   */
  static async deleteSensorData(req, res) {
    try {
      const deleted = await sensorDataRepository.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Sensor data tidak ditemukan' });
      }
      
      res.json({ message: 'Sensor data berhasil dihapus' });
    } catch (error) {
      console.error('Delete Sensor Data Error:', error);
      res.status(500).json({ 
        error: 'Failed to delete sensor data',
        detail: error.message
      });
    }
  }
  /**
   * Mendapatkan stok pakan dan air terkini
   */
  static async getCurrentStock(req, res) {
    try {
      const currentStock = sensorMonitoringService.getCurrentStock();
      res.json(currentStock);
    } catch (error) {
      console.error('Get Current Stock Error:', error);
      res.status(500).json({ 
        error: 'Failed to get current stock',
        detail: error.message
      });
    }
  }

  /**
   * Mendapatkan status semua sensor
   */
  static async getAllSensorStatus(req, res) {
    try {
      const status = await sensorMonitoringService.getCurrentStatus();
      res.json(status);
    } catch (error) {
      console.error('Get All Sensor Status Error:', error);
      res.status(500).json({ 
        error: 'Failed to get sensor status', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan log feeding
   * Catatan: Ini masih menggunakan data dummy, idealnya diambil dari database
   */
  static async getFeedingLogs(req, res) {
    try {
      // TODO: Implementasi sebenarnya harus mengambil dari database
      // Untuk sementara masih menggunakan data dummy
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
      console.error('Get Feeding Logs Error:', error);
      res.status(500).json({ 
        error: 'Failed to get feeding logs', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan status sistem
   */
  static async getSystemStatus(req, res) {
    try {
      // Cek status sensor terkini untuk menentukan status sistem
      const sensorStatus = await sensorMonitoringService.getCurrentStatus();
      
      const systemStatus = {
        status: sensorStatus.system_status,
        message: sensorStatus.system_status === 'online' ? 'Sistem berjalan dengan normal' : 'Sistem mengalami gangguan',
        last_update: sensorStatus.last_update,
        components: {
          feed_sensor: sensorStatus.feed_status,
          water_sensor: sensorStatus.water_status
        }
      };
      
      res.json(systemStatus);
    } catch (error) {
      console.error('Get System Status Error:', error);
      res.status(500).json({ 
        error: 'Failed to get system status', 
        detail: error.message 
      });
    }
  }
  
  /**
   * Mendapatkan statistik sensor
   */
  static async getSensorStats(req, res) {
    try {
      const days = parseInt(req.query.days) || 7; // Default 7 hari
      const stats = await sensorMonitoringService.getStats(days);
      
      res.json(stats);
    } catch (error) {
      console.error('Get Sensor Stats Error:', error);
      res.status(500).json({ 
        error: 'Failed to get sensor statistics', 
        detail: error.message 
      });
    }
  }
}

module.exports = SensorController;