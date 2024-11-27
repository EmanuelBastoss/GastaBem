const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    async checkPassword(password) {
      try {
        console.log("Verificando senha...");
        console.log("Senha fornecida:", password);
        console.log("Hash armazenado:", this.password);
        
        if (!password || !this.password) {
          console.log("Senha ou hash ausente");
          return false;
        }
        
        const isValid = await bcrypt.compare(password, this.password);
        console.log("Resultado da verificação:", isValid);
        return isValid;
      } catch (error) {
        console.error("Erro ao verificar senha:", error);
        console.error("Detalhes do erro:", error.message);
        return false;
      }
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: {
        attributes: {}
      }
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          console.log("Criptografando senha para novo usuário");
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          console.log("Criptografando nova senha");
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};

