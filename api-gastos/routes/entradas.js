// routes/entradas.js
const express = require('express');
const router = express.Router();
const { Entrada } = require('../models/entradas');
const auth = require('../../auth-api/middleware/auth');

// Rota para obter todas as entradas
router.get('/', auth, async (req, res) => {
  try {
    const entradas = await Entrada.findAll();
    res.json(entradas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Rota para criar uma nova entrada
router.post('/', auth, async (req, res) => {
  try {
    const { descricao, valor, categoria } = req.body;
    const userId = req.user.id;
    const novaEntrada = await Entrada.create({ 
      descricao, 
      valor, 
      categoria,
      data: new Date(),
      userId
    });
    res.status(201).json(novaEntrada);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar dados' });
  }
});

// Rota para atualizar uma entrada
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, categoria } = req.body;
    const entrada = await Entrada.findByPk(id);
    if (!entrada) {
      return res.status(404).json({ error: 'Dados não encontrados' });
    }
    entrada.descricao = descricao;
    entrada.valor = valor;
    entrada.categoria = categoria;
    await entrada.save();
    res.json(entrada);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar dados' });
  }
});

// Rota para deletar uma entrada
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const entrada = await Entrada.findByPk(id);
    if (!entrada) {
      return res.status(404).json({ error: 'Dado não encontrado' });
    }
    await entrada.destroy();
    res.json({ message: 'Dado removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover o dado' });
  }
});

module.exports = router;
