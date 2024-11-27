'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  // Inicializa o Sequelize usando uma variável de ambiente, se disponível
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Inicializa o Sequelize com as credenciais do arquivo de configuração
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Importa o modelo User do diretório compartilhado
const User = require('../../shared/models/user')(sequelize, Sequelize.DataTypes);
db.User = User;

// Carrega todos os modelos do diretório atual
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Ignora arquivos ocultos
      file !== basename && // Ignora o próprio arquivo index.js
      file.slice(-3) === '.js' && // Considera apenas arquivos .js
      file.indexOf('.test.js') === -1 // Ignora arquivos de teste
    );
  })
  .forEach(file => {
    // Importa e inicializa cada modelo
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Configura associações entre modelos, se existirem
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Adiciona instâncias do Sequelize ao objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
