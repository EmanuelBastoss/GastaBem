require('dotenv').config();
const express = require('express');
const cors = require('cors');
const gastosRouter = require('./routes/gastos');
const entradasRouter = require('./routes/entradas');
const lancamentosRouter = require('./routes/lancamentos');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/gastos', gastosRouter);
app.use('/api/entradas', entradasRouter);
app.use('/api/lancamentos', lancamentosRouter);

// Verificação se o servidor está rodando
app.get('/', (req, res) => {
    res.json({ message: 'API Gastos está rodando!' });
});

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

