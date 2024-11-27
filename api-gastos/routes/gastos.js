const express = require('express');
const router = express.Router();
const { Gasto } = require('../models');
const authenticateToken = require('../middleware/auth');

// GET - Listar todos os gastos
router.get('/', authenticateToken, async (req, res) => {
    try {
        console.log('Buscando gastos para o usuário:', req.user.id);
        
        const gastos = await Gasto.findAll({
            where: { userId: req.user.id },
            order: [['data', 'DESC']]
        });
        
        console.log('Gastos encontrados:', gastos.length);
        console.log('Gastos:', gastos);
        
        res.json(gastos);
    } catch (error) {
        console.error('Erro ao buscar gastos:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar gastos',
            error: error.message 
        });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { descricao, valor, categoria, data } = req.body;
        console.log('Dados recebidos:', req.body);
        console.log('Usuario:', req.user);

        // Validação dos dados
        if (!descricao || !valor || !categoria || !data) {
            return res.status(400).json({ 
                message: 'Todos os campos são obrigatórios',
                received: req.body 
            });
        }

        const gasto = await Gasto.create({
            descricao,
            valor: parseFloat(valor),
            categoria,
            data: new Date(data),
            userId: req.user.id // ID do usuário do token
        });

        console.log('Gasto criado:', gasto);

        res.status(201).json(gasto);
    } catch (error) {
        console.error('Erro ao criar gasto:', error);
        res.status(500).json({ 
            message: 'Erro ao criar gasto',
            error: error.message 
        });
    }
});

module.exports = router;
