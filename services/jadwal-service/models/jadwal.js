const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeedingSchedule = sequelize.define('FeedingSchedule', {
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
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  jam: {
    type: DataTypes.TIME,
    allowNull: false
  },
  volume_pakan: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Persentase dari hasil pengukuran ultrasonik'
  },
  volume_air: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Persentase dari hasil pengukuran ultrasonik'
  },
  durasi_bibis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: 'Durasi dalam detik'
  },
  repeat_daily: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True jika berulang harian'
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'success', 'failed']]
    }
  },
  last_executed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Waktu terakhir jadwal dieksekusi'
  }
}, {
  timestamps: true, // Ini akan membuat created_at dan updated_at
  underscored: true, // Menggunakan snake_case untuk nama kolom
  tableName: 'feeding_schedules' // Nama tabel di database
});

// Domain methods
FeedingSchedule.prototype.isReadyToExecute = function() {
  const now = new Date();
  const scheduleDate = new Date(this.tanggal);
  scheduleDate.setHours(this.jam.split(':')[0], this.jam.split(':')[1]);
  
  return this.status === 'pending' && scheduleDate <= now;
};

FeedingSchedule.prototype.markAsExecuted = async function() {
  this.status = 'success';
  this.last_executed_at = new Date();
  return await this.save();
};

FeedingSchedule.prototype.markAsFailed = async function(reason) {
  this.status = 'failed';
  // Bisa tambahkan field reason jika diperlukan
  return await this.save();
};

module.exports = FeedingSchedule;
