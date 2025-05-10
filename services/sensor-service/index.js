require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
app.use(express.json());

app.use('/', sensorRoutes);

sequelize.sync().then(() => {
  app.listen(3003, () => {
    console.log('Sensor service running on port 3003');
  });
});
