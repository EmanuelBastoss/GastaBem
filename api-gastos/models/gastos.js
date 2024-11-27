// api-gastos/src/models/gastos.js
module.exports = (sequelize, DataTypes) => {
  const Gasto = sequelize.define('Gasto', {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Gasto.associate = function(models) {
    Gasto.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Gasto;
};
