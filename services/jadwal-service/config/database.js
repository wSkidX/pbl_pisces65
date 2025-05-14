  const { Sequelize } = require('sequelize');
   require('dotenv').config();

   let sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME, // Nama database
    process.env.DB_USER, // Nama pengguna
    process.env.DB_PASSWORD, // Kata sandi pengguna
    {
      host: process.env.DB_HOST, // Host database
      dialect: 'mysql',
      logging: false, // Nonaktifkan logging jika tidak diperlukan
    }
  );
}

module.exports = sequelize;