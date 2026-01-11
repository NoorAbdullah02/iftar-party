import api from './api';

export const registerUser = async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;

}

export const checkEmailExists = async (email) => {
    try {
        const response = await api.post('/users/check-email', { email });
        return response.data.exists;
    } catch (err) {
        if (err.response?.status === 409) {
            return true;
        }
        throw err;
    }
}

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/users/login', userData);
        return response.data;
    } catch (err) {
        if (err?.response?.data) {
            const message = err.response.data.message || 'Login failed';
            const error = new Error(message);
            error.response = err.response;
            throw error;
        }
        throw err;
    }
}

export const logoutUser = async () => {
    const response = await api.post('/users/logout');
    return response.data;
}