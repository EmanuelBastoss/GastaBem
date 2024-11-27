require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { User } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Log para debug
    console.log("Dados recebidos:", { 
      name, 
      email, 
      passwordLength: password ? password.length : 'undefined' 
    });

    // Validações
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'A senha deve ter pelo menos 6 caracteres!' 
      });
    }

    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password // Certifique-se de que a senha está sendo passada
    });
    
    // Log para debug
    console.log("Usuário criado:", {
      id: user.id,
      name: user.name,
      email: user.email
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
    console.error("Erro completo:", error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Este email já está cadastrado!' });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Dados inválidos! Verifique os campos e tente novamente.' 
      });
    }
    
    res.status(500).json({ error: 'Erro ao criar usuário!' });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Dados recebidos no login:', req.body);
  
  try {
   
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      console.log('Usuário não encontrado:', email);
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    console.log('Senha armazenada:', user.password);
    console.log('Senha recebida:', password);

    const isValidPassword = await user.checkPassword(password);
    
    if (!isValidPassword) {
      console.log("Senha inválida");
      return res.status(401).json({ error: 'Credenciais inválidas!' });
    }

    const token = jwt.sign({ 
      id: user.id,
      name: user.name,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login bem-sucedido para:", user.email);
    res.json({ 
      token,
      userName: user.name
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de reset de senha
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  console.log('Tentando resetar senha para:', email);

  try {
    const user = await User.scope('withPassword').findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      console.log('Usuário não encontrado:', email);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Criptografa a nova senha diretamente
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha no banco
    await User.update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );

    console.log('Senha atualizada com sucesso para:', email);
    res.status(200).json({ 
      message: 'Senha atualizada com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ 
      error: 'Erro ao atualizar senha!' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
