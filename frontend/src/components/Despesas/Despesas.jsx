import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import ModalDespesa from '../Modal/ModalDespesa';
import ModalEntrada from '../Modal/ModalEntrada';
import Lista from '../Lista/Lista';
import './Despesas.css';

function Despesas() {
    const [despesas, setDespesas] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [modalDespesaAberto, setModalDespesaAberto] = useState(false);
    const [modalEntradaAberto, setModalEntradaAberto] = useState(false);
    const [filtro, setFiltro] = useState('todos');
    const [despesaEditando, setDespesaEditando] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('Token não encontrado. Por favor, faça login novamente.');
                return;
            }
            
            // Carregar despesas e entradas
            const [respDespesas, respEntradas] = await Promise.all([
                fetch('http://localhost:5012/api/gastos', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5012/api/entradas', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!respDespesas.ok || !respEntradas.ok) {
                throw new Error('Erro ao carregar dados');
            }

            const dadosDespesas = await respDespesas.json();
            const dadosEntradas = await respEntradas.json();
            setDespesas(dadosDespesas);
            setEntradas(dadosEntradas);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados: ' + error.message);
        }
    };

    const handleSalvarDespesa = async (novaDespesa) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = despesaEditando 
                ? await fetch(`http://localhost:5012/api/gastos/${despesaEditando.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(novaDespesa)
                })
                : await fetch('http://localhost:5012/api/gastos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(novaDespesa)
                });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao salvar:', errorData);
                throw new Error(errorData.message || 'Erro ao salvar despesa');
            }

            const data = await response.json();
            console.log('Resposta do servidor:', data);
            
            setModalDespesaAberto(false);
            setDespesaEditando(null);
            carregarDados();
        } catch (error) {
            console.error('Erro ao salvar despesa:', error);
            alert('Erro ao salvar despesa: ' + error.message);
        }
    };

    const handleSalvarEntrada = async (novaEntrada) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = despesaEditando 
                ? await fetch(`http://localhost:5012/api/entradas/${despesaEditando.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(novaEntrada)
                })
                : await fetch('http://localhost:5012/api/entradas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(novaEntrada)
                });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao salvar:', errorData);
                throw new Error(errorData.message || 'Erro ao salvar entrada');
            }

            const data = await response.json();
            console.log('Resposta do servidor:', data);
            
            setModalEntradaAberto(false);
            setDespesaEditando(null);
            carregarDados();
        } catch (error) {
            console.error('Erro ao salvar entrada:', error);
            alert('Erro ao salvar entrada: ' + error.message);
        }
    };

    const handleEditDespesa = (despesa) => {
        setDespesaEditando(despesa);
        setModalDespesaAberto(true);
    };

    const handleEditEntrada = (entrada) => {
        setDespesaEditando(entrada);
        setModalEntradaAberto(true);
    };

    const verificarDespesaExistente = async (id) => {
        const token = localStorage.getItem('userToken');
        const response = await fetch(`http://localhost:5012/api/gastos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok; // Retorna true se a despesa existir
    };

    const handleDelete = async (id, tipo) => {
        const token = localStorage.getItem('userToken');
        const url = tipo === 'despesa' ? `http://localhost:5012/api/gastos/${id}` : `http://localhost:5012/api/entradas/${id}`;
        
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ao excluir: ' + errorText);
            }

            carregarDados(); // Recarrega os dados após a exclusão
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir: ' + error.message);
        }
    };

    // Combina despesas e entradas em uma única lista e ordena por data
    const listaCompleta = [
        ...despesas.map(d => ({ ...d, tipo: 'despesa' })),
        ...entradas.map(e => ({ ...e, tipo: 'entrada' }))
    ].sort((a, b) => new Date(a.data) - new Date(b.data));

    // Filtra a lista com base no filtro selecionado
    const listaFiltrada = listaCompleta.filter(item => {
        if (filtro === 'despesas') return item.tipo === 'despesa';
        if (filtro === 'entradas') return item.tipo === 'entrada';
        return true; // Retorna todos se o filtro for 'todos'
    });

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

                {/* Filtros */}
                <div className="filtro-container">
                    <button onClick={() => setFiltro('todos')} className="filtro-button">Todos</button>
                    <button onClick={() => setFiltro('despesas')} className="filtro-button">Despesas</button>
                    <button onClick={() => setFiltro('entradas')} className="filtro-button">Entradas</button>
                </div>

                <Lista 
                    rows={listaFiltrada} 
                    onEdit={handleEditDespesa} 
                    onDelete={handleDelete} 
                />
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