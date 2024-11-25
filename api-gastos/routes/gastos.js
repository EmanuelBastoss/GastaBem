// routes/gastos.js
const express = require('express');
const router = express.Router();
const { Gasto } = require('../models');
const auth = require('../../auth-api/middleware/auth'); // Certifique-se de ter o middleware de autenticação

// Rota para obter todos os gastos
router.get('/', auth, async (req, res) => {
  try {
      const gastos = await Gasto.findAll();
      console.log("Gastos encontrados:", gastos); // Adicione esta linha
      res.json(gastos);
  } catch (err) {
      console.error("Erro ao buscar gastos:", err); // E esta também
      res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});


// Rota para criar um novo gasto
router.post('/', auth, async (req, res) => {
  try {
    const { descricao, valor, categoria } = req.body;
    const userId = req.user.id; // Obtém o userId do token JWT
    const novoGasto = await Gasto.create({ 
      descricao, 
      valor, 
      categoria,
      data: new Date(),
      userId
    });
    res.status(201).json(novoGasto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar dados' });
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

module.exports = router;
