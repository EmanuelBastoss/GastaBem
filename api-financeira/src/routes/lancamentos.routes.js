const router = require('express').Router();
const { Lancamento } = require('../models');

// Listar todos os lançamentos
router.get('/', async (req, res) => {
    try {
        const lancamentos = await Lancamento.findAll({
            where: { userId: req.user.id },
            order: [['data', 'ASC']]
        });
        res.json(lancamentos);
    } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
        res.status(500).json({ message: 'Erro ao buscar lançamentos' });
    }
});

// Criar novo lançamento
router.post('/', async (req, res) => {
    try {
        const lancamento = await Lancamento.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(lancamento);
    } catch (error) {
        console.error('Erro ao criar lançamento:', error);
        res.status(500).json({ message: 'Erro ao criar lançamento' });
    }
});

// Editar lançamento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Lancamento.update(req.body, {
            where: { id, userId: req.user.id }
        });

        if (!updated) {
            return res.status(404).json({ message: 'Lançamento não encontrado' });
        }

        const updatedLancamento = await Lancamento.findOne({ 
            where: { id, userId: req.user.id } 
        });
        res.json(updatedLancamento);
    } catch (error) {
        console.error('Erro ao editar lançamento:', error);
        res.status(500).json({ message: 'Erro ao editar lançamento' });
    }
});

// Excluir lançamento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Lancamento.destroy({
            where: { id, userId: req.user.id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Lançamento não encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir lançamento:', error);
        res.status(500).json({ message: 'Erro ao excluir lançamento' });
    }
});

module.exports = router; 