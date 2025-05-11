const express = require('express');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
app.use(express.json());
app.use('/', sensorRoutes);

module.exports = app;
