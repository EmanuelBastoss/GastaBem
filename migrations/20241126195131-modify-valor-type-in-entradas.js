'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Entradas', 'valor', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Entradas', 'valor', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
  }
};