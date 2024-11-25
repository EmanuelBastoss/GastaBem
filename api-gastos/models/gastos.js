// models/gasto.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gasto = sequelize.define('Gasto', {
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
      allowNull: false
    }
  }, {
    timestamps: true
  });
  
  Gasto.associate = function(models) {
    Gasto.belongsTo(models.User, { foreignKey: 'userId' });
  };
  
  return Gasto;
};
