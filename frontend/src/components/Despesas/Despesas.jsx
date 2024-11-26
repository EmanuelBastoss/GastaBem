import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import ModalDespesa from '../Modal/ModalDespesa';
import ModalEntrada from '../Modal/ModalEntrada';
import './Despesas.css';

function Despesas() {
    const [despesas, setDespesas] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
    const [modalEntradaAberto, setModalEntradaAberto] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const token = localStorage.getItem('userToken');
            
            // Carregar despesas
            const respDespesas = await fetch('http://localhost:5012/api/gastos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const dadosDespesas = await respDespesas.json();
            setDespesas(dadosDespesas);

            // Carregar entradas
            const respEntradas = await fetch('http://localhost:5012/api/entradas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const dadosEntradas = await respEntradas.json();
            setEntradas(dadosEntradas);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const handleSalvarDespesa = async (novaDespesa) => {
        try {
            const token = localStorage.getItem('userToken');
            console.log('Token:', token); // Para debug
            console.log('Dados sendo enviados:', novaDespesa); // Para debug

            const response = await fetch('http://localhost:5012/api/gastos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novaDespesa)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao salvar:', errorData); // Para debug
                throw new Error(errorData.message || 'Erro ao salvar despesa');
            }

            const data = await response.json();
            console.log('Resposta do servidor:', data); // Para debug
            
            setModalDespesaAberto(false);
            carregarDados();
        } catch (error) {
            console.error('Erro ao salvar despesa:', error);
            alert('Erro ao salvar despesa: ' + error.message);
        }
    };

    const handleSalvarEntrada = async (novaEntrada) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:5012/api/entradas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novaEntrada)
            });

            if (response.ok) {
                setModalEntradaAberto(false);
                carregarDados();
            }
        } catch (error) {
            console.error('Erro ao salvar entrada:', error);
        }
    };

    return (
        <div className="despesas-container">
            <Navbar />
            
            <div className="content">
                <div className="buttons-container">
                    <button 
                        onClick={() => setModalDespesaAberto(true)}
                        className="add-button despesa"
                    >
                        Adicionar Despesa
                    </button>
                    <button 
                        onClick={() => setModalEntradaAberto(true)}
                        className="add-button entrada"
                    >
                        Adicionar Entrada
                    </button>
                </div>

                <div className="lists-container">
                    <div className="list-section">
                        <h2>Despesas</h2>
                        <div className="transactions-list">
                            {despesas.map((despesa) => (
                                <div key={despesa.id} className="transaction-item despesa">
                                    <div className="transaction-info">
                                        <h3>{despesa.descricao}</h3>
                                        <p>R$ {Number(despesa.valor).toFixed(2)}</p>
                                        <p>{despesa.categoria}</p>
                                        <p>{new Date(despesa.data).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="list-section">
                        <h2>Entradas</h2>
                        <div className="transactions-list">
                            {entradas.map((entrada) => (
                                <div key={entrada.id} className="transaction-item entrada">
                                    <div className="transaction-info">
                                        <h3>{entrada.descricao}</h3>
                                        <p>R$ {Number(entrada.valor).toFixed(2)}</p>
                                        <p>{entrada.categoria}</p>
                                        <p>{new Date(entrada.data).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ModalDespesa 
                isOpen={modalDespesaAberto}
                onClose={() => setModalDespesaAberto(false)}
                onSave={handleSalvarDespesa}
            />

            <ModalEntrada
                isOpen={modalEntradaAberto}
                onClose={() => setModalEntradaAberto(false)}
                onSave={handleSalvarEntrada}
            />
        </div>
    );
}

export default Despesas;