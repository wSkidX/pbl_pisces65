const Log = require('../models/log');

class LogController {
  static async createLog(req, res) {
    const { service, message, level } = req.body;
    try {
      const log = await Log.create({ service, message, level });
      res.status(201).json({ message: 'Log created', logId: log.id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create log' });
    }
  }

  static async getLogs(req, res) {
    try {
      const logs = await Log.findAll();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve logs' });
    }
  }

  static async getLogById(req, res) {
    try {
      const log = await Log.findByPk(req.params.id);
      if (log) res.json(log);
      else res.status(404).json({ error: 'Log tidak ditemukan' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve log' });
    }
  }

  static async updateLog(req, res) {
    try {
      const log = await Log.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: 'Log tidak ditemukan' });
      await log.update(req.body);
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update log' });
    }
  }

  static async deleteLog(req, res) {
    try {
      const log = await Log.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: 'Log tidak ditemukan' });
      await log.destroy();
      res.json({ message: 'Log dihapus' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete log' });
    }
  }
}

module.exports = LogController;
