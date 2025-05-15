/**
 * Controller untuk FeedingSchedule
 * Menggunakan repository pattern dan domain service
 */
const feedingScheduleRepository = require('../repositories/feedingScheduleRepository');
const feedingExecutionService = require('../domain/feedingExecutionService');

class JadwalController {
  static async createJadwal(req, res) {
    try {
      const { user_id, tanggal, jam, volume_pakan, volume_air, durasi_bibis, repeat_daily } = req.body;
      
      // Validasi input
      if (!tanggal || !jam) {
        return res.status(400).json({ error: 'Tanggal dan jam harus diisi' });
      }
      
      const scheduleData = {
        user_id: user_id || '00000000-0000-0000-0000-000000000000', // Default jika tidak ada user_id
        tanggal,
        jam,
        volume_pakan: volume_pakan || 0,
        volume_air: volume_air || 0,
        durasi_bibis: durasi_bibis || 10,
        repeat_daily: repeat_daily || false
      };
      
      const jadwal = await feedingScheduleRepository.create(scheduleData);
      res.status(201).json({ 
        message: 'Jadwal created', 
        jadwalId: jadwal.id,
        jadwal
      });
    } catch (error) {
      console.error('Jadwal Create Error:', error);
      res.status(400).json({ error: 'Failed to create jadwal', detail: error.message });
    }
  }

  static async getJadwals(req, res) {
    try {
      // Bisa tambahkan filter berdasarkan query params
      const options = {};
      if (req.query.status) {
        options.where = { status: req.query.status };
      }
      
      const jadwals = await feedingScheduleRepository.findAll(options);
      res.json(jadwals);
    } catch (error) {
      console.error('Get Jadwals Error:', error);
      res.status(500).json({ error: 'Failed to retrieve jadwals', detail: error.message });
    }
  }

  static async getJadwalById(req, res) {
    try {
      const jadwal = await feedingScheduleRepository.findById(req.params.id);
      if (jadwal) res.json(jadwal);
      else res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    } catch (error) {
      console.error('Get Jadwal By Id Error:', error);
      res.status(500).json({ error: 'Failed to retrieve jadwal', detail: error.message });
    }
  }

  static async updateJadwal(req, res) {
    try {
      // Hanya update field yang diizinkan
      const allowedFields = ['tanggal', 'jam', 'volume_pakan', 'volume_air', 'durasi_bibis', 'repeat_daily', 'status'];
      const updateData = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });
      
      const updatedJadwal = await feedingScheduleRepository.update(req.params.id, updateData);
      
      if (!updatedJadwal) {
        return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
      }
      
      res.json(updatedJadwal);
    } catch (error) {
      console.error('Update Jadwal Error:', error);
      res.status(500).json({ error: 'Failed to update jadwal', detail: error.message });
    }
  }

  static async deleteJadwal(req, res) {
    try {
      const deleted = await feedingScheduleRepository.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
      }
      
      res.json({ message: 'Jadwal berhasil dihapus' });
    } catch (error) {
      console.error('Delete Jadwal Error:', error);
      res.status(500).json({ error: 'Failed to delete jadwal', detail: error.message });
    }
  }

  static async getNextJadwal(req, res) {
    try {
      const nextJadwal = await feedingScheduleRepository.getNextPendingSchedule();
      
      if (nextJadwal) {
        res.json(nextJadwal);
      } else {
        res.json({});
      }
    } catch (error) {
      console.error('Get Next Jadwal Error:', error);
      res.status(500).json({ error: 'Failed to get next jadwal', detail: error.message });
    }
  }

  static async getLastFeedingLog(req, res) {
    try {
      const lastExecuted = await feedingScheduleRepository.getLastExecutedSchedule();
      
      if (lastExecuted) {
        res.json(lastExecuted);
      } else {
        res.json({});
      }
    } catch (error) {
      console.error('Get Last Feeding Log Error:', error);
      res.status(500).json({ error: 'Failed to get last feeding log', detail: error.message });
    }
  }
  
  /**
   * Endpoint untuk memicu eksekusi jadwal secara manual
   * Berguna untuk testing atau trigger manual
   */
  static async executeScheduledFeedings(req, res) {
    try {
      await feedingExecutionService.executeScheduledFeedings();
      res.json({ message: 'Scheduled feedings execution triggered' });
    } catch (error) {
      console.error('Execute Scheduled Feedings Error:', error);
      res.status(500).json({ error: 'Failed to execute scheduled feedings', detail: error.message });
    }
  }

}

module.exports = JadwalController;
