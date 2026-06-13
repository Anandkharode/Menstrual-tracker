
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const apiFunctions = {
    login: async (payload) => {
        const response = await api.post('/users/login', payload);
        return response.data;
    },
    register: async (payload) => {
        const response = await api.post('/users/register', payload);
        return response.data;
    },
    getPredictions: async () => {
        const response = await api.get('/predictions/me');
        return response.data;
    },
    postCycle: async (payload) => {
        const response = await api.post('/cycles', payload);
        return response.data;
    },
    getCycles: async () => {
        const response = await api.get('/cycles');
        return response.data;
    },
    deleteCycle: async (id) => {
        const response = await api.delete(`/cycles/${id}`);
        return response.data;
    },
    postSymptoms: async (payload) => {
        const response = await api.post('/symptoms', payload);
        return response.data;
    },
    chatMessage: async (payload) => {
        const response = await api.post('/chat/message', payload);
        return response.data;
    },
    mlHealth: async () => {
        const response = await api.get('/chat/health');
        return response.data;
    },
    getChatHistory: async () => {
        const response = await api.get('/chat/history');
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
    updateProfile: async (payload) => {
        const response = await api.put('/users/profile', payload);
        return response.data;
    },
    getHealthProfile: async () => {
        const response = await api.get('/chat/health-profile');
        return response.data;
    },
};

export default apiFunctions;
