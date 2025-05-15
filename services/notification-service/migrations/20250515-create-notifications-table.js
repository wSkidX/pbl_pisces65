/**
 * Migration untuk membuat tabel notifications
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'ID dari auth-service'
      },
      type: {
        type: Sequelize.ENUM(
          'feed_level_low',
          'water_level_low',
          'feeding_success',
          'feeding_failed',
          'system_error',
          'schedule_reminder'
        ),
        allowNull: false,
        comment: 'Tipe notifikasi'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Judul notifikasi'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Isi notifikasi'
      },
      status: {
        type: Sequelize.ENUM('unread', 'read'),
        allowNull: false,
        defaultValue: 'unread',
        comment: 'Status notifikasi (dibaca/belum)'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Prioritas notifikasi'
      },
      data: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Data tambahan untuk notifikasi (opsional)'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Tambahkan indeks untuk mempercepat query
    await queryInterface.addIndex('notifications', ['user_id']);
    await queryInterface.addIndex('notifications', ['type']);
    await queryInterface.addIndex('notifications', ['status']);
    await queryInterface.addIndex('notifications', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus indeks terlebih dahulu
    await queryInterface.removeIndex('notifications', ['user_id']);
    await queryInterface.removeIndex('notifications', ['type']);
    await queryInterface.removeIndex('notifications', ['status']);
    await queryInterface.removeIndex('notifications', ['created_at']);

    // Hapus tabel
    await queryInterface.dropTable('notifications');

    // Hapus enum types
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_notifications_type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_notifications_status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_notifications_priority');
  }
};
