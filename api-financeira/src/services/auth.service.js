const { User } = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register({ name, email, password }) {
        if (!password || password.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres!');
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }

    async login({ email, password }) {
        const user = await User.scope('withPassword').findOne({ where: { email } });
        
        if (!user || !(await user.checkPassword(password))) {
            throw new Error('Credenciais inválidas!');
        }

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { token, userName: user.name };
    }

    async resetPassword({ email, newPassword }) {
        const user = await User.scope('withPassword').findOne({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(
            { password: hashedPassword },
            { where: { id: user.id } }
        );
    }
}

module.exports = new AuthService(); 