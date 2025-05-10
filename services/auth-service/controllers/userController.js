const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class UserController {
  static async register(req, res) {
    try {
      const { email, password, nama, nohp, alamat } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, nama, nohp, alamat });
      res.status(201).json({ message: 'Registrasi berhasil', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email/password salah' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email/password salah' });
    }
    req.session.userid = user.userid;
    res.json({ message: 'Login berhasil', user: { userid: user.userid, email: user.email, nama: user.nama, nohp: user.nohp, alamat: user.alamat } });
  }

  static async getAll(req, res) {
    if (!req.session.userid) return res.status(401).json({ error: 'Unauthorized' });
    const users = await User.findAll();
    res.json(users);
  }

  static async getById(req, res) {
    if (!req.session.userid) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findByPk(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User tidak ditemukan' });
  }

  static async update(req, res) {
    if (!req.session.userid) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    await user.update(req.body);
    res.json(user);
  }

  static async delete(req, res) {
    if (!req.session.userid) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    await user.destroy();
    res.json({ message: 'User dihapus' });
  }

  static async logout(req, res) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Logout gagal' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout berhasil' });
    });
  }
}

module.exports = UserController;
