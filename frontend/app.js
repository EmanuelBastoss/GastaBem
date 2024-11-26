import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard'; // Componente para a rota protegida
import api from './services/api'; // Importe a instância do Axios

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} /> {/* Rota protegida */}
            </Routes>
        </Router>
    );
}

export default App;
