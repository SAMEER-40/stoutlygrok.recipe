import axios from 'axios';

const API_URL = 'https://stoutlygrok-recipe.onrender.com/api';

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth services
export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    addFavorite: async (recipe) => {
        const response = await api.post('/auth/favorites', recipe);
        return response.data;
    },

    removeFavorite: async (recipeId) => {
        const response = await api.delete(`/auth/favorites/${recipeId}`);
        return response.data;
    }
};

// Recipe services
export const recipeService = {
    search: async (params) => {
        const response = await api.get('/recipes', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    }
};

// Review services
export const reviewService = {
    getByRecipe: async (recipeId) => {
        const response = await api.get(`/reviews/${recipeId}`);
        return response.data;
    },

    add: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};

export default api;
