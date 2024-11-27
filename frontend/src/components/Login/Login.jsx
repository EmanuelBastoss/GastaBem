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
    const [mostrarSenha, setMostrarSenha] = useState(false);
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
        
        
           
                
                
                <div className="form">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="form-header">
                            <div className="title">
                                <h1>Bem-vindo ao GastaBem!</h1>
                            </div>
                        </div>
                        <div class="container-sm">
                            <div className="input-group">
                            <div className="input-group has-validation">
                                <span className="input-group-text">@</span>
                                <div className={`form-floating ${erro ? 'is-invalid' : ''}`}>
                                    <input
                                        type="email"
                                        className={`form-control ${erro ? 'is-invalid' : ''}`}
                                        id="email"
                                        placeholder="nome@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="off"
                                    />
                                    <label htmlFor="email">Email do usuário</label>
                                </div>
                            </div>
                            <div className="input-group has-validation">
                                <span className="input-group-text">#</span>
                                <div className={`form-floating ${erro ? 'is-invalid' : ''}`}>
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        className={`form-control ${erro ? 'is-invalid' : ''}`}
                                        id="senha"
                                        placeholder="Senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="off"
                                        
                                    />
                                    <label htmlFor="senha">Senha</label>
                                </div>
                                <button 
                                    className="input-group-text" 
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    {mostrarSenha ? "👁️" : "👁️‍🗨️"}
                                </button>
                                {erro && <div className="invalid-feedback">{erro}</div>}
                            </div>
                        </div>
                        </div>

                        <div className="login-button">
                            <button type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Login'}
                            </button>
                        </div>

                        <div className="form-links">
                            <div className="esqueci-senha">
                                <Link to="/senha">Esqueci minha senha</Link>
                            </div>
                            <div className="registrar">
                                Não tem uma conta? <Link to="/register">Cadastre-se</Link>
                            </div>
                        </div>
                    </form>
                </div>
        
    
    );
}

export default Login; 