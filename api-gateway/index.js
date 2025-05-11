const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const port = 8080;

// Prometheus metrics
const register = require('./prometheus-setup');
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Proxy untuk auth-service
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '/',
  },
}));

// Proxy untuk jadwal-service (endpoint lebih singkat)
app.use('/jadwal', createProxyMiddleware({
  target: 'http://jadwal-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/jadwal': '/',
  },
}));

// Proxy untuk sensor-service (endpoint lebih singkat)
app.use('/sensor', createProxyMiddleware({
  target: 'http://sensor-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/sensor': '/',
  },
}));


app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
