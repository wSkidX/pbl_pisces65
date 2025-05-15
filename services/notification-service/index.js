/**
 * Entry point untuk notification-service
 */
const app = require('./app');
const sequelize = require('./config/database');

// Port dari environment variable atau default 3003
const PORT = process.env.PORT || 3003;

// Test koneksi database
sequelize.testConnection();

// Start server
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
