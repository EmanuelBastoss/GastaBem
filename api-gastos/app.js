require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const gastosRoutes = require('./routes/gastos.js');
const entradasRoutes = require('./routes/entradas.js');

const app = express();
const port = process.env.PORT || 5012;

app.use(cors());
app.use(express.json());
app.use('/api/entradas', entradasRoutes);
app.use('/api/gastos', gastosRoutes);

app.get('/', (req, res) => {
    res.send('Bem-vindo à API Gasta Bem!');
});

// Sincroniza os modelos com o banco de dados e inicia o servidor
async function startServer() {
    try {
        await db.sequelize.authenticate(); // Testa a conexão antes da sincronização
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        console.log('Configurações do banco de dados:', db.sequelize.config); // Exibe as configurações

        await db.sequelize.sync();
        console.log('Modelos sincronizados com o banco de dados.');

        app.listen(port, () => {
            console.log(`API rodando na porta ${port}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ou sincronizar com o banco de dados:', error);
    }
}

startServer(); // Chama a função para iniciar o servidor

