// models/entrada.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Entrada = sequelize.define('Entrada', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true
  });
  
  return Entrada;
};
