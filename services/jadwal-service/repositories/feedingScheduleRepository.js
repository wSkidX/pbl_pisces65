/**
 * Repository untuk FeedingSchedule
 * Bertanggung jawab untuk akses data FeedingSchedule
 */
const { Op } = require('sequelize');
const FeedingSchedule = require('../models/jadwal');

class FeedingScheduleRepository {
  /**
   * Membuat jadwal baru
   */
  async create(scheduleData) {
    return await FeedingSchedule.create(scheduleData);
  }

  /**
   * Mendapatkan semua jadwal
   */
  async findAll(options = {}) {
    return await FeedingSchedule.findAll(options);
  }

  /**
   * Mendapatkan jadwal berdasarkan ID
   */
  async findById(id) {
    return await FeedingSchedule.findByPk(id);
  }

  /**
   * Mendapatkan jadwal yang pending dan waktunya sudah tiba
   */
  async getPendingSchedulesForNow() {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS
    
    return await FeedingSchedule.findAll({
      where: {
        status: 'pending',
        [Op.or]: [
          {
            // Jadwal untuk hari ini yang waktunya sudah lewat
            tanggal: today,
            jam: {
              [Op.lte]: currentTime
            }
          },
          {
            // Jadwal untuk hari-hari sebelumnya yang belum dieksekusi
            tanggal: {
              [Op.lt]: today
            }
          }
        ]
      }
    });
  }

  /**
   * Mendapatkan jadwal berikutnya yang pending
   */
  async getNextPendingSchedule() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return await FeedingSchedule.findOne({
      where: {
        status: 'pending',
        [Op.or]: [
          {
            // Jadwal untuk hari ini yang belum dieksekusi
            tanggal: today,
            jam: {
              [Op.gte]: now.toTimeString().split(' ')[0]
            }
          },
          {
            // Jadwal untuk hari-hari berikutnya
            tanggal: {
              [Op.gt]: today
            }
          }
        ]
      },
      order: [
        ['tanggal', 'ASC'],
        ['jam', 'ASC']
      ]
    });
  }

  /**
   * Mendapatkan jadwal terakhir yang sudah dieksekusi
   */
  async getLastExecutedSchedule() {
    return await FeedingSchedule.findOne({
      where: {
        status: 'success'
      },
      order: [
        ['last_executed_at', 'DESC']
      ]
    });
  }

  /**
   * Update jadwal
   */
  async update(id, scheduleData) {
    const schedule = await this.findById(id);
    if (!schedule) return null;
    
    return await schedule.update(scheduleData);
  }

  /**
   * Menandai jadwal sebagai sudah dieksekusi
   */
  async markAsExecuted(id) {
    const schedule = await this.findById(id);
    if (!schedule) return null;
    
    return await schedule.markAsExecuted();
  }

  /**
   * Menandai jadwal sebagai gagal
   */
  async markAsFailed(id, reason) {
    const schedule = await this.findById(id);
    if (!schedule) return null;
    
    return await schedule.markAsFailed(reason);
  }

  /**
   * Menghapus jadwal
   */
  async delete(id) {
    const schedule = await this.findById(id);
    if (!schedule) return false;
    
    await schedule.destroy();
    return true;
  }
}

module.exports = new FeedingScheduleRepository();
