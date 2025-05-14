const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jadwal = sequelize.define('Jadwal', {
  idjadwal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  waktu_tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  waktu_jam: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'done']]
    }
  }
});

module.exports = Jadwal;
