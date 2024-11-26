const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Nome é obrigatório
      validate: {
        notEmpty: true, // Nome não pode ser vazio
        len: [3, 255] // Nome deve ter entre 3 e 255 caracteres
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Email é obrigatório
      unique: true, // Email deve ser único
      validate: {
        isEmail: true // Valida o formato do email
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Senha é obrigatória
      validate: {
        notEmpty: true, // Senha não pode ser vazia
        len: [6, 255] // Senha deve ter entre 6 e 255 caracteres
      }
    }
  });

  User.beforeCreate(async (user) => {
    // Criptografa a senha antes de criar o usuário
    user.password = await bcrypt.hash(user.password, 10);
  });

  // Define a associação com o modelo Gasto
  User.associate = (models) => {
    User.hasMany(models.Gasto, { foreignKey: 'userId', as: 'gastos' });
  };


  return User;
};

