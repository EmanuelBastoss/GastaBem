import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Navbar from '../Navbar/Navbar';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [despesas, setDespesas] = useState([]); // Agora 'despesas' armazenará todos os lançamentos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cores para o gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Função para agrupar despesas por categoria (adaptada para todos os lançamentos)
  const getDespesasPorCategoria = () => {
    const grouped = despesas.reduce((acc, lancamento) => {
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

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      console.log('Token:', token);

      // Busca os dados da nova rota /api/lancamentos
      const response = await fetch('http://localhost:5012/api/lancamentos', { 
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      setDespesas(data); // Armazena todos os lançamentos em 'despesas'
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
                        <p>Nenhuma despesa encontrada.</p>
                        <button onClick={handleAddGasto} className="add-button">
                            Adicionar Primeira Despesa
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Gráfico de Pizza */}
                        <div className="chart-container">
    <h2>Distribuição de Gastos por Categoria</h2>
    <PieChart width={600} height={400}>
        <Pie
            data={getDespesasPorCategoria()}
            cx="50%"
            cy="50%"
            labelLine={true} // Habilita a linha do label
            outerRadius={130} // Reduz um pouco o raio para dar espaço aos labels
            fill="#8884d8"
            dataKey="value"
            label={({ percent }) => { // Customiza o label
                return `${(percent * 100).toFixed(0)}%`;
            }}
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
            layout="vertical" // Coloca a legenda na vertical
            align="right" // Alinha à direita
            verticalAlign="middle" // Alinha verticalmente ao meio
            wrapperStyle={{ paddingLeft: '20px' }} // Adiciona espaço à esquerda da legenda
        />
    </PieChart>
    
</div>

                        {/* Lista de despesas existente */}
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
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;