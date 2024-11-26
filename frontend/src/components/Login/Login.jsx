import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import loginImg from '../../assets/imagens/loginImg.jpeg';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/login', {
                email: email.toLowerCase(),
                password: senha
            });

            if (response.status === 200) {
                localStorage.setItem('userToken', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErro('Email ou Senha incorretos!');
            } else {
                setErro('Erro ao conectar com o servidor');
                console.error('Erro:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="container">
                <div className="form-image">
                    <img src={loginImg} alt="Login" />
                </div>
                
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-header">
                            <div className="title">
                                <h1>Bem-vindo ao GastaBem!</h1>
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-box">
                                <label htmlFor="email">Email do usuário</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="input-box">
                                <label htmlFor="senha">Senha</label>
                                <input
                                    id="senha"
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Digite sua senha"
                                    required
                                    disabled={loading}
                                />
                                <div>
                                    {erro && <span className="erro-mensagem">{erro}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="login-button">
                            <button type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Login'}
                            </button>
                        </div>

                        <div className="form-links">
                            <Link to="/forgot-password">Esqueci minha senha</Link>
                            <div className="registrar">
                                Não tem uma conta? <Link to="/register">Cadastre-se</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login; 