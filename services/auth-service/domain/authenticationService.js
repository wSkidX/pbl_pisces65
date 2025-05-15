/**
 * Domain Service untuk autentikasi
 * Bertanggung jawab untuk logika bisnis terkait autentikasi
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthenticationService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'gantiDenganSecretYangKuat';
    this.jwtExpiresIn = '24h';
    this.saltRounds = 10;
  }

  /**
   * Register user baru
   */
  async register(userData) {
    try {
      // Cek apakah email sudah digunakan
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email sudah digunakan');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);
      
      // Buat user baru
      const user = await userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      // Hapus password dari response
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      return userResponse;
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Cari user berdasarkan email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Email atau password salah');
      }
      
      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email atau password salah');
      }
      
      // Generate JWT token
      const token = this.generateToken(user);
      
      // Hapus password dari response
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      return {
        user: userResponse,
        token
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      console.error('Verify Token Error:', error);
      throw new Error('Token tidak valid');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }
      
      // Hapus password dari response
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      return userResponse;
    } catch (error) {
      console.error('Get User By Id Error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    try {
      // Jika ada password, hash password
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, this.saltRounds);
      }
      
      const user = await userRepository.update(id, userData);
      if (!user) {
        throw new Error('User tidak ditemukan');
      }
      
      // Hapus password dari response
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      return userResponse;
    } catch (error) {
      console.error('Update User Error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    try {
      const deleted = await userRepository.delete(id);
      if (!deleted) {
        throw new Error('User tidak ditemukan');
      }
      
      return true;
    } catch (error) {
      console.error('Delete User Error:', error);
      throw error;
    }
  }
}

module.exports = new AuthenticationService();
