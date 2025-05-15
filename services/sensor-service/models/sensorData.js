const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID dari auth-service, opsional karena mungkin ada sensor tanpa user'
  },
  feed_level: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Level pakan dalam cm atau persen'
  },
  water_level: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Level air dalam cm atau persen'
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Suhu dalam derajat Celsius'
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'ID perangkat ESP32'
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'manual'
  },
  waktu_pakan: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true, // Ini akan membuat created_at dan updated_at
  underscored: true, // Menggunakan snake_case untuk nama kolom
  tableName: 'sensor_data' // Nama tabel di database
});

// Domain methods
SensorData.prototype.isLevelSufficient = function(requiredFeedLevel, requiredWaterLevel) {
  return this.feed_level >= requiredFeedLevel && this.water_level >= requiredWaterLevel;
};

// Value Objects
class FeedLevel {
  constructor(value) {
    this.value = value;
  }
  
  isLow() {
    return this.value < 20; // 20% dianggap rendah
  }
  
  isCritical() {
    return this.value < 10; // 10% dianggap kritis
  }
}

class WaterLevel {
  constructor(value) {
    this.value = value;
  }
  
  isLow() {
    return this.value < 30; // 30% dianggap rendah
  }
  
  isCritical() {
    return this.value < 15; // 15% dianggap kritis
  }
}

// Menambahkan Value Objects ke model
SensorData.FeedLevel = FeedLevel;
SensorData.WaterLevel = WaterLevel;

module.exports = SensorData;