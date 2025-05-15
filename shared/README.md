# Pisces65 Shared Package

Package ini berisi utility dan middleware yang bisa digunakan di semua service dalam aplikasi Pisces65.

## Instalasi

Untuk menggunakan package ini di service lain, tambahkan dependency berikut di package.json service:

```json
"dependencies": {
  "pisces65-shared": "file:../shared"
}
```

Kemudian jalankan:

```bash
npm install
```

## Penggunaan

### Auth Middleware

Middleware untuk autentikasi JWT yang bisa digunakan di semua service:

```javascript
const { authMiddleware } = require('pisces65-shared');

// Di file routes
router.get('/protected-route', authMiddleware.authenticateJWT, (req, res) => {
  // req.userId berisi ID user dari token JWT
  res.json({ message: 'Protected route', userId: req.userId });
});

// Jika ingin autentikasi opsional
router.get('/semi-protected-route', authMiddleware.optionalAuthenticateJWT, (req, res) => {
  // req.userId berisi ID user dari token JWT jika ada
  if (req.userId) {
    res.json({ message: 'User authenticated', userId: req.userId });
  } else {
    res.json({ message: 'User not authenticated' });
  }
});

// Jika ingin autentikasi dengan data user lengkap
router.get('/user-data-route', authMiddleware.authenticateJWTWithUserData, (req, res) => {
  // req.user berisi data user lengkap dari auth-service
  res.json({ message: 'User data route', user: req.user });
});
```

### Error Middleware

Middleware untuk handling error yang bisa digunakan di semua service:

```javascript
const { errorMiddleware } = require('pisces65-shared');

// Di file app.js
const app = express();

// ... routes dan middleware lainnya

// Error handling middleware (harus diletakkan setelah semua routes)
app.use(errorMiddleware.notFound); // 404 handler
app.use(errorMiddleware.validationErrorHandler); // Sequelize validation error handler
app.use(errorMiddleware.errorHandler); // General error handler

// Async error handler untuk route handlers
app.get('/async-route', errorMiddleware.asyncHandler(async (req, res) => {
  // Tidak perlu try-catch, error akan ditangkap oleh asyncHandler
  const data = await someAsyncFunction();
  res.json(data);
}));
```

## Konfigurasi

Package ini menggunakan environment variable berikut:

- `JWT_SECRET`: Secret key untuk verifikasi token JWT
- `AUTH_SERVICE_URL`: URL untuk auth-service (default: http://auth-service:3000)
- `NODE_ENV`: Environment (development/production), mempengaruhi detail error yang ditampilkan

Pastikan environment variable tersebut sudah diset di service yang menggunakan package ini.
