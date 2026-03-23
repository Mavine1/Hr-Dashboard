import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.user);
        } catch (error) {
            console.error('Fetch user error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setToken(data.token);
            setUser(data);
            toast.success('Login successful!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setToken(data.token);
            setUser(data);
            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const googleLogin = async (credentialResponse) => {
        try {
            const { data } = await api.post('/auth/google', { tokenId: credentialResponse.credential });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setToken(data.token);
            setUser(data);
            toast.success('Google login successful!');
            return { success: true };
        } catch (error) {
            toast.error('Google login failed');
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/login';
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await api.put('/auth/me', profileData);
            setUser(data.user);
            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            return { success: false };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager' || user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

