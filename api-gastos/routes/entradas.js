// routes/entradas.js
const express = require('express');
const router = express.Router();
const { Entrada } = require('../models');
const authenticateToken = require('../middleware/auth');

// Listar todas as entradas do usuário
router.get('/', authenticateToken, async (req, res) => {
    try {
        const entradas = await Entrada.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.json(entradas);
    } catch (error) {
        console.error('Erro ao buscar entradas:', error);
        res.status(500).json({ message: 'Erro ao buscar entradas' });
    }
});

// Criar nova entrada
router.post('/', authenticateToken, async (req, res) => {
    try {
        const entrada = await Entrada.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(entrada);
    } catch (error) {
        console.error('Erro ao criar entrada:', error);
        res.status(500).json({ message: 'Erro ao criar entrada' });
    }
});

module.exports = router;
