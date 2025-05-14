const Jadwal = require('../models/jadwal');

class JadwalController {
  static async createJadwal(req, res) {
    const { waktu_tanggal, waktu_jam } = req.body;
    try {
      const jadwal = await Jadwal.create({ waktu_tanggal, waktu_jam });
      res.status(201).json({ message: 'Jadwal created', jadwalId: jadwal.idjadwal });
    } catch (error) {
      console.error('Jadwal Create Error:', error);
      res.status(400).json({ error: 'Failed to create jadwal', detail: error.message });
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

  static async getNextJadwal(req, res) {
    try {
      // Ambil jadwal "pending" terdekat setelah sekarang
      const now = new Date();
      const jadwal = await Jadwal.findOne({
        where: {
          status: 'pending',
          waktu_tanggal: { $gte: now.toISOString().slice(0,10) }
        },
        order: [['waktu_tanggal', 'ASC'], ['waktu_jam', 'ASC']]
      });
      if (jadwal) res.json(jadwal);
      else res.json({});
    } catch (error) {
      res.status(500).json({ error: 'Failed to get next jadwal', detail: error.message });
    }
  }

  static async getLastFeedingLog(req, res) {
    try {
      // Ambil jadwal terakhir yang sudah dilakukan (status 'done' atau 'pending')
      const now = new Date();
      const jadwal = await Jadwal.findOne({
        where: {
          status: ['done', 'pending'],
          waktu_tanggal: { $lte: now.toISOString().slice(0,10) }
        },
        order: [['waktu_tanggal', 'DESC'], ['waktu_jam', 'DESC']]
      });
      if (jadwal) res.json(jadwal);
      else res.json({});
    } catch (error) {
      res.status(500).json({ error: 'Failed to get last feeding log', detail: error.message });
    }
    
  }

}

module.exports = JadwalController;
