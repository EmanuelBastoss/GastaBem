import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000' // URL da sua API
});

// Adiciona um interceptor para incluir o token JWT no header Authorization
api.interceptors.request.use(config => {
    const token = localStorage.getItem('userToken'); // Nome correto do token no localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;

