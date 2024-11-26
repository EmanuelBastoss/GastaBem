import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [despesas, setDespesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');
            console.log('Token:', token);

            const response = await fetch('http://localhost:5012/api/gastos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${await response.text()}`);
            }

            const data = await response.json();
            console.log('Dados recebidos:', data);
            setDespesas(data);
            setError(null);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGasto = () => {
        navigate('/despesas'); // Navega para a página de despesas
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="content">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <button onClick={handleAddGasto} className="add-button">
                        Adicionar Gasto
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Carregando dados...</div>
                ) : error ? (
                    <div className="error">Erro ao carregar dados: {error}</div>
                ) : despesas.length === 0 ? (
                    <div className="no-data">
                        <p>Nenhuma despesa encontrada.</p>
                        <button onClick={handleAddGasto} className="add-button">
                            Adicionar Primeira Despesa
                        </button>
                    </div>
                ) : (
                    <div className="despesas-list">
                        {despesas.map((despesa) => (
                            <div key={despesa.id} className="despesa-item">
                                <h3>{despesa.descricao}</h3>
                                <p>R$ {Number(despesa.valor).toFixed(2)}</p>
                                <p>{despesa.categoria}</p>
                                <p>{new Date(despesa.data).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;