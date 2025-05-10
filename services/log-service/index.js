require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const logRoutes = require('./routes/logRoutes');

const app = express();
app.use(express.json());

app.use('/', logRoutes);

sequelize.sync().then(() => {
  app.listen(3004, () => {
    console.log('Log service running on port 3004');
  });
});
