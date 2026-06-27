import { useState } from "react";
import { BookingContext } from "./BookingContext";

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);

    const addBooking = (newBooking) => {
        const lastID = bookings.length ? Number(bookings[bookings.length - 1].bookID.split('-')[1]) : 1000;
        const withID = { ...newBooking, bookID: `BK-${lastID + 1}` };
        setBookings(prev => [...prev, withID]);
        return withID;
    };

    const updateBooking = (id, updateBookings) => {
        setBookings(prev =>
            prev.map(booking =>
                booking.bookID === id ? { ...booking, ...updateBookings } : booking
            )
        );
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateBooking }}>
            {children}
        </BookingContext.Provider>
    )

}