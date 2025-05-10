require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const jadwalRoutes = require('./routes/jadwalRoutes');

const app = express();
app.use(express.json());

app.use('/', jadwalRoutes);

sequelize.sync().then(() => {
  app.listen(3002, () => {
    console.log('Jadwal service running on port 3002');
  });
});
