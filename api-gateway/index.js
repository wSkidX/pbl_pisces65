const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const port = 8080;

// Proxy untuk auth-service
app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/',
  },
}));

// Proxy untuk schedule-service
app.use('/api/schedule', createProxyMiddleware({
  target: 'http://schedule-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/schedule': '/',
  },
}));

// Proxy untuk sensor-service
app.use('/api/sensor', createProxyMiddleware({
  target: 'http://sensor-service:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/sensor': '/',
  },
}));

// Proxy untuk log-service
app.use('/api/log', createProxyMiddleware({
  target: 'http://log-service:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/api/log': '/',
  },
}));

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
