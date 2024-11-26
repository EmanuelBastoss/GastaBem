const express = require('express');
const { Gasto } = require('../models');
const authMiddleware = require('../../auth-api/middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Criar um novo gasto
router.post('/', async (req, res) => {
  try {
    const { descricao, valor, data } = req.body;
    const gasto = await Gasto.create({
      descricao,
      valor,
      data,
      userId: req.user.id // Usa o ID do usuário do token
    });
    res.status(201).json(gasto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar gastos do usuário
router.get('/', async (req, res) => {
  try {
    const gastos = await Gasto.findAll({
      where: { userId: req.user.id } // Filtra por usuário
    });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um gasto
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, categoria } = req.body;
    const gasto = await Gasto.findByPk(id);
    if (!gasto) {
      return res.status(404).json({ error: 'Dados não encontrados' });
    }
    gasto.descricao = descricao;
    gasto.valor = valor;
    gasto.categoria = categoria;
    await gasto.save();
    res.json(gasto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar dados' });
  }
});

// Rota para deletar um gasto
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const gasto = await Gasto.findByPk(id);
    if (!gasto) {
      return res.status(404).json({ error: 'Dado não encontrado' });
    }
    await gasto.destroy();
    res.json({ message: 'Dado removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover o dado' });
  }
});

router.get('/resumo', auth, async (req, res) => {
  try {
    const gastos = await Gasto.findAll({ where: { userId: req.user.id } });
    const totalDespesas = gastos.reduce((sum, gasto) => sum + Number(gasto.valor), 0);
    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + Number(gasto.valor);
      return acc;
    }, {});

    res.json({ totalDespesas, gastosPorCategoria });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter resumo dos gastos' });
  }
});

module.exports = router;
