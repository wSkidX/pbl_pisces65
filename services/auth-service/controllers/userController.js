/**
 * Controller untuk User
 * Menggunakan repository pattern dan domain service
 */
const authenticationService = require('../domain/authenticationService');
const userRepository = require('../repositories/userRepository');

class UserController {
  /**
   * Register user baru
   */
  static async register(req, res) {
    try {
      // Mapping dari format lama ke format baru
      const userData = {
        email: req.body.email,
        password: req.body.password,
        nama: req.body.nama,
        no_hp: req.body.nohp || req.body.no_hp, // Support both formats
        alamat: req.body.alamat
      };
      
      // Validasi input
      if (!userData.email || !userData.password || !userData.nama) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'Email, password, dan nama harus diisi'
        });
      }
      
      // Register user via domain service
      const user = await authenticationService.register(userData);
      
      res.status(201).json({ 
        message: 'Registrasi berhasil', 
        user
      });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(400).json({ 
        error: 'Registrasi gagal', 
        detail: error.message 
      });
    }
  }

  /**
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validasi input
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Data tidak lengkap',
          detail: 'Email dan password harus diisi'
        });
      }
      
      // Login user via domain service
      const result = await authenticationService.login(email, password);
      
      // Set session
      req.session.userid = result.user.id;
      req.session.token = result.token;
      
      res.json({ 
        message: 'Login berhasil', 
        user: result.user,
        token: result.token
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(401).json({ 
        error: 'Login gagal', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan semua user
   */
  static async getAll(req, res) {
    try {
      // Cek authorization
      if (!req.session.userid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Get users via repository
      const users = await userRepository.findAll();
      
      // Hapus password dari response
      const usersResponse = users.map(user => {
        const userObj = user.toJSON();
        delete userObj.password;
        return userObj;
      });
      
      res.json(usersResponse);
    } catch (error) {
      console.error('Get All Users Error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve users', 
        detail: error.message 
      });
    }
  }

  /**
   * Mendapatkan user berdasarkan ID
   */
  static async getById(req, res) {
    try {
      // Cek authorization
      if (!req.session.userid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Get user via domain service
      const user = await authenticationService.getUserById(req.params.id);
      
      res.json(user);
    } catch (error) {
      console.error('Get User By Id Error:', error);
      if (error.message === 'User tidak ditemukan') {
        res.status(404).json({ error: 'User tidak ditemukan' });
      } else {
        res.status(500).json({ 
          error: 'Failed to retrieve user', 
          detail: error.message 
        });
      }
    }
  }

  /**
   * Update user
   */
  static async update(req, res) {
    try {
      // Cek authorization
      if (!req.session.userid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Mapping dari format lama ke format baru
      const userData = {};
      
      // Hanya update field yang diizinkan
      const allowedFields = ['email', 'password', 'nama', 'no_hp', 'alamat'];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          userData[field] = req.body[field];
        }
      });
      
      // Support untuk format lama
      if (req.body.nohp !== undefined) {
        userData.no_hp = req.body.nohp;
      }
      
      // Update user via domain service
      const updatedUser = await authenticationService.updateUser(req.params.id, userData);
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Update User Error:', error);
      if (error.message === 'User tidak ditemukan') {
        res.status(404).json({ error: 'User tidak ditemukan' });
      } else {
        res.status(500).json({ 
          error: 'Failed to update user', 
          detail: error.message 
        });
      }
    }
  }

  /**
   * Delete user
   */
  static async delete(req, res) {
    try {
      // Cek authorization
      if (!req.session.userid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Delete user via domain service
      await authenticationService.deleteUser(req.params.id);
      
      res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
      console.error('Delete User Error:', error);
      if (error.message === 'User tidak ditemukan') {
        res.status(404).json({ error: 'User tidak ditemukan' });
      } else {
        res.status(500).json({ 
          error: 'Failed to delete user', 
          detail: error.message 
        });
      }
    }
  }

  /**
   * Logout user
   */
  static async logout(req, res) {
    try {
      req.session.destroy(err => {
        if (err) {
          console.error('Logout Error:', err);
          return res.status(500).json({ 
            error: 'Logout gagal', 
            detail: err.message 
          });
        }
        
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout berhasil' });
      });
    } catch (error) {
      console.error('Logout Error:', error);
      res.status(500).json({ 
        error: 'Logout gagal', 
        detail: error.message 
      });
    }
  }
}

module.exports = UserController;
