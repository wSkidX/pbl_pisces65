/**
 * Controller untuk Notification
 * Menggunakan repository pattern dan domain service
 */
const notificationService = require('../domain/notificationService');
const { NotificationType, NotificationPriority } = require('../models/notification');

class NotificationController {
  /**
   * Membuat notifikasi baru
   */
  static async createNotification(req, res) {
    try {
      // Validasi input
      if (!req.body.user_id || !req.body.type || !req.body.message) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'user_id, type, dan message harus diisi'
        });
      }
      
      // Buat notifikasi via domain service
      const notification = await notificationService.createNotification(req.body);
      
      res.status(201).json({ 
        message: 'Notifikasi berhasil dibuat', 
        notification 
      });
    } catch (error) {
      console.error('Create Notification Error:', error);
      res.status(500).json({ 
        error: 'Failed to create notification', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan semua notifikasi user
   */
  static async getUserNotifications(req, res) {
    try {
      // Ambil user_id dari token JWT atau dari parameter
      const userId = req.userId || req.params.userId || req.query.userId;
      
      if (!userId) {
        return res.status(400).json({ 
          error: 'User ID tidak ditemukan',
          detail: 'Harap sertakan user_id di parameter atau gunakan token autentikasi'
        });
      }
      
      // Opsi filter
      const options = {};
      
      // Filter berdasarkan tipe notifikasi jika ada
      if (req.query.type) {
        options.where = { type: req.query.type };
      }
      
      // Limit dan offset untuk pagination
      if (req.query.limit) {
        options.limit = parseInt(req.query.limit);
      }
      
      if (req.query.offset) {
        options.offset = parseInt(req.query.offset);
      }
      
      // Ambil notifikasi via domain service
      const notifications = await notificationService.getUserNotifications(userId, options);
      
      res.json(notifications);
    } catch (error) {
      console.error('Get User Notifications Error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve notifications', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan notifikasi yang belum dibaca
   */
  static async getUnreadNotifications(req, res) {
    try {
      // Ambil user_id dari token JWT atau dari parameter
      const userId = req.userId || req.params.userId || req.query.userId;
      
      if (!userId) {
        return res.status(400).json({ 
          error: 'User ID tidak ditemukan',
          detail: 'Harap sertakan user_id di parameter atau gunakan token autentikasi'
        });
      }
      
      // Ambil notifikasi yang belum dibaca via domain service
      const notifications = await notificationService.getUnreadNotifications(userId);
      
      res.json(notifications);
    } catch (error) {
      console.error('Get Unread Notifications Error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve unread notifications', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan jumlah notifikasi yang belum dibaca
   */
  static async getUnreadCount(req, res) {
    try {
      // Ambil user_id dari token JWT atau dari parameter
      const userId = req.userId || req.params.userId || req.query.userId;
      
      if (!userId) {
        return res.status(400).json({ 
          error: 'User ID tidak ditemukan',
          detail: 'Harap sertakan user_id di parameter atau gunakan token autentikasi'
        });
      }
      
      // Ambil jumlah notifikasi yang belum dibaca via domain service
      const count = await notificationService.getUnreadCount(userId);
      
      res.json({ count });
    } catch (error) {
      console.error('Get Unread Count Error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve unread count', 
        detail: error.message 
      });
    }
  }

  /**
   * Tandai notifikasi sebagai sudah dibaca
   */
  static async markAsRead(req, res) {
    try {
      // Validasi input
      if (!req.params.id) {
        return res.status(400).json({ 
          error: 'ID notifikasi tidak ditemukan',
          detail: 'Harap sertakan ID notifikasi di URL'
        });
      }
      
      // Tandai notifikasi sebagai sudah dibaca via domain service
      const notification = await notificationService.markAsRead(req.params.id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notifikasi tidak ditemukan' });
      }
      
      res.json({ 
        message: 'Notifikasi berhasil ditandai sebagai sudah dibaca', 
        notification 
      });
    } catch (error) {
      console.error('Mark As Read Error:', error);
      res.status(500).json({ 
        error: 'Failed to mark notification as read', 
        detail: error.message 
      });
    }
  }

  /**
   * Tandai semua notifikasi user sebagai sudah dibaca
   */
  static async markAllAsRead(req, res) {
    try {
      // Ambil user_id dari token JWT atau dari parameter
      const userId = req.userId || req.body.userId || req.query.userId;
      
      if (!userId) {
        return res.status(400).json({ 
          error: 'User ID tidak ditemukan',
          detail: 'Harap sertakan user_id di parameter atau gunakan token autentikasi'
        });
      }
      
      // Tandai semua notifikasi user sebagai sudah dibaca via domain service
      await notificationService.markAllAsRead(userId);
      
      res.json({ message: 'Semua notifikasi berhasil ditandai sebagai sudah dibaca' });
    } catch (error) {
      console.error('Mark All As Read Error:', error);
      res.status(500).json({ 
        error: 'Failed to mark all notifications as read', 
        detail: error.message 
      });
    }
  }

  /**
   * Membuat notifikasi feed level rendah
   */
  static async createFeedLevelLowNotification(req, res) {
    try {
      // Validasi input
      if (!req.body.user_id || !req.body.feed_level) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'user_id dan feed_level harus diisi'
        });
      }
      
      // Buat notifikasi feed level rendah via domain service
      const notification = await notificationService.createFeedLevelLowNotification(
        req.body.user_id,
        req.body.feed_level
      );
      
      res.status(201).json({ 
        message: 'Notifikasi feed level rendah berhasil dibuat', 
        notification 
      });
    } catch (error) {
      console.error('Create Feed Level Low Notification Error:', error);
      res.status(500).json({ 
        error: 'Failed to create feed level low notification', 
        detail: error.message 
      });
    }
  }

  /**
   * Membuat notifikasi water level rendah
   */
  static async createWaterLevelLowNotification(req, res) {
    try {
      // Validasi input
      if (!req.body.user_id || !req.body.water_level) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'user_id dan water_level harus diisi'
        });
      }
      
      // Buat notifikasi water level rendah via domain service
      const notification = await notificationService.createWaterLevelLowNotification(
        req.body.user_id,
        req.body.water_level
      );
      
      res.status(201).json({ 
        message: 'Notifikasi water level rendah berhasil dibuat', 
        notification 
      });
    } catch (error) {
      console.error('Create Water Level Low Notification Error:', error);
      res.status(500).json({ 
        error: 'Failed to create water level low notification', 
        detail: error.message 
      });
    }
  }

  /**
   * Membuat notifikasi feeding berhasil
   */
  static async createFeedingSuccessNotification(req, res) {
    try {
      // Validasi input
      if (!req.body.user_id || !req.body.schedule_id) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'user_id dan schedule_id harus diisi'
        });
      }
      
      // Buat notifikasi feeding berhasil via domain service
      const notification = await notificationService.createFeedingSuccessNotification(
        req.body.user_id,
        req.body.schedule_id,
        req.body.feeding_data || {}
      );
      
      res.status(201).json({ 
        message: 'Notifikasi feeding berhasil dibuat', 
        notification 
      });
    } catch (error) {
      console.error('Create Feeding Success Notification Error:', error);
      res.status(500).json({ 
        error: 'Failed to create feeding success notification', 
        detail: error.message 
      });
    }
  }

  /**
   * Membuat notifikasi feeding gagal
   */
  static async createFeedingFailedNotification(req, res) {
    try {
      // Validasi input
      if (!req.body.user_id || !req.body.schedule_id || !req.body.reason) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'user_id, schedule_id, dan reason harus diisi'
        });
      }
      
      // Buat notifikasi feeding gagal via domain service
      const notification = await notificationService.createFeedingFailedNotification(
        req.body.user_id,
        req.body.schedule_id,
        req.body.reason
      );
      
      res.status(201).json({ 
        message: 'Notifikasi feeding gagal berhasil dibuat', 
        notification 
      });
    } catch (error) {
      console.error('Create Feeding Failed Notification Error:', error);
      res.status(500).json({ 
        error: 'Failed to create feeding failed notification', 
        detail: error.message 
      });
    }
  }
}

module.exports = NotificationController;
