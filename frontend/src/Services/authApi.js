import api from './api';

export const registerUser = async (userData) => {
    const response = await api.post('/app/register', userData);
    return response.data;

}

export const checkEmailExists = async (email) => {
    try {
        const response = await api.post('/app/check-email', { email });
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
        const response = await api.post('/app/access', userData);
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
    const response = await api.post('/app/logout');
    return response.data;
}


export const getUserProfile = async () => {
    const response = await api.get('/app/profile');
    return response.data;
}

export const sendVerificationEmail = async () => {
    const response = await api.post('/app/send-verification-email');
    return response.data;
}

export const verifyEmailToken = async ({ email, token }) => {
    const response = await api.post('/app/verify-email-token', { email, token });
    return response.data;
}

export const resendVerificationEmail = async (email) => {
    const response = await api.post('/app/resend-verification-email', { email });
    return response.data;
}

export const updateUserName = async ({ name }) => {

    const response = await api.put('/app/update-name', { name });
    return response.data;

}

export const updateUserPassword = async ({ currentPassword, newPassword }) => {
    const response = await api.put('/app/update-password', { currentPassword, newPassword });
    return response.data;
}

export const confirmResetPassword = async ({ email, token, newPassword }) => {
    const response = await api.post('/app/reset-password', { email, token, newPassword });
    return response.data;
}

export const requestPasswordReset = async (email) => {
    const response = await api.post('/app/forgot-password', { email });
    return response.data;
}