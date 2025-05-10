require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/', userRoutes);

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Auth service running on port 3001');
  });
});
