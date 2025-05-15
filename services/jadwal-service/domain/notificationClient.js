/**
 * Client untuk berkomunikasi dengan notification-service
 * Digunakan untuk mengirim notifikasi dari jadwal-service
 */
const axios = require('axios');

class NotificationClient {
  constructor() {
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3003';
    this.apiUrl = `${this.notificationServiceUrl}/api`;
  }

  /**
   * Mengirim notifikasi feed level rendah
   */
  async sendFeedLevelLowNotification(userId, feedLevel) {
    try {
      const response = await axios.post(`${this.apiUrl}/events/feed-level-low`, {
        user_id: userId,
        feed_level: feedLevel
      });
      
      return response.data;
    } catch (error) {
      console.error('Send Feed Level Low Notification Error:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
      return null;
    }
  }

  /**
   * Mengirim notifikasi water level rendah
   */
  async sendWaterLevelLowNotification(userId, waterLevel) {
    try {
      const response = await axios.post(`${this.apiUrl}/events/water-level-low`, {
        user_id: userId,
        water_level: waterLevel
      });
      
      return response.data;
    } catch (error) {
      console.error('Send Water Level Low Notification Error:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
      return null;
    }
  }

  /**
   * Mengirim notifikasi feeding berhasil
   */
  async sendFeedingSuccessNotification(userId, scheduleId, feedingData) {
    try {
      const response = await axios.post(`${this.apiUrl}/events/feeding-success`, {
        user_id: userId,
        schedule_id: scheduleId,
        feeding_data: feedingData
      });
      
      return response.data;
    } catch (error) {
      console.error('Send Feeding Success Notification Error:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
      return null;
    }
  }

  /**
   * Mengirim notifikasi feeding gagal
   */
  async sendFeedingFailedNotification(userId, scheduleId, reason) {
    try {
      const response = await axios.post(`${this.apiUrl}/events/feeding-failed`, {
        user_id: userId,
        schedule_id: scheduleId,
        reason
      });
      
      return response.data;
    } catch (error) {
      console.error('Send Feeding Failed Notification Error:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
      return null;
    }
  }

  /**
   * Mengirim notifikasi error sistem
   */
  async sendSystemErrorNotification(userId, errorMessage) {
    try {
      const response = await axios.post(`${this.apiUrl}/notifications`, {
        user_id: userId,
        type: 'system_error',
        title: 'Error Sistem',
        message: `Terjadi error pada sistem: ${errorMessage}`,
        priority: 'critical',
        data: { error_message: errorMessage }
      });
      
      return response.data;
    } catch (error) {
      console.error('Send System Error Notification Error:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
      return null;
    }
  }

  /**
   * Mengirim notifikasi pengingat jadwal
   */
  async sendScheduleReminderNotification(userId, scheduleId, scheduleTime) {
    try {
      const response = await axios.post(`${this.apiUrl}/notifications`, {
        user_id: userId,
        type: 'schedule_reminder',
        title: 'Pengingat Jadwal Feeding',
        message: `Jadwal feeding akan dilakukan pada ${scheduleTime}.`,
        priority: 'medium',
        data: { schedule_id: scheduleId, schedule_time: scheduleTime }
      });
      
      return response.data;
    } catch (error) {
      console.error('Send Schedule Reminder Notification Error:', error);
      // Jangan throw error, agar tidak mengganggu proses utama
      return null;
    }
  }
}

module.exports = new NotificationClient();
