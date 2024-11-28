import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Despesas from './components/Despesas/Despesas';
import Senha from './components/Senha/Senha.jsx';
import Teste from './components/Teste/Teste.jsx';



// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/senha" element={<Senha />} />

                {/* Rotas protegidas */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/despesas" element={
                    <ProtectedRoute>
                        <Despesas />
                    </ProtectedRoute>
                } />

                {/* Redireciona qualquer rota não encontrada para o Dashboard */}
                <Route path="*" element={
                    <ProtectedRoute>
                        <Navigate to="/dashboard" replace />
                    </ProtectedRoute>
                } />

                {/* Rotas adicionais */}    
                <Route path='/teste' element={<Teste />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
