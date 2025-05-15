'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Helper function untuk cek apakah kolom ada
    const columnExists = async (queryInterface, tableName, columnName) => {
      const tableInfo = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM ${tableName} LIKE '${columnName}'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      return tableInfo.length > 0;
    };
    
    // Langkah 1: Tambahkan kolom baru ke tabel Users jika belum ada
    if (!(await columnExists(queryInterface, 'Users', 'id'))) {
      await queryInterface.addColumn('Users', 'id', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: true // Sementara allow null untuk migrasi
      });

      // Langkah 2: Isi kolom id dengan UUID untuk setiap record
      await queryInterface.sequelize.query(`
        UPDATE Users 
        SET id = uuid() 
        WHERE id IS NULL
      `);

      // Langkah 3: Ubah kolom id menjadi NOT NULL
      await queryInterface.changeColumn('Users', 'id', {
        type: Sequelize.UUID,
        allowNull: false
      });
    }

    // Langkah 4: Rename kolom nohp menjadi no_hp jika kolom nohp ada dan no_hp belum ada
    if ((await columnExists(queryInterface, 'Users', 'nohp')) && !(await columnExists(queryInterface, 'Users', 'no_hp'))) {
      await queryInterface.renameColumn('Users', 'nohp', 'no_hp');
    }

    // Langkah 5: Ubah tipe data alamat menjadi TEXT
    await queryInterface.changeColumn('Users', 'alamat', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Langkah 6: Tambahkan timestamps jika belum ada
    if (!(await columnExists(queryInterface, 'Users', 'created_at'))) {
      await queryInterface.addColumn('Users', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    if (!(await columnExists(queryInterface, 'Users', 'updated_at'))) {
      await queryInterface.addColumn('Users', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      });
    }

    // Langkah 7: Hapus primary key dari userid dan set id sebagai primary key baru jika id ada
    // Ini adalah langkah yang sensitif, jadi kita buat conditional
    if (await columnExists(queryInterface, 'Users', 'id')) {
      const tableInfo = await queryInterface.sequelize.query(
        `SHOW KEYS FROM Users WHERE Key_name = 'PRIMARY'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Cek apakah primary key saat ini adalah userid
      if (tableInfo.length > 0 && tableInfo[0].Column_name === 'userid') {
        try {
          // Drop primary key lama
          await queryInterface.removeConstraint('Users', 'PRIMARY');
          
          // Set primary key baru jika belum ada primary key pada id
          const idPrimaryCheck = await queryInterface.sequelize.query(
            `SHOW KEYS FROM Users WHERE Column_name = 'id' AND Key_name = 'PRIMARY'`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
          );
          
          if (idPrimaryCheck.length === 0) {
            await queryInterface.addConstraint('Users', {
              fields: ['id'],
              type: 'primary key',
              name: 'users_pk'
            });
          }
        } catch (error) {
          console.error('Error updating primary key:', error.message);
          // Lanjutkan migrasi meskipun ada error pada langkah ini
        }
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Helper function untuk cek apakah kolom ada
    const columnExists = async (queryInterface, tableName, columnName) => {
      const tableInfo = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM ${tableName} LIKE '${columnName}'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      return tableInfo.length > 0;
    };
    
    // Rollback: Kembalikan struktur tabel ke bentuk semula dengan pengecekan
    try {
      // Cek dan hapus primary key dari id jika ada
      const idPrimaryCheck = await queryInterface.sequelize.query(
        `SHOW KEYS FROM Users WHERE Column_name = 'id' AND Key_name = 'PRIMARY' OR Key_name = 'users_pk'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (idPrimaryCheck.length > 0) {
        try {
          await queryInterface.removeConstraint('Users', idPrimaryCheck[0].Key_name);
        } catch (error) {
          console.error('Error removing id primary key:', error.message);
        }
      }
      
      // Set kembali userid sebagai primary key jika belum
      const useridPrimaryCheck = await queryInterface.sequelize.query(
        `SHOW KEYS FROM Users WHERE Column_name = 'userid' AND Key_name = 'PRIMARY'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      
      if (useridPrimaryCheck.length === 0 && await columnExists(queryInterface, 'Users', 'userid')) {
        try {
          await queryInterface.addConstraint('Users', {
            fields: ['userid'],
            type: 'primary key',
            name: 'PRIMARY'
          });
        } catch (error) {
          console.error('Error adding userid primary key:', error.message);
        }
      }
      
      // Rename kolom no_hp kembali menjadi nohp jika ada
      if (await columnExists(queryInterface, 'Users', 'no_hp') && !(await columnExists(queryInterface, 'Users', 'nohp'))) {
        await queryInterface.renameColumn('Users', 'no_hp', 'nohp');
      }
      
      // Ubah kembali tipe data alamat jika ada
      if (await columnExists(queryInterface, 'Users', 'alamat')) {
        await queryInterface.changeColumn('Users', 'alamat', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }
      
      // Hapus kolom id jika ada
      if (await columnExists(queryInterface, 'Users', 'id')) {
        await queryInterface.removeColumn('Users', 'id');
      }
      
      // Hapus timestamps jika ada
      if (await columnExists(queryInterface, 'Users', 'created_at')) {
        await queryInterface.removeColumn('Users', 'created_at');
      }
      
      if (await columnExists(queryInterface, 'Users', 'updated_at')) {
        await queryInterface.removeColumn('Users', 'updated_at');
      }
    } catch (error) {
      console.error('Error during migration rollback:', error);
      throw error;
    }
  }
};

// Helper function untuk cek apakah kolom ada
async function columnExists(queryInterface, tableName, columnName) {
  try {
    const tableInfo = await queryInterface.describeTable(tableName);
    return !!tableInfo[columnName];
  } catch (error) {
    return false;
  }
}
