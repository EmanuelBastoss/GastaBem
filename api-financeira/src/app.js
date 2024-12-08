require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { User } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'API Financeira está rodando!' });
});

module.exports = app;