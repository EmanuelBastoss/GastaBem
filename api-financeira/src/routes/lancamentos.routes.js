const router = require('express').Router();
const { Lancamento } = require('../models');

/**
 * @swagger
 * /api/lancamentos:
 *   get:
 *     summary: Lista todos os lançamentos do usuário
 *     tags: [Lançamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lançamentos
 *       401:
 *         description: Não autorizado
 */
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

/**
 * @swagger
 * /api/lancamentos:
 *   post:
 *     summary: Cria um novo lançamento
 *     tags: [Lançamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valor
 *               - descricao
 *               - data
 *               - tipo
 *               - categoria
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 100.50
 *               descricao:
 *                 type: string
 *                 example: "Pagamento de conta"
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-20"
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *                 example: "saida"
 *               categoria:
 *                 type: string
 *                 example: "Alimentação"
 *     responses:
 *       201:
 *         description: Lançamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 valor:
 *                   type: number
 *                 descricao:
 *                   type: string
 *                 data:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 userId:
 *                   type: integer
 */
router.post('/', async (req, res) => {
    try {
        const { valor, descricao, data, tipo, categoria } = req.body;
        
        if (!['entrada', 'saida'].includes(tipo)) {
            return res.status(400).json({ 
                message: 'Tipo deve ser entrada ou saida' 
            });
        }

        const lancamento = await Lancamento.create({
            valor,
            descricao,
            data,
            tipo,
            categoria,
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
/**
 * @swagger
 * /api/lancamentos/{id}:
 *   put:
 *     summary: Edita um lançamento existente
 *     tags: [Lançamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lançamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *                 example: 150.00
 *               descricao:
 *                 type: string
 *                 example: "Conta de luz atualizada"
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-20"
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *                 example: "saida"
 *               categoria:
 *                 type: string
 *                 example: "Contas"
 *     responses:
 *       200:
 *         description: Lançamento atualizado com sucesso
 *       404:
 *         description: Lançamento não encontrado
 *       500:
 *         description: Erro ao editar lançamento
 * 
 *   delete:
 *     summary: Exclui um lançamento
 *     tags: [Lançamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lançamento
 *     responses:
 *       204:
 *         description: Lançamento excluído com sucesso
 *       404:
 *         description: Lançamento não encontrado
 *       500:
 *         description: Erro ao excluir lançamento
 */

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