const Jadwal = require('../models/jadwal');

class JadwalController {
  static async createJadwal(req, res) {
    const { time, amount } = req.body;
    try {
      const jadwal = await Jadwal.create({ time, amount });
      res.status(201).json({ message: 'Jadwal created', jadwalId: jadwal.id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create jadwal' });
    }
  }

  static async getJadwals(req, res) {
    try {
      const jadwals = await Jadwal.findAll();
      res.json(jadwals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve jadwals' });
    }
  }

  static async getJadwalById(req, res) {
    try {
      const jadwal = await Jadwal.findByPk(req.params.id);
      if (jadwal) res.json(jadwal);
      else res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve jadwal' });
    }
  }

  static async updateJadwal(req, res) {
    try {
      const jadwal = await Jadwal.findByPk(req.params.id);
      if (!jadwal) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
      await jadwal.update(req.body);
      res.json(jadwal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update jadwal' });
    }
  }

  static async deleteJadwal(req, res) {
    try {
      const jadwal = await Jadwal.findByPk(req.params.id);
      if (!jadwal) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
      await jadwal.destroy();
      res.json({ message: 'Jadwal dihapus' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete jadwal' });
    }
  }
}

module.exports = JadwalController;
