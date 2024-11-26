'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Nome é obrigatório
        validate: {
          notEmpty: true, // Nome não pode ser vazio
          len: [3, 255] // Nome deve ter entre 3 e 255 caracteres
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Email é obrigatório
        unique: true, // Email deve ser único
        validate: {
          isEmail: true // Valida o formato do email
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // Senha é obrigatória
        validate: {
          notEmpty: true, // Senha não pode ser vazia
          len: [6, 255] // Senha deve ter entre 6 e 255 caracteres
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};

