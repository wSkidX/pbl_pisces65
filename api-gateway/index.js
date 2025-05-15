const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const port = 8080;

// Middleware CORS global
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

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

// Proxy untuk notification-service
app.use('/notifications', createProxyMiddleware({
  target: 'http://notification-service:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/notifications': '/api',
  },
}));


// Import dashboard route
const dashboardRouter = require('./routes/dashboard');
app.use('/', dashboardRouter);

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
