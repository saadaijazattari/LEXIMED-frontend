/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Load user on initial mount
    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Set auth token in axios headers
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['x-auth-token'] = token;
        } else {
            delete api.defaults.headers.common['x-auth-token'];
        }
    }, [token]);

    // Load user from token
    const loadUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error loading user:', error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
                const { token, user } = response.data;
                
                // Save token
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                
                return { 
                    success: true, 
                    role: user.role 
                };
            }
            
            return { 
                success: false, 
                error: 'Login failed' 
            };
            
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed. Please try again.' 
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            
            if (response.data.success) {
                const { token, user } = response.data;
                
                // Save token
                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                
                return { 
                    success: true, 
                    role: user.role 
                };
            }
            
            return { 
                success: false, 
                error: 'Registration failed' 
            };
            
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed. Please try again.' 
            };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['x-auth-token'];
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user?.role === role;
    };

    // Check if user has any of the given roles
    const hasAnyRole = (roles) => {
        return roles.includes(user?.role);
    };

    // Value object to provide
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        isAuthenticated: !!user,
        role: user?.role,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
