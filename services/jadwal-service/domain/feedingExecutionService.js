/**
 * Domain Service untuk eksekusi feeding
 * Bertanggung jawab untuk mengelola proses pemberian pakan
 */
const axios = require('axios');
const { Op } = require('sequelize');
const FeedingSchedule = require('../models/jadwal');
const notificationClient = require('./notificationClient');

class FeedingExecutionService {
  constructor() {
    this.sensorApiUrl = process.env.SENSOR_API_URL || 'http://sensor-service:3003';
    this.esp32ApiUrl = process.env.ESP32_API_URL || 'http://esp32-service:3004';
    this.notificationEnabled = process.env.NOTIFICATION_ENABLED !== 'false'; // Default true
  }

  /**
   * Mengecek dan mengeksekusi jadwal yang siap dijalankan
   */
  async executeScheduledFeedings() {
    try {
      const pendingSchedules = await this.getPendingSchedulesForNow();
      
      for (const schedule of pendingSchedules) {
        try {
          // 1. Cek sensor levels
          const sensorData = await this.getCurrentSensorLevels();
          
          // 2. Validasi kondisi
          if (this.validateFeedingConditions(schedule, sensorData)) {
            // 3. Kirim perintah ke ESP32
            await this.sendCommandToESP32(schedule);
            
            // 4. Update status jadwal
            await schedule.markAsExecuted();
            
            // 5. Kirim notifikasi feeding berhasil
            if (this.notificationEnabled) {
              await this.sendFeedingSuccessNotification(schedule);
            }
            
            console.log(`Jadwal feeding ${schedule.id} berhasil dieksekusi`);
          } else {
            // Log gagal karena kondisi tidak memenuhi
            await schedule.markAsFailed('Insufficient levels');
            
            // Kirim notifikasi feeding gagal
            if (this.notificationEnabled) {
              await this.sendFeedingFailedNotification(schedule, 'Level pakan/air tidak mencukupi');
            }
            
            console.log(`Jadwal feeding ${schedule.id} gagal: level pakan/air tidak mencukupi`);
          }
        } catch (error) {
          console.error(`Failed to execute feeding schedule ${schedule.id}:`, error);
          await schedule.markAsFailed(error.message);
          
          // Kirim notifikasi feeding gagal
          if (this.notificationEnabled) {
            await this.sendFeedingFailedNotification(schedule, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error executing scheduled feedings:', error);
    }
  }

  /**
   * Mendapatkan jadwal yang pending dan waktunya sudah tiba
   */
  async getPendingSchedulesForNow() {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS
    
    return await FeedingSchedule.findAll({
      where: {
        status: 'pending',
        [Op.or]: [
          {
            // Jadwal untuk hari ini yang waktunya sudah lewat
            tanggal: today,
            jam: {
              [Op.lte]: currentTime
            }
          },
          {
            // Jadwal untuk hari-hari sebelumnya yang belum dieksekusi
            tanggal: {
              [Op.lt]: today
            }
          }
        ]
      }
    });
  }

  /**
   * Mendapatkan data sensor terkini
   */
  async getCurrentSensorLevels() {
    try {
      const response = await axios.get(`${this.sensorApiUrl}/current_stock`);
      return {
        feed_level: parseFloat(response.data.feed_level_cm) || 0,
        water_level: parseFloat(response.data.water_level_cm) || 0
      };
    } catch (error) {
      console.error('Error getting current sensor levels:', error);
      throw new Error('Failed to get current sensor levels');
    }
  }

  /**
   * Validasi kondisi untuk eksekusi feeding
   */
  validateFeedingConditions(schedule, sensorData) {
    // Cek apakah level pakan dan air cukup untuk eksekusi jadwal
    return sensorData.feed_level >= schedule.volume_pakan && 
           sensorData.water_level >= schedule.volume_air;
  }

  /**
   * Kirim perintah ke ESP32
   */
  async sendCommandToESP32(schedule) {
    try {
      // Implementasi komunikasi dengan ESP32
      // Bisa menggunakan MQTT, HTTP, atau protokol lainnya
      await axios.post(`${this.esp32ApiUrl}/execute_feeding`, {
        volume_pakan: schedule.volume_pakan,
        volume_air: schedule.volume_air,
        durasi_bibis: schedule.durasi_bibis,
        schedule_id: schedule.id
      });
      
      return true;
    } catch (error) {
      console.error('Error sending command to ESP32:', error);
      throw new Error('Failed to send command to ESP32');
    }
  }
  
  /**
   * Kirim notifikasi feeding berhasil
   */
  async sendFeedingSuccessNotification(schedule) {
    try {
      if (!schedule.user_id) {
        console.warn('Cannot send notification: No user_id in schedule');
        return;
      }
      
      const feedingData = {
        volume_pakan: schedule.volume_pakan,
        volume_air: schedule.volume_air,
        durasi_bibis: schedule.durasi_bibis,
        executed_at: schedule.last_executed_at
      };
      
      await notificationClient.sendFeedingSuccessNotification(
        schedule.user_id,
        schedule.id,
        feedingData
      );
    } catch (error) {
      console.error('Error sending feeding success notification:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
    }
  }
  
  /**
   * Kirim notifikasi feeding gagal
   */
  async sendFeedingFailedNotification(schedule, reason) {
    try {
      if (!schedule.user_id) {
        console.warn('Cannot send notification: No user_id in schedule');
        return;
      }
      
      await notificationClient.sendFeedingFailedNotification(
        schedule.user_id,
        schedule.id,
        reason
      );
    } catch (error) {
      console.error('Error sending feeding failed notification:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
    }
  }
}

module.exports = new FeedingExecutionService();
