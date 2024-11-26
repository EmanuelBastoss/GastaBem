// api-gastos/src/models/gastos.js
module.exports = (sequelize, DataTypes) => {
  const Gasto = sequelize.define('Gasto', {
    descricao: DataTypes.STRING,
    valor: DataTypes.DECIMAL(10, 2),
    data: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' 
    }
  });

  Gasto.associate = function (models) {
    Gasto.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Gasto;
};
