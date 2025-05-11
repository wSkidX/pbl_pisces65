require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');

sequelize.sync().then(() => {
  app.listen(3003, () => {
    console.log('Sensor service running on port 3003');
  });
});
