import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';
import Navbar from '../Navbar/Navbar';
import Lista from '../Lista/Lista';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [despesas, setDespesas] = useState([]); // Agora 'despesas' armazenará todos os lançamentos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cores para o gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Função para agrupar despesas por categoria (adaptada para todos os lançamentos)
  const getDespesasPorCategoria = () => {
    // Filtra apenas as despesas (saídas)
    const despesasApenas = despesas.filter(lancamento => lancamento.tipo === 'saida');
    
    const grouped = despesasApenas.reduce((acc, lancamento) => {
      const categoria = lancamento.categoria;
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += Number(lancamento.valor); 
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  };

  // Função para preparar dados do LineChart
  const getLineChartData = () => {
    const dadosPorData = despesas.reduce((acc, lancamento) => {
      const data = new Date(lancamento.data).toLocaleDateString();
      if (!acc[data]) {
        acc[data] = { name: data, entradas: 0, saidas: 0 };
      }
      if (lancamento.tipo === 'entrada') {
        acc[data].entradas += Number(lancamento.valor);
      } else {
        acc[data].saidas += Number(lancamento.valor);
      }
      return acc;
    }, {});

    return Object.values(dadosPorData).sort((a, b) => 
      new Date(a.name) - new Date(b.name)
    );
  };

  const calcularTotais = () => {
    const totais = despesas.reduce((acc, lancamento) => {
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

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch(`${API_URL}/lancamentos`, { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
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
                        Novo Lançamento
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Carregando dados...</div>
                ) : error ? (
                    <div className="error">Erro ao carregar dados: {error}</div>
                ) : despesas.length === 0 ? (
                    <div className="no-data">
                        <p>Nenhum lançamento encontrado.</p>
                        <button onClick={handleAddGasto} className="add-button">
                            Adicionar Primeiro Lançamento
                        </button>
                    </div>
                ) : (
                    <>
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

                        <div className="charts-container">
                            {/* Gráfico de Linha */}
                            <div className="chart-container">
                                <h2>Fluxo de Caixa</h2>
                                <LineChart width={600} height={300} data={getLineChartData()}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="entradas" stroke="#00C49F" />
                                    <Line type="monotone" dataKey="saidas" stroke="#FF8042" />
                                </LineChart>
                            </div>

                            {/* Gráfico de Pizza existente */}
                            <div className="chart-container">
                                <h2>Distribuição de Despesas por Categoria</h2>
                                <PieChart width={500} height={300}>
                                    <Pie
                                        data={getDespesasPorCategoria()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={false}
                                    >
                                        {getDespesasPorCategoria().map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `R$ ${value.toFixed(2)}`}
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '4px' }}
                                    />
                                    <Legend 
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        formatter={(value, entry, index) => {
                                            const total = getDespesasPorCategoria().reduce((sum, item) => sum + item.value, 0);
                                            const percent = ((entry.payload.value / total) * 100).toFixed(0);
                                            return `${value} (${percent}%)`;
                                        }}
                                        wrapperStyle={{ 
                                            paddingLeft: '20px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </PieChart>
                            </div>
                        </div>

                        {/* Lista de lançamentos */}
                        <div className="lista-container">
                            <h2>Histórico de Lançamentos</h2>
                            <Lista rows={despesas} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;