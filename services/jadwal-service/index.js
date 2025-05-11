require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');

sequelize.sync().then(() => {
  app.listen(3002, () => {
    console.log('Jadwal service running on port 3002');
  });
});
