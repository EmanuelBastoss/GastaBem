const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Token não fornecido ou inválido
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Acesso negado. Token não fornecido ou inválido.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        if (!password || password.length < 6) {
            return res.status(400).json({ 
                error: 'A senha deve ter pelo menos 6 caracteres!' 
            });
        }

        const user = await User.create({ 
            name, 
            email: email.toLowerCase(), 
            password
        });
        
        res.status(201).json({ 
            message: 'Usuário criado com sucesso!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Este email já está cadastrado!' });
        }
        
        res.status(500).json({ error: 'Erro ao criar usuário!' });
    }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Realiza login do usuário
 *     description: |
 *       Para testar as rotas protegidas:
 *       1. Execute esta rota de login com email e senha
 *       2. Copie o token da resposta
 *       3. Clique no botão 'Authorize' no topo da página
 *       4. Cole o token no formato: Bearer seu-token-aqui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@exemplo.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 userName:
 *                   type: string
 *                   example: "João Silva"
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.scope('withPassword').findOne({ where: { email } });
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Credenciais inválidas!' });
        }

        const token = jwt.sign({ 
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            token,
            userName: user.name
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Altera a senha do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.scope('withPassword').findOne({ 
            where: { email: email.toLowerCase() } 
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(
            { password: hashedPassword },
            { where: { id: user.id } }
        );

        res.status(200).json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar senha!' });
    }
}; 