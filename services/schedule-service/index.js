require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
app.use(express.json());

app.use('/', scheduleRoutes);

sequelize.sync().then(() => {
  app.listen(3002, () => {
    console.log('Schedule service running on port 3002');
  });
});
