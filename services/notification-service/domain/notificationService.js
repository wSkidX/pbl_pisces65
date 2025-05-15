/**
 * Domain Service untuk Notification
 * Bertanggung jawab untuk logika bisnis terkait notifikasi
 */
const notificationRepository = require('../repositories/notificationRepository');
const { NotificationType, NotificationPriority } = require('../models/notification');
const axios = require('axios');

class NotificationService {
  constructor() {
    this.emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://email-service:3000';
    this.pushNotificationEnabled = process.env.PUSH_NOTIFICATION_ENABLED === 'true';
  }

  /**
   * Membuat notifikasi baru
   */
  async createNotification(notificationData) {
    try {
      // Validasi data notifikasi
      if (!notificationData.user_id || !notificationData.type || !notificationData.message) {
        throw new Error('user_id, type, dan message harus diisi');
      }
      
      // Set judul default jika tidak ada
      if (!notificationData.title) {
        notificationData.title = this.getDefaultTitle(notificationData.type);
      }
      
      // Buat notifikasi
      const notification = await notificationRepository.create(notificationData);
      
      // Kirim notifikasi ke channel yang sesuai (email, push notification, dll)
      await this.sendNotificationToChannels(notification);
      
      return notification;
    } catch (error) {
      console.error('Create Notification Error:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan judul default berdasarkan tipe notifikasi
   */
  getDefaultTitle(type) {
    switch (type) {
      case NotificationType.FEED_LEVEL_LOW:
        return 'Peringatan: Level Pakan Rendah';
      case NotificationType.WATER_LEVEL_LOW:
        return 'Peringatan: Level Air Rendah';
      case NotificationType.FEEDING_SUCCESS:
        return 'Feeding Berhasil';
      case NotificationType.FEEDING_FAILED:
        return 'Feeding Gagal';
      case NotificationType.SYSTEM_ERROR:
        return 'Error Sistem';
      case NotificationType.SCHEDULE_REMINDER:
        return 'Pengingat Jadwal Feeding';
      default:
        return 'Notifikasi Baru';
    }
  }

  /**
   * Mendapatkan prioritas default berdasarkan tipe notifikasi
   */
  getDefaultPriority(type) {
    switch (type) {
      case NotificationType.FEED_LEVEL_LOW:
        return NotificationPriority.HIGH;
      case NotificationType.WATER_LEVEL_LOW:
        return NotificationPriority.HIGH;
      case NotificationType.FEEDING_SUCCESS:
        return NotificationPriority.LOW;
      case NotificationType.FEEDING_FAILED:
        return NotificationPriority.HIGH;
      case NotificationType.SYSTEM_ERROR:
        return NotificationPriority.CRITICAL;
      case NotificationType.SCHEDULE_REMINDER:
        return NotificationPriority.MEDIUM;
      default:
        return NotificationPriority.MEDIUM;
    }
  }

  /**
   * Kirim notifikasi ke berbagai channel (email, push notification, dll)
   */
  async sendNotificationToChannels(notification) {
    try {
      // Kirim email jika notifikasi penting
      if (notification.isImportant()) {
        await this.sendEmail(notification);
      }
      
      // Kirim push notification jika diaktifkan
      if (this.pushNotificationEnabled) {
        await this.sendPushNotification(notification);
      }
    } catch (error) {
      console.error('Send Notification To Channels Error:', error);
      // Tetap lanjutkan meskipun gagal mengirim ke channel
    }
  }

  /**
   * Kirim email notifikasi
   */
  async sendEmail(notification) {
    try {
      // Implementasi pengiriman email
      // Ini bisa menggunakan service email terpisah
      await axios.post(`${this.emailServiceUrl}/send`, {
        to: notification.user_id, // Idealnya ambil email user dari auth-service
        subject: notification.title,
        body: notification.message,
        priority: notification.priority
      });
      
      console.log(`Email sent for notification ${notification.id}`);
    } catch (error) {
      console.error('Send Email Error:', error);
      // Tetap lanjutkan meskipun gagal mengirim email
    }
  }

  /**
   * Kirim push notification
   */
  async sendPushNotification(notification) {
    try {
      // Implementasi pengiriman push notification
      // Ini bisa menggunakan service push notification terpisah
      console.log(`Push notification sent for notification ${notification.id}`);
    } catch (error) {
      console.error('Send Push Notification Error:', error);
      // Tetap lanjutkan meskipun gagal mengirim push notification
    }
  }

  /**
   * Mendapatkan semua notifikasi user
   */
  async getUserNotifications(userId, options = {}) {
    try {
      return await notificationRepository.findByUserId(userId, options);
    } catch (error) {
      console.error('Get User Notifications Error:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan notifikasi yang belum dibaca
   */
  async getUnreadNotifications(userId) {
    try {
      return await notificationRepository.findUnreadByUserId(userId);
    } catch (error) {
      console.error('Get Unread Notifications Error:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan jumlah notifikasi yang belum dibaca
   */
  async getUnreadCount(userId) {
    try {
      return await notificationRepository.countUnreadByUserId(userId);
    } catch (error) {
      console.error('Get Unread Count Error:', error);
      throw error;
    }
  }

  /**
   * Tandai notifikasi sebagai sudah dibaca
   */
  async markAsRead(id) {
    try {
      return await notificationRepository.markAsRead(id);
    } catch (error) {
      console.error('Mark As Read Error:', error);
      throw error;
    }
  }

  /**
   * Tandai semua notifikasi user sebagai sudah dibaca
   */
  async markAllAsRead(userId) {
    try {
      return await notificationRepository.markAllAsRead(userId);
    } catch (error) {
      console.error('Mark All As Read Error:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi feed level rendah
   */
  async createFeedLevelLowNotification(userId, feedLevel) {
    try {
      return await this.createNotification({
        user_id: userId,
        type: NotificationType.FEED_LEVEL_LOW,
        title: 'Peringatan: Level Pakan Rendah',
        message: `Level pakan Anda saat ini ${feedLevel}%. Segera isi ulang pakan untuk mencegah kegagalan feeding.`,
        priority: NotificationPriority.HIGH,
        data: { feed_level: feedLevel }
      });
    } catch (error) {
      console.error('Create Feed Level Low Notification Error:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi water level rendah
   */
  async createWaterLevelLowNotification(userId, waterLevel) {
    try {
      return await this.createNotification({
        user_id: userId,
        type: NotificationType.WATER_LEVEL_LOW,
        title: 'Peringatan: Level Air Rendah',
        message: `Level air Anda saat ini ${waterLevel}%. Segera isi ulang air untuk mencegah kegagalan feeding.`,
        priority: NotificationPriority.HIGH,
        data: { water_level: waterLevel }
      });
    } catch (error) {
      console.error('Create Water Level Low Notification Error:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi feeding berhasil
   */
  async createFeedingSuccessNotification(userId, scheduleId, feedingData) {
    try {
      return await this.createNotification({
        user_id: userId,
        type: NotificationType.FEEDING_SUCCESS,
        title: 'Feeding Berhasil',
        message: `Feeding berhasil dilakukan pada ${new Date().toLocaleString()}.`,
        priority: NotificationPriority.LOW,
        data: { schedule_id: scheduleId, ...feedingData }
      });
    } catch (error) {
      console.error('Create Feeding Success Notification Error:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi feeding gagal
   */
  async createFeedingFailedNotification(userId, scheduleId, reason) {
    try {
      return await this.createNotification({
        user_id: userId,
        type: NotificationType.FEEDING_FAILED,
        title: 'Feeding Gagal',
        message: `Feeding gagal dilakukan pada ${new Date().toLocaleString()}. Alasan: ${reason}`,
        priority: NotificationPriority.HIGH,
        data: { schedule_id: scheduleId, reason }
      });
    } catch (error) {
      console.error('Create Feeding Failed Notification Error:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi error sistem
   */
  async createSystemErrorNotification(userId, errorMessage) {
    try {
      return await this.createNotification({
        user_id: userId,
        type: NotificationType.SYSTEM_ERROR,
        title: 'Error Sistem',
        message: `Terjadi error pada sistem: ${errorMessage}`,
        priority: NotificationPriority.CRITICAL,
        data: { error_message: errorMessage }
      });
    } catch (error) {
      console.error('Create System Error Notification Error:', error);
      throw error;
    }
  }

  /**
   * Membuat notifikasi pengingat jadwal
   */
  async createScheduleReminderNotification(userId, scheduleId, scheduleTime) {
    try {
      return await this.createNotification({
        user_id: userId,
        type: NotificationType.SCHEDULE_REMINDER,
        title: 'Pengingat Jadwal Feeding',
        message: `Jadwal feeding akan dilakukan pada ${scheduleTime}.`,
        priority: NotificationPriority.MEDIUM,
        data: { schedule_id: scheduleId, schedule_time: scheduleTime }
      });
    } catch (error) {
      console.error('Create Schedule Reminder Notification Error:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
