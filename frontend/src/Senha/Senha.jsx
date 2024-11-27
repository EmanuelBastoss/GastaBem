import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Senha.css';
import loginImg from '../assets/imagens/loginImg.jpeg';

function Senha() {
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5001/reset-password', {
                email: email.toLowerCase(),
                newPassword: novaSenha
            });

            if (response.status === 200) {
                setMessage('Senha alterada com sucesso!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Email não encontrado no sistema.');
            } else {
                setError('Erro ao alterar a senha. Tente novamente mais tarde.');
                console.error('Erro:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-image">
                <img src={loginImg} alt="Recuperação de Senha" />
            </div>
            
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="form-header">
                        <div className="title">
                            <h1>Alteração de Senha</h1>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-group has-validation mb-3">
                            <span className="input-group-text">@</span>
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    id="email"
                                    placeholder="nome@exemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <label htmlFor="email">Digite seu email</label>
                            </div>
                        </div>

                        <div className="input-group has-validation mb-3">
                            <span className="input-group-text">#</span>
                            <div className="form-floating">
                                <input
                                    type="password"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    id="novaSenha"
                                    placeholder="Nova Senha"
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <label htmlFor="novaSenha">Digite sua nova senha</label>
                            </div>
                            {error && <div className="invalid-feedback">{error}</div>}
                        </div>
                    </div>

                    {message && (
                        <div className="alert alert-success" role="alert">
                            {message}
                        </div>
                    )}

                    <div className="login-button">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </div>

                    <div className="form-links">
                        <button 
                            type="button" 
                            onClick={() => navigate('/login')} 
                            className="back-button"
                        >
                            Voltar para Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Senha;
