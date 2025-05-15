/**
 * Model untuk Notification
 * Menggunakan pendekatan DDD
 */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Enum untuk tipe notifikasi
 */
const NotificationType = {
  FEED_LEVEL_LOW: 'feed_level_low',
  WATER_LEVEL_LOW: 'water_level_low',
  FEEDING_SUCCESS: 'feeding_success',
  FEEDING_FAILED: 'feeding_failed',
  SYSTEM_ERROR: 'system_error',
  SCHEDULE_REMINDER: 'schedule_reminder'
};

/**
 * Enum untuk status notifikasi
 */
const NotificationStatus = {
  UNREAD: 'unread',
  READ: 'read'
};

/**
 * Enum untuk prioritas notifikasi
 */
const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

class Notification extends Model {
  /**
   * Cek apakah notifikasi sudah dibaca
   */
  isRead() {
    return this.status === NotificationStatus.READ;
  }

  /**
   * Tandai notifikasi sebagai sudah dibaca
   */
  markAsRead() {
    this.status = NotificationStatus.READ;
    return this;
  }

  /**
   * Cek apakah notifikasi adalah notifikasi penting
   */
  isImportant() {
    return this.priority === NotificationPriority.HIGH || this.priority === NotificationPriority.CRITICAL;
  }
}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID dari auth-service'
  },
  type: {
    type: DataTypes.ENUM(Object.values(NotificationType)),
    allowNull: false,
    comment: 'Tipe notifikasi'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Judul notifikasi'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Isi notifikasi'
  },
  status: {
    type: DataTypes.ENUM(Object.values(NotificationStatus)),
    allowNull: false,
    defaultValue: NotificationStatus.UNREAD,
    comment: 'Status notifikasi (dibaca/belum)'
  },
  priority: {
    type: DataTypes.ENUM(Object.values(NotificationPriority)),
    allowNull: false,
    defaultValue: NotificationPriority.MEDIUM,
    comment: 'Prioritas notifikasi'
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Data tambahan untuk notifikasi (opsional)'
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Export model dan enum
module.exports = {
  Notification,
  NotificationType,
  NotificationStatus,
  NotificationPriority
};
