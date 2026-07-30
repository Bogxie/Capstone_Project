// context/BookingProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { BookingContext } from "./BookingContext";
import axios from "axios";
import { socket } from "../services/socket"; // ✅ same singleton na ginagamit sa Calendar/Chat
import { useAuth } from "./useAuth.js"; // ✅ para malaman kung nag-login/logout na ang user

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth(); // ✅ babantayan natin 'to

    // ✅ Use useCallback para maging stable ang function
    const fetchBookings = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('⚠️ No token found, skipping fetch');
                setLoading(false);
                return [];
            }

            const response = await axios.get('http://localhost:3001/api/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setBookings(response.data.data);
                console.log('📦 Bookings loaded:', response.data.count);
                return response.data.data;
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);  // ✅ Empty dependency - stable

    // ✅ ✅ ✅ Tumatakbo ulit 'to tuwing magbabago ang currentUser —
    // ibig sabihin, pag nag-login (walang laman -> may user) o
    // nag-logout (may user -> null) o nag-switch ng account.
    // Dati, minsan lang 'to tumatakbo sa mount, kaya blangko pa rin
    // ang bookings hangga't hindi mo re-reload ang buong page.
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings, currentUser]);

    // ✅ Use useCallback para maging stable ang function
    const refreshBookings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchBookings();
            return data;
        } finally {
            setLoading(false);
        }
    }, [fetchBookings]);  // ✅ Depends on stable fetchBookings

    // ✅ ✅ ✅ REAL-TIME LISTENER — nakikinig sa broadcast ng backend
    // tuwing may bagong booking o update (create/status/edit), kahit
    // ibang user o admin ang gumawa nito, mare-refresh ang bookings
    // list ng lahat ng connected clients na gumagamit ng context na 'to
    // (Calendar, AdminPage, UserPage) nang walang manual reload.
    useEffect(() => {
        const onBookingsChanged = (payload) => {
            console.log('🔄 bookings-changed event received:', payload);
            refreshBookings();
        };

        socket.on('bookings-changed', onBookingsChanged);

        return () => {
            socket.off('bookings-changed', onBookingsChanged);
        };
    }, [refreshBookings]);

    // ✅ Use useCallback para maging stable ang function
    const addBooking = useCallback((bookingData) => {
        setBookings(prev => [...prev, bookingData]);
        return bookingData;
    }, []);  // ✅ Empty dependency - stable

    // ✅ Use useCallback para maging stable ang function
    const updateBooking = useCallback(async (id, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            console.log('🔄 updateBooking:', { id, updatedData });

            const isStatusOnly = updatedData.status && Object.keys(updatedData).length === 1;

            if (isStatusOnly) {
                const response = await axios.put(
                    `http://localhost:3001/api/bookings/${id}/status`,
                    { status: updatedData.status },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setBookings(prev =>
                        prev.map(booking =>
                            booking.booking_id === id || booking.booking_id === Number(id)
                                ? { ...booking, status: updatedData.status }
                                : booking
                        )
                    );
                    return response.data.data;
                }
            } else {
                const response = await axios.put(
                    `http://localhost:3001/api/bookings/${id}`,
                    updatedData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setBookings(prev =>
                        prev.map(booking =>
                            booking.booking_id === id || booking.booking_id === Number(id)
                                ? { ...booking, ...response.data.data }
                                : booking
                        )
                    );
                    return response.data.data;
                }
            }
        } catch (err) {
            console.error('❌ Error updating booking:', err);
            console.error('❌ Error response:', err.response?.data);
            throw err;
        }
    }, []);  // ✅ Empty dependency - stable

    return (
        <BookingContext.Provider value={{
            bookings,
            loading,
            addBooking,
            updateBooking,
            refreshBookings
        }}>
            {children}
        </BookingContext.Provider>
    );
};