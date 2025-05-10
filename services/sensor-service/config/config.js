module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.DB_NAME || 'db_sensorService',
    host: 'mysql',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: (process.env.DB_NAME ? process.env.DB_NAME + '_test' : 'db_sensorService_test'),
    host: 'mysql',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: (process.env.DB_NAME ? process.env.DB_NAME + '_prod' : 'db_sensorService_prod'),
    host: 'mysql',
    dialect: 'mysql'
  }
};
