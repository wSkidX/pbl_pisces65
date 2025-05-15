/**
 * Domain Service untuk monitoring sensor
 * Bertanggung jawab untuk logika bisnis terkait monitoring sensor
 */
const sensorDataRepository = require('../repositories/sensorDataRepository');
const { FeedLevel, WaterLevel } = require('../models/sensorData');
const notificationClient = require('./notificationClient');

class SensorMonitoringService {
  constructor() {
    // Threshold untuk level kritis
    this.FEED_CRITICAL_THRESHOLD = 10; // 10% dianggap kritis
    this.WATER_CRITICAL_THRESHOLD = 15; // 15% dianggap kritis
    
    // Threshold untuk level rendah
    this.FEED_LOW_THRESHOLD = 20; // 20% dianggap rendah
    this.WATER_LOW_THRESHOLD = 30; // 30% dianggap rendah
    
    // Cache untuk data sensor terbaru
    this.latestSensorData = {
      feed_level_cm: '-',
      water_level_cm: '-',
      last_update: '-'
    };
    
    // Konfigurasi notifikasi
    this.notificationEnabled = process.env.NOTIFICATION_ENABLED !== 'false'; // Default true
    
    // Tracking untuk menghindari notifikasi berulang
    this.lastNotificationSent = {
      feed_level_low: 0,
      water_level_low: 0
    };
    
    // Minimal interval antar notifikasi (dalam milidetik)
    this.notificationInterval = 3600000; // 1 jam
  }

  /**
   * Mendapatkan status sensor terkini
   */
  async getCurrentStatus() {
    try {
      const latestData = await sensorDataRepository.getLatest();
      
      if (latestData) {
        // Update cache
        this.latestSensorData = {
          feed_level_cm: latestData.feed_level.toString(),
          water_level_cm: latestData.water_level.toString(),
          last_update: latestData.created_at.toISOString()
        };
        
        // Analisis status berdasarkan data terbaru
        const feedLevel = new FeedLevel(latestData.feed_level);
        const waterLevel = new WaterLevel(latestData.water_level);
        
        return {
          feed_level_cm: latestData.feed_level.toString(),
          water_level_cm: latestData.water_level.toString(),
          feed_status: this.getFeedStatus(feedLevel),
          water_status: this.getWaterStatus(waterLevel),
          temperature: latestData.temperature ? latestData.temperature.toString() : '-',
          device_id: latestData.device_id || '-',
          last_update: latestData.created_at.toISOString(),
          system_status: 'online'
        };
      }
      
      // Jika tidak ada data, kembalikan data default
      return {
        feed_level_cm: '-',
        water_level_cm: '-',
        feed_status: 'unknown',
        water_status: 'unknown',
        temperature: '-',
        device_id: '-',
        last_update: '-',
        system_status: 'online'
      };
    } catch (error) {
      console.error('Error getting current sensor status:', error);
      return {
        feed_level_cm: '-',
        water_level_cm: '-',
        feed_status: 'error',
        water_status: 'error',
        temperature: '-',
        device_id: '-',
        last_update: '-',
        system_status: 'error'
      };
    }
  }

  /**
   * Mendapatkan current stock untuk API
   */
  getCurrentStock() {
    return this.latestSensorData;
  }

  /**
   * Update data sensor terbaru
   */
  async updateSensorData(sensorData) {
    try {
      // Validasi data sensor
      if (sensorData.feed_level === undefined || sensorData.water_level === undefined) {
        throw new Error('Feed level and water level are required');
      }
      
      // Simpan data sensor baru
      const newData = await sensorDataRepository.create(sensorData);
      
      // Update cache
      this.latestSensorData = {
        feed_level_cm: newData.feed_level.toString(),
        water_level_cm: newData.water_level.toString(),
        last_update: newData.created_at.toISOString()
      };
      
      // Cek level pakan dan air, kirim notifikasi jika rendah
      if (this.notificationEnabled) {
        await this.checkLevelsAndNotify(newData);
      }
      
      return newData;
    } catch (error) {
      console.error('Error updating sensor data:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan status pakan berdasarkan level
   */
  getFeedStatus(feedLevel) {
    if (feedLevel.isCritical()) {
      return 'critical';
    } else if (feedLevel.isLow()) {
      return 'low';
    } else {
      return 'ok';
    }
  }

  /**
   * Mendapatkan status air berdasarkan level
   */
  getWaterStatus(waterLevel) {
    if (waterLevel.isCritical()) {
      return 'critical';
    } else if (waterLevel.isLow()) {
      return 'low';
    } else {
      return 'ok';
    }
  }

  /**
   * Cek apakah level pakan dan air cukup untuk feeding
   */
  isSufficientForFeeding(requiredFeedLevel, requiredWaterLevel) {
    try {
      const latestData = this.latestSensorData;
      
      const feedLevel = parseFloat(latestData.feed_level_cm);
      const waterLevel = parseFloat(latestData.water_level_cm);
      
      if (isNaN(feedLevel) || isNaN(waterLevel)) {
        return false;
      }
      
      return feedLevel >= requiredFeedLevel && waterLevel >= requiredWaterLevel;
    } catch (error) {
      console.error('Error checking if sufficient for feeding:', error);
      return false;
    }
  }
  
  /**
   * Cek level pakan dan air, kirim notifikasi jika rendah
   */
  async checkLevelsAndNotify(sensorData) {
    try {
      const now = Date.now();
      const userId = sensorData.user_id;
      
      // Jika tidak ada user_id, tidak bisa mengirim notifikasi
      if (!userId) {
        return;
      }
      
      // Cek level pakan
      const feedLevel = new FeedLevel(sensorData.feed_level);
      if (feedLevel.isLow() || feedLevel.isCritical()) {
        // Cek apakah sudah waktunya mengirim notifikasi lagi
        if (now - this.lastNotificationSent.feed_level_low > this.notificationInterval) {
          await notificationClient.sendFeedLevelLowNotification(userId, sensorData.feed_level);
          this.lastNotificationSent.feed_level_low = now;
        }
      }
      
      // Cek level air
      const waterLevel = new WaterLevel(sensorData.water_level);
      if (waterLevel.isLow() || waterLevel.isCritical()) {
        // Cek apakah sudah waktunya mengirim notifikasi lagi
        if (now - this.lastNotificationSent.water_level_low > this.notificationInterval) {
          await notificationClient.sendWaterLevelLowNotification(userId, sensorData.water_level);
          this.lastNotificationSent.water_level_low = now;
        }
      }
    } catch (error) {
      console.error('Error checking levels and sending notifications:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
    }
  }

  /**
   * Mendapatkan statistik sensor dalam rentang waktu
   */
  async getStats(days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      return await sensorDataRepository.getStats(startDate, endDate);
    } catch (error) {
      console.error('Error getting sensor stats:', error);
      throw error;
    }
  }
}

module.exports = new SensorMonitoringService();
