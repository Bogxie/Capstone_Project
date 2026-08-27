import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "./UserContext";
import { API_URL } from "./API_URL";
import axios from "axios";

const userKeys = [{ all: 'users'}];

export const UserProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: users = [], isLoading: loading, refetch } = useQuery({
        queryKey: userKeys.all,
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await axios.get(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            return response.data || [];
        },
        staleTime: 60 * 1000,
    });

    const createMutation = useMutation({
        mutationFn: async (userData) => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/users`, userData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.data.success) throw new Error('Create failed');
            return response.data.user;
        },
        onSuccess: (newUser) => {
            queryClient.setQueryData(userKeys.all, (old = []) => [...old, newUser]);
        },
        onError: (err) => {
            console.error('Error creating user:', err);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, userData }) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/users/${id}`, userData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.data.success) throw new Error('Update failed');
            return response.data.user;
        },
        onSuccess: (updatedUser, variables) => {
            queryClient.setQueryData(userKeys.all, (old = []) =>
                old.map(user => user.id === variables.id ? { ...user, ...updatedUser } : user)
            );
        },
        onError: (err) => {
            console.error('Error updating user:', err);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.data.success) throw new Error('Delete failed');
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData(userKeys.all, (old = []) =>
                old.filter(user => user.id !== deletedId)
            );
        },
        onError: (err) => {
            console.error('Error deleting user:', err);
        },
    });

    const createUser = (userData) => createMutation.mutateAsync(userData);
    const updateUser = (id, userData) => updateMutation.mutateAsync({ id, userData });
    const deleteUser = (id) => deleteMutation.mutateAsync(id);
    const refreshUsers = () => refetch();

    return (
        <UserContext.Provider value={{ users, loading, createUser, updateUser, deleteUser, refreshUsers}}>
            {children}
        </UserContext.Provider>
    )
}
