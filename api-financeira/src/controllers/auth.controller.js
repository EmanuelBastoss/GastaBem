const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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