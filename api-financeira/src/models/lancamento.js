'use strict';

module.exports = (sequelize, DataTypes) => {
  const Lancamento = sequelize.define('Lancamento', {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'saida'),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  
  Lancamento.associate = function(models) {
    Lancamento.belongsTo(models.User, { 
      foreignKey: 'userId',
      as: 'user'
    });
  };
  
  return Lancamento;
}; 