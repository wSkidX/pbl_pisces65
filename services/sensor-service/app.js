const express = require('express');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();
app.use(express.json());

// Prometheus metrics
const register = require('./prometheus-setup');
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/', sensorRoutes);

module.exports = app;
