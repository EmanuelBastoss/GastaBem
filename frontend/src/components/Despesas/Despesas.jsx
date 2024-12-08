import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';
import Navbar from '../Navbar/Navbar';
import ModalLancamento from '../Modal/ModalLancamento';
import Lista from '../Lista/Lista';
import './Despesas.css';

function Despesas() {
    const [lancamentos, setLancamentos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [filtro, setFiltro] = useState('todos');
    const [itemEditando, setItemEditando] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await fetch(`${API_URL}/lancamentos`, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar dados');
            }

            const dados = await response.json();
            setLancamentos(dados);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados: ' + error.message);
        }
    };

    const handleSalvarLancamento = async (novoLancamento) => {
        try {
            const token = localStorage.getItem('userToken');
            const url = itemEditando 
                ? `${API_URL}/lancamentos/${itemEditando.id}`
                : `${API_URL}/lancamentos`;
            
            const response = await fetch(url, {
                method: itemEditando ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoLancamento)
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar lançamento');
            }

            setModalAberto(false);
            setItemEditando(null);
            await carregarDados();
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    };

    const handleDelete = async (id, tipo) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_URL}/lancamentos/${id}?tipo=${tipo}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir lançamento');
            }

            await carregarDados();
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    };

    const listaFiltrada = lancamentos.filter(item => {
        if (filtro === 'despesas') return item.tipo === 'saida';
        if (filtro === 'entradas') return item.tipo === 'entrada';
        return true;
    });

    const calcularTotais = () => {
        const totais = lancamentos.reduce((acc, lancamento) => {
            const valor = Number(lancamento.valor);
            if (lancamento.tipo === 'entrada') {
                acc.totalEntradas += valor;
            } else {
                acc.totalSaidas += valor;
            }
            return acc;
        }, { totalEntradas: 0, totalSaidas: 0 });

        return {
            ...totais,
            saldo: totais.totalEntradas - totais.totalSaidas
        };
    };

    return (
        <div className="despesas-container">
            <Navbar />
            <div className="content">
                <div className="resumo-container">
                    <div className={`resumo-item ${calcularTotais().saldo >= 0 ? 'positivo' : 'negativo'}`}>
                        <h3>Saldo</h3>
                        <p>R$ {calcularTotais().saldo.toFixed(2)}</p>
                    </div>
                    <div className="resumo-item entrada">
                        <h3>Entradas</h3>
                        <p>R$ {calcularTotais().totalEntradas.toFixed(2)}</p>
                    </div>
                    <div className="resumo-item saida">
                        <h3>Saídas</h3>
                        <p>R$ {calcularTotais().totalSaidas.toFixed(2)}</p>
                    </div>
                </div>
                
                <div className="buttons-container">
                    <button 
                        onClick={() => {
                            setItemEditando(null);
                            setModalAberto(true);
                        }}
                        className="add-button"
                    >
                        Novo Lançamento
                    </button>
                </div>

                <div className="filtro-container">
                    <button onClick={() => setFiltro('todos')} className="filtro-button">Todos</button>
                    <button onClick={() => setFiltro('despesas')} className="filtro-button">Despesas</button>
                    <button onClick={() => setFiltro('entradas')} className="filtro-button">Entradas</button>
                </div>

                <Lista 
                    rows={listaFiltrada} 
                    onEdit={(item) => {
                        setItemEditando(item);
                        setModalAberto(true);
                    }}
                    onDelete={handleDelete} 
                />
            </div>

            <ModalLancamento 
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    setItemEditando(null);
                }}
                onSave={handleSalvarLancamento}
                lancamentoEditando={itemEditando}
            />
        </div>
    );
}

export default Despesas;