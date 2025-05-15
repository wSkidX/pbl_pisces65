const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true, // Ini akan membuat created_at dan updated_at
  underscored: true // Menggunakan snake_case untuk nama kolom
});

// Domain methods
User.prototype.isValidPassword = async function(password) {
  // Implementasi validasi password akan ditambahkan di userController
  return true;
};

module.exports = User;
