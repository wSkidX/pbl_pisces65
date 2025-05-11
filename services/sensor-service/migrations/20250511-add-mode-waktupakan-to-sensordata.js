"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("SensorData", "mode", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "manual"
    });
    await queryInterface.addColumn("SensorData", "waktu_pakan", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("SensorData", "mode");
    await queryInterface.removeColumn("SensorData", "waktu_pakan");
  }
};
