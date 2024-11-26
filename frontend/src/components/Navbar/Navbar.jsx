import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">GastaBem</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                <Link to="/despesas" className="navbar-item">Despesas</Link>
                <button onClick={handleLogout} className="navbar-item logout-button">
                    Sair
                </button>
            </div>
        </nav>
    );
}

export default Navbar; 