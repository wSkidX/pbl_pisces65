const Schedule = require('../models/schedule');

class ScheduleController {
  static async createSchedule(req, res) {
    const { time, amount } = req.body;
    try {
      const schedule = await Schedule.create({ time, amount });
      res.status(201).json({ message: 'Schedule created', scheduleId: schedule.id });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create schedule' });
    }
  }

  static async getSchedules(req, res) {
    try {
      const schedules = await Schedule.findAll();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve schedules' });
    }
  }

  static async getScheduleById(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (schedule) res.json(schedule);
      else res.status(404).json({ error: 'Schedule tidak ditemukan' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve schedule' });
    }
  }

  static async updateSchedule(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).json({ error: 'Schedule tidak ditemukan' });
      await schedule.update(req.body);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  }

  static async deleteSchedule(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).json({ error: 'Schedule tidak ditemukan' });
      await schedule.destroy();
      res.json({ message: 'Schedule dihapus' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  }
}

module.exports = ScheduleController;
