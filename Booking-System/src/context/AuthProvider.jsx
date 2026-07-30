import { useState, useEffect, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import AdminProfile from '../assets/Images/lime_rbg2.png';
import axios from "axios";

const API_URL = 'http://localhost:3001/api';

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [showSignIn, setShowSignIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const userWithRole = useMemo(() => {
        if (!currentUser) return null;
        return {
            ...currentUser,
            role: currentUser.user_role || currentUser.role || 'User'
        };
    }, [currentUser]);

    const fetchCurrentUser = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setCurrentUser({
                    ...response.data.user,
                    role: response.data.user.user_role,
                    profile: AdminProfile
                });
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Fetch user error:', error);
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        const checkAuth = async () => {
            if (token) {
                await fetchCurrentUser(token);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setCurrentUser({
                    ...response.data.user,
                    profile: AdminProfile
                });
                console.log("Logged in user:", response.data.user);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async ({ email, password, username, role }) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                username,
                email,
                password,
                role: role || 'User'
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setCurrentUser({
                    ...response.data.user,
                    profile: AdminProfile
                });
                console.log("Registered user:", response.data.user);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Register error:', error.response?.data || error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{
            currentUser: userWithRole, login, register, logout, showSignIn, setShowSignIn, loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};