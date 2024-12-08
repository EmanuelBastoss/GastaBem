const express = require('express');
const router = express.Router();
const { Gasto } = require('../models');
const authenticateToken = require('../middleware/auth');

// Listar todos os gastos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const gastos = await Gasto.findAll({
            where: { userId: req.user.id },
            order: [['data', 'ASC']]
        });
        res.json(gastos);
    } catch (error) {
        console.error('Erro ao buscar gastos:', error);
        res.status(500).json({ message: 'Erro ao buscar gastos' });
    }
});

// Criar novo gasto
router.post('/', authenticateToken, async (req, res) => {
    try {
        const gasto = await Gasto.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(gasto);
    } catch (error) {
        console.error('Erro ao criar gasto:', error);
        res.status(500).json({ message: 'Erro ao criar gasto' });
    }
});

// Editar gasto
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Gasto.update(req.body, {
            where: { id, userId: req.user.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Gasto não encontrado' });
        }

        const updatedGasto = await Gasto.findOne({ where: { id } });
        res.json(updatedGasto);
    } catch (error) {
        console.error('Erro ao editar gasto:', error);
        res.status(500).json({ message: 'Erro ao editar gasto' });
    }
});

// Excluir gasto
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const gasto = await Gasto.destroy({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!gasto) {
            return res.status(404).json({ message: 'Gasto não encontrado' });
        }

        res.status(204).send(); // Sucesso, mas sem conteúdo
    } catch (error) {
        console.error('Erro ao excluir gasto:', error);
        res.status(500).json({ message: 'Erro ao excluir gasto' });
    }
});

module.exports = router;
