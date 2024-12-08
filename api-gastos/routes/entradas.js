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

// Editar entrada
router.put('/:id', authenticateToken, async (req, res) => {
    console.log('ID recebido para edição:', req.params.id);
    try {
        const { id } = req.params;
        const [updated] = await Entrada.update(req.body, {
            where: { id, userId: req.user.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Entrada não encontrada' });
        }

        const updatedEntrada = await Entrada.findOne({ where: { id } });
        res.json(updatedEntrada);
    } catch (error) {
        console.error('Erro ao editar entrada:', error);
        res.status(500).json({ message: 'Erro ao editar entrada' });
    }
});

// Excluir entrada
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const entrada = await Entrada.destroy({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!entrada) {
            return res.status(404).json({ message: 'Entrada não encontrada' });
        }

        res.status(204).send(); // Sucesso, mas sem conteúdo
    } catch (error) {
        console.error('Erro ao excluir entrada:', error);
        res.status(500).json({ message: 'Erro ao excluir entrada' });
    }
});

module.exports = router;
