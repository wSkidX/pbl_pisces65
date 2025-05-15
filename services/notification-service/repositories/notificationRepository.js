/**
 * Repository untuk Notification
 * Bertanggung jawab untuk akses data Notification
 */
const { Op } = require('sequelize');
const { Notification } = require('../models/notification');

class NotificationRepository {
  /**
   * Membuat notifikasi baru
   */
  async create(notificationData) {
    return await Notification.create(notificationData);
  }

  /**
   * Membuat banyak notifikasi sekaligus
   */
  async bulkCreate(notificationsData) {
    return await Notification.bulkCreate(notificationsData);
  }

  /**
   * Mendapatkan semua notifikasi
   */
  async findAll(options = {}) {
    return await Notification.findAll(options);
  }

  /**
   * Mendapatkan notifikasi berdasarkan ID
   */
  async findById(id) {
    return await Notification.findByPk(id);
  }

  /**
   * Mendapatkan notifikasi berdasarkan user ID
   */
  async findByUserId(userId, options = {}) {
    return await Notification.findAll({
      where: {
        user_id: userId,
        ...options.where
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  }

  /**
   * Mendapatkan notifikasi yang belum dibaca berdasarkan user ID
   */
  async findUnreadByUserId(userId, options = {}) {
    return await Notification.findAll({
      where: {
        user_id: userId,
        status: 'unread',
        ...options.where
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  }

  /**
   * Mendapatkan jumlah notifikasi yang belum dibaca berdasarkan user ID
   */
  async countUnreadByUserId(userId) {
    return await Notification.count({
      where: {
        user_id: userId,
        status: 'unread'
      }
    });
  }

  /**
   * Tandai notifikasi sebagai sudah dibaca
   */
  async markAsRead(id) {
    const notification = await this.findById(id);
    if (!notification) return null;
    
    notification.status = 'read';
    await notification.save();
    
    return notification;
  }

  /**
   * Tandai semua notifikasi user sebagai sudah dibaca
   */
  async markAllAsRead(userId) {
    return await Notification.update(
      { status: 'read' },
      {
        where: {
          user_id: userId,
          status: 'unread'
        }
      }
    );
  }

  /**
   * Update notifikasi
   */
  async update(id, notificationData) {
    const notification = await this.findById(id);
    if (!notification) return null;
    
    return await notification.update(notificationData);
  }

  /**
   * Menghapus notifikasi
   */
  async delete(id) {
    const notification = await this.findById(id);
    if (!notification) return false;
    
    await notification.destroy();
    return true;
  }

  /**
   * Menghapus semua notifikasi user
   */
  async deleteAllByUserId(userId) {
    return await Notification.destroy({
      where: {
        user_id: userId
      }
    });
  }

  /**
   * Mendapatkan notifikasi berdasarkan tipe
   */
  async findByType(type, options = {}) {
    return await Notification.findAll({
      where: {
        type,
        ...options.where
      },
      order: [['created_at', 'DESC']],
      ...options
    });
  }
}

module.exports = new NotificationRepository();
