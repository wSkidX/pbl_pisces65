const express = require('express');
const jadwalRoutes = require('./routes/jadwalRoutes');

const app = express();
app.use(express.json());
app.use('/', jadwalRoutes);

module.exports = app;
