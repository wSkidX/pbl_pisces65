const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class UserController {
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.create({ username, password });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    // Dummy login, sesuaikan jika ada autentikasi
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.json({ message: 'Login berhasil', user });
    } else {
      res.status(401).json({ error: 'Username/password salah' });
    }
  }

  static async getAll(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  static async getById(req, res) {
    const user = await User.findByPk(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User tidak ditemukan' });
  }

  static async update(req, res) {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    await user.update(req.body);
    res.json(user);
  }

  static async delete(req, res) {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    await user.destroy();
    res.json({ message: 'User dihapus' });
  }
}

module.exports = UserController;
