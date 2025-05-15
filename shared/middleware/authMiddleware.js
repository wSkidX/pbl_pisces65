/**
 * Shared Authentication Middleware
 * Middleware untuk autentikasi JWT yang bisa digunakan di semua service
 */
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Konfigurasi
const config = {
  jwtSecret: process.env.JWT_SECRET || 'gantiDenganSecretYangKuat',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://auth-service:3000'
};

/**
 * Verifikasi token JWT
 * @param {string} token - Token JWT yang akan diverifikasi
 * @returns {Object} - Payload dari token JWT
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Token tidak valid');
  }
};

/**
 * Middleware untuk memvalidasi token JWT
 * Token bisa diambil dari header Authorization atau dari session
 */
const authenticateJWT = (req, res, next) => {
  try {
    // Cek token dari header Authorization
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Ambil token dari header Authorization
      token = authHeader.substring(7);
    } else if (req.session && req.session.token) {
      // Ambil token dari session
      token = req.session.token;
    } else {
      // Tidak ada token
      return res.status(401).json({ 
        error: 'Unauthorized', 
        detail: 'Token tidak ditemukan'
      });
    }
    
    // Verifikasi token
    const decoded = verifyToken(token);
    
    // Simpan user ID di request untuk digunakan di controller
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      detail: error.message 
    });
  }
};

/**
 * Middleware untuk memvalidasi token JWT secara opsional
 * Jika token valid, akan menyimpan user ID di request
 * Jika token tidak valid atau tidak ada, akan tetap melanjutkan request
 */
const optionalAuthenticateJWT = (req, res, next) => {
  try {
    // Cek token dari header Authorization
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Ambil token dari header Authorization
      token = authHeader.substring(7);
    } else if (req.session && req.session.token) {
      // Ambil token dari session
      token = req.session.token;
    }
    
    if (token) {
      // Verifikasi token
      const decoded = verifyToken(token);
      
      // Simpan user ID di request untuk digunakan di controller
      req.userId = decoded.id;
    }
    
    next();
  } catch (error) {
    // Jika token tidak valid, tetap lanjutkan request
    console.warn('Optional Authentication Warning:', error.message);
    next();
  }
};

/**
 * Middleware untuk memvalidasi token JWT dan mengambil data user dari auth-service
 * Ini berguna untuk service yang membutuhkan data user lengkap, bukan hanya user ID
 */
const authenticateJWTWithUserData = async (req, res, next) => {
  try {
    // Cek token dari header Authorization
    const authHeader = req.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Ambil token dari header Authorization
      token = authHeader.substring(7);
    } else if (req.session && req.session.token) {
      // Ambil token dari session
      token = req.session.token;
    } else {
      // Tidak ada token
      return res.status(401).json({ 
        error: 'Unauthorized', 
        detail: 'Token tidak ditemukan'
      });
    }
    
    // Verifikasi token
    const decoded = verifyToken(token);
    
    // Simpan user ID di request untuk digunakan di controller
    req.userId = decoded.id;
    
    // Ambil data user dari auth-service
    try {
      const response = await axios.get(`${config.authServiceUrl}/users/${decoded.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Simpan data user di request
      req.user = response.data;
      
      next();
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Jika gagal mengambil data user, tetap lanjutkan request dengan user ID saja
      next();
    }
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      detail: error.message 
    });
  }
};

module.exports = {
  authenticateJWT,
  optionalAuthenticateJWT,
  authenticateJWTWithUserData,
  verifyToken
};
