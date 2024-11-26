import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import loginImg from '../../assets/imagens/loginImg.jpeg';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            // Log para debug
            console.log("Enviando dados:", {
                name: formData.name,
                email: formData.email,
                passwordLength: formData.password ? formData.password.length : 'undefined'
            });

            const response = await axios.post('http://localhost:5001/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            console.log("Resposta:", response.data);
            navigate('/login');
        } catch (error) {
            console.error("Erro completo:", error);
            setErro(error.response?.data?.error || 'Erro ao criar conta!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="container">
                <div className="form-image">
                    <img src={loginImg} alt="Cadastro" />
                </div>
                
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-header">
                            <div className="title">
                                <h1>Cadastre-se no GastaBem!</h1>
                            </div>
                        </div>

                        <div className="input-box">
                            <label htmlFor="name">Nome completo</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Digite seu nome completo"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-box">
                                <label htmlFor="email">Insira seu email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Digite seu email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="input-box">
                                <label htmlFor="password">Crie sua senha</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Digite sua senha"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="input-box">
                                <label htmlFor="confirmPassword">Repita sua senha</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repita sua senha"
                                    required
                                    disabled={loading}
                                />
                                <div>
                                    {erro && <span className="erro-mensagem" style={{color: 'red', fontSize: '0.85rem', marginRight: '15px'}}>{erro}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="login-button">
                            <button type="submit" disabled={loading}>
                                {loading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </div>

                        <div className="form-links">
                            <div className="registrar">
                                Já tem uma conta? <Link to="/login">Login</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
