/**
 * Middleware untuk autentikasi JWT
 * Digunakan untuk memvalidasi token JWT dari request
 */
const authenticationService = require('../domain/authenticationService');

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
    const decoded = authenticationService.verifyToken(token);
    
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
      const decoded = authenticationService.verifyToken(token);
      
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

module.exports = {
  authenticateJWT,
  optionalAuthenticateJWT
};
