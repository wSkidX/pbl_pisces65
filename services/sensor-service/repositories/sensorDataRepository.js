/**
 * Repository untuk SensorData
 * Bertanggung jawab untuk akses data SensorData
 */
const { Op } = require('sequelize');
const SensorData = require('../models/sensorData');

class SensorDataRepository {
  /**
   * Membuat data sensor baru
   */
  async create(sensorData) {
    return await SensorData.create(sensorData);
  }

  /**
   * Mendapatkan semua data sensor
   */
  async findAll(options = {}) {
    return await SensorData.findAll(options);
  }

  /**
   * Mendapatkan data sensor berdasarkan ID
   */
  async findById(id) {
    return await SensorData.findByPk(id);
  }

  /**
   * Mendapatkan data sensor terbaru
   */
  async getLatest() {
    return await SensorData.findOne({
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Mendapatkan data sensor dalam rentang waktu tertentu
   */
  async getByDateRange(startDate, endDate) {
    return await SensorData.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['created_at', 'ASC']]
    });
  }

  /**
   * Mendapatkan data sensor berdasarkan device_id
   */
  async getByDeviceId(deviceId) {
    return await SensorData.findAll({
      where: {
        device_id: deviceId
      },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Update data sensor
   */
  async update(id, sensorData) {
    const data = await this.findById(id);
    if (!data) return null;
    
    return await data.update(sensorData);
  }

  /**
   * Menghapus data sensor
   */
  async delete(id) {
    const data = await this.findById(id);
    if (!data) return false;
    
    await data.destroy();
    return true;
  }

  /**
   * Mendapatkan statistik sensor (min, max, avg) dalam rentang waktu
   */
  async getStats(startDate, endDate) {
    const stats = await SensorData.findAll({
      attributes: [
        [SensorData.sequelize.fn('MIN', SensorData.sequelize.col('feed_level')), 'min_feed_level'],
        [SensorData.sequelize.fn('MAX', SensorData.sequelize.col('feed_level')), 'max_feed_level'],
        [SensorData.sequelize.fn('AVG', SensorData.sequelize.col('feed_level')), 'avg_feed_level'],
        [SensorData.sequelize.fn('MIN', SensorData.sequelize.col('water_level')), 'min_water_level'],
        [SensorData.sequelize.fn('MAX', SensorData.sequelize.col('water_level')), 'max_water_level'],
        [SensorData.sequelize.fn('AVG', SensorData.sequelize.col('water_level')), 'avg_water_level']
      ],
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    return stats[0];
  }
}

module.exports = new SensorDataRepository();
