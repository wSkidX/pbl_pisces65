'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Langkah 1: Buat tabel baru sensor_data
    await queryInterface.createTable('sensor_data', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'ID dari auth-service, opsional karena mungkin ada sensor tanpa user'
      },
      feed_level: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Level pakan dalam cm atau persen'
      },
      water_level: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Level air dalam cm atau persen'
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: true,
        comment: 'Suhu dalam derajat Celsius'
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'ID perangkat ESP32'
      },
      mode: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'manual'
      },
      waktu_pakan: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    // Langkah 2: Migrasi data dari tabel SensorData ke sensor_data (jika ada)
    const sensorData = await queryInterface.sequelize.query(
      'SELECT * FROM SensorData;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (sensorData.length > 0) {
      const newSensorData = sensorData.map(data => ({
        id: Sequelize.Utils.uuid(),
        user_id: null, // Default null karena tidak ada di struktur lama
        feed_level: data.jumlahPakanKering,
        water_level: data.jumlahAir,
        temperature: null, // Default null karena tidak ada di struktur lama
        device_id: null, // Default null karena tidak ada di struktur lama
        mode: data.mode || 'manual',
        waktu_pakan: data.waktu_pakan,
        created_at: data.createdAt || new Date(),
        updated_at: data.updatedAt || new Date()
      }));

      await queryInterface.bulkInsert('sensor_data', newSensorData);
    }

    // Langkah 3: Drop tabel lama (opsional, bisa dikomentari jika ingin backup)
    // await queryInterface.dropTable('SensorData');
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Drop tabel baru
    await queryInterface.dropTable('sensor_data');
    
    // Jika tabel lama sudah dihapus dan ingin di-restore, uncomment baris berikut
    /*
    await queryInterface.createTable('SensorData', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      jumlahPakanKering: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      jumlahAir: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      mode: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'manual'
      },
      waktu_pakan: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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
