const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Prometheus metrics
const register = require('./prometheus-setup');
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'gantiDenganSecretYangKuat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/', userRoutes);

// Handler 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
