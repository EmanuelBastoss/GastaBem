const express = require('express');
const router = express.Router();
const { Gasto, Entrada } = require('../models');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const gastos = await Gasto.findAll({
      where: { userId },
      order: [['data', 'ASC']]
    });

    const entradas = await Entrada.findAll({
      where: { userId },
      order: [['data', 'ASC']]
    });

    const todosLancamentos = [...gastos, ...entradas].sort((a, b) => new Date(a.data) - new Date(b.data));

    res.json(todosLancamentos); 
  } catch (error) {
    console.error('Erro ao buscar lançamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar lançamentos' });
  }
});

module.exports = router;