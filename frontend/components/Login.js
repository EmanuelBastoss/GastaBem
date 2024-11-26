// src/components/Login.js
import React, { useState } from 'react';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Login realizado com sucesso!');
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
