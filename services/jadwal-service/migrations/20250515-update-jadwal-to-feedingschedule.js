'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Langkah 1: Buat tabel baru feeding_schedules
    await queryInterface.createTable('feeding_schedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'ID dari auth-service'
      },
      tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      jam: {
        type: Sequelize.TIME,
        allowNull: false
      },
      volume_pakan: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Persentase dari hasil pengukuran ultrasonik'
      },
      volume_air: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
        comment: 'Persentase dari hasil pengukuran ultrasonik'
      },
      durasi_bibis: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
        comment: 'Durasi dalam detik'
      },
      repeat_daily: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'True jika berulang harian'
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending'
      },
      last_executed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu terakhir jadwal dieksekusi'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Langkah 2: Migrasi data dari tabel Jadwal ke feeding_schedules (jika ada)
    const jadwals = await queryInterface.sequelize.query(
      'SELECT * FROM Jadwal;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (jadwals.length > 0) {
      const feedingSchedules = jadwals.map(jadwal => ({
        id: Sequelize.Utils.uuid(),
        user_id: '00000000-0000-0000-0000-000000000000', // Default user_id
        tanggal: jadwal.waktu_tanggal,
        jam: jadwal.waktu_jam,
        volume_pakan: 0, // Default
        volume_air: 0, // Default
        durasi_bibis: 10, // Default
        repeat_daily: false,
        status: jadwal.status === 'done' ? 'success' : jadwal.status,
        created_at: jadwal.createdAt || new Date(),
        updated_at: jadwal.updatedAt || new Date()
      }));

      await queryInterface.bulkInsert('feeding_schedules', feedingSchedules);
    }

    // Langkah 3: Drop tabel lama (opsional, bisa dikomentari jika ingin backup)
    // await queryInterface.dropTable('Jadwals');
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Drop tabel baru
    await queryInterface.dropTable('feeding_schedules');
    
    // Jika tabel lama sudah dihapus dan ingin di-restore, uncomment baris berikut
    /*
    await queryInterface.createTable('Jadwals', {
      idjadwal: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      waktu_tanggal: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      waktu_jam: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    */
  }
};
