const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SensorData = sequelize.define('SensorData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  jumlahPakanKering: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  jumlahAir: {
    type: DataTypes.FLOAT,
    allowNull: false
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
});

module.exports = SensorData;