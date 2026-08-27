import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { API_URL } from './API_URL';
import { refreshSocketAuth } from '../services/socket.js';
import AdminProfile from '../assets/Images/lime_rbg2.png';
import axios from "axios";


const authKeys = {
    currentUser: ['currentUser'],
};

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const [showSignIn, setShowSignIn] = useState(false);

    const { data: currentUser, isLoading: checkingAuth } = useQuery({
        queryKey: authKeys.currentUser,
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) return null;

            try {
                const response = await axios.get(`${API_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    return {
                        ...response.data.user,
                        role: response.data.user.user_role,
                        profile: AdminProfile
                    };
                }
                localStorage.removeItem('token');
                return null;
            } catch (error) {
                console.error('Fetch user error:', error);
                localStorage.removeItem('token');
                return null;
            }
        },
        select: (user) => {
            if (!user) return null;
            return {
                ...user,
                role: user.user_role || user.role || 'User'
            };
        },
        staleTime: Infinity,
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (!response.data.success) throw new Error('Login failed');
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(authKeys.currentUser, {
                ...data.user,
                profile: AdminProfile
            });
            queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            refreshSocketAuth(data.token);
        },
        onError: (error) => {
            console.error('Login error:', error.response?.data || error.message);
        },
    });

    const registerMutation = useMutation({
        mutationFn: async ({ email, password, username, role }) => {
            const response = await axios.post(`${API_URL}/auth/register`, {
                username, email, password, role: role || 'User'
            });
            if (!response.data.success) throw new Error('Registration failed');
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(authKeys.currentUser, {
                ...data.user,
                profile: AdminProfile
            });
            queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            refreshSocketAuth(data.token);
        },
        onError: (error) => {
            console.error('Register error:', error.response?.data || error.message);
        },
    });

    const login = async (email, password) => {
        try {
            await loginMutation.mutateAsync({ email, password });
            return true;
        } catch {
            return false;
        }
    };

    const register = async ({ email, password, username, role }) => {
        try {
            await registerMutation.mutateAsync({ email, password, username, role });
            return true;
        } catch {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        queryClient.setQueryData(authKeys.currentUser, null);
        queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
        refreshSocketAuth(null);
    };

    const loading = checkingAuth || loginMutation.isPending || registerMutation.isPending;

    return (
        <AuthContext.Provider value={{
            currentUser,
            login,
            register,
            logout,
            showSignIn,
            setShowSignIn,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};