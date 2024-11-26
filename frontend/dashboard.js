import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/some_protected_route'); // Rota protegida no backend
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                // Trate o erro, ex: redirecionar para login
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* Renderize os dados */}
        </div>
    );
}

export default Dashboard;
