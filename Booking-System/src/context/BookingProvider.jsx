import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { BookingContext } from "./BookingContext";
import { socket } from "../services/socket";
import { useAuth } from "./useAuth.js";
import { API_URL } from "./API_URL.js";
import axios from "axios";

const bookingKeys = { all: ['bookings'] };

export const BookingProvider = ({ children }) => {

    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading: loading, refetch } = useQuery({
        queryKey: bookingKeys.all,
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) return [];

            const response = await axios.get(`${API_URL}/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            return response.data.success ? response.data.data : [];
        },
    });

    useEffect(() => {
        refetch();
    }, [currentUser, refetch]);

    useEffect(() => {
        const onBookingsChanged = (payload) => {
            console.log('🔄 bookings-changed event received:', payload);
            queryClient.invalidateQueries({ queryKey: bookingKeys.all });
        }
        socket.on('bookings-changed', onBookingsChanged);
        return () => socket.off('bookings-changed', onBookingsChanged);
    }, [queryClient]);

    const createMutation = useMutation({
        mutationFn: async (bookingData) => {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/bookings`, bookingData, { headers: { 'Authorization': `Bearer ${token}` } });

            if (!response.data.success) throw new Error('Booking creation Failed');

            return {
                ...bookingData,
                booking_id: response.data.bookingId,
                display_id: response.data.displayId,
                total: response.data.total,
                subtotal: response.data.subtotal,
                tax: response.data.tax,
                status: 'Pending'
            };

        },
        onSuccess: (newBooking) => {
            queryClient.setQueryData(bookingKeys.all, (old = []) => [...old, newBooking]);
        },
        onError: (err) => {
            console.error('Error create Booking: ', err);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            const token = localStorage.getItem('token');
            const isStatusOnly = updatedData.status && Object.keys(updatedData).length === 1;

            const response = isStatusOnly
                ? await axios.put(`${API_URL}/bookings/${id}/status`,
                    { status: updatedData.status },
                    { headers: { 'Authorization': `Bearer ${token}` } })
                : await axios.put(`${API_URL}/bookings/${id}`,
                    updatedData,
                    { headers: { 'Authorization': `Bearer ${token}` } });

            if (!response.data.success) throw new Error('Update failed');
            return response.data.data;
        },
        onSuccess: (updatedBooking) => {
            queryClient.setQueryData(bookingKeys.all, (old = []) =>
                old.map(b => b.booking_id === updatedBooking.booking_id ? updatedBooking : b)
            );
        },
        onError: (err) => {
            console.error('❌ Error updating booking:', err);
            console.error('❌ Error response:', err.response?.data);
        },
    });


    const createBooking = (bookingData) => createMutation.mutateAsync(bookingData);

    const updateBooking = (id, updatedData) => updateMutation.mutateAsync({ id, updatedData });

    const refreshBookings = () => refetch();

    return (
        <BookingContext.Provider value={{
            bookings,
            loading,
            createBooking,
            updateBooking,
            refreshBookings
        }}>
            {children}
        </BookingContext.Provider>
    );
};  