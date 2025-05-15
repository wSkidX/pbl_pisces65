/**
 * Repository untuk User
 * Bertanggung jawab untuk akses data User
 */
const { Op } = require('sequelize');
const User = require('../models/user');

class UserRepository {
  /**
   * Membuat user baru
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Mendapatkan semua user
   */
  async findAll(options = {}) {
    return await User.findAll(options);
  }

  /**
   * Mendapatkan user berdasarkan ID
   */
  async findById(id) {
    return await User.findByPk(id);
  }

  /**
   * Mendapatkan user berdasarkan email
   */
  async findByEmail(email) {
    return await User.findOne({
      where: { email }
    });
  }

  /**
   * Update user
   */
  async update(id, userData) {
    const user = await this.findById(id);
    if (!user) return null;
    
    return await user.update(userData);
  }

  /**
   * Menghapus user
   */
  async delete(id) {
    const user = await this.findById(id);
    if (!user) return false;
    
    await user.destroy();
    return true;
  }

  /**
   * Mencari user berdasarkan kriteria tertentu
   */
  async search(criteria) {
    const whereClause = {};
    
    if (criteria.email) {
      whereClause.email = { [Op.like]: `%${criteria.email}%` };
    }
    
    if (criteria.nama) {
      whereClause.nama = { [Op.like]: `%${criteria.nama}%` };
    }
    
    if (criteria.no_hp) {
      whereClause.no_hp = { [Op.like]: `%${criteria.no_hp}%` };
    }
    
    return await User.findAll({
      where: whereClause
    });
  }
}

module.exports = new UserRepository();
