require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'gantiDenganSecretYangKuat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true jika sudah HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 hari
  }
}));

app.use('/', userRoutes);

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Auth service running on port 3001');
  });
});
