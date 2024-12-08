'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    });

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    });

    const indices = await queryInterface.showIndex('Users');
    const emailIndexExists = indices.some(index => index.name === 'users_email_unique');
    
    if (!emailIndexExists) {
      await queryInterface.addIndex('Users', ['email'], {
        unique: true,
        name: 'users_email_unique'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
 
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    });


    try {
      await queryInterface.removeIndex('Users', 'users_email_unique');
    } catch (error) {
      console.log('Índice não existe ou já foi removido');
    }
  }
};