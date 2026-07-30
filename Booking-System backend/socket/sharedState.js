export const onlineUsers = new Map();
export const tempBookings = new Map();
export const EXPIRY_TIME = 5 * 60 * 1000;

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
export const getTempBookings = () => Array.from(tempBookings.entries());

export const isSlotAvailable = (dateKey) => !tempBookings.has(dateKey);
export const getSlotBooking = (dateKey) => tempBookings.get(dateKey);

export const clearUserBookings = (socketId) => {
    const released = [];
    for (const [key, booking] of tempBookings.entries()) {
        if (booking.socketId === socketId) {
            tempBookings.delete(key);
            const [date, service] = key.split('-');
            released.push({ date, service });
        }
    }
    return released;
};

export const autoCleanupExpired = () => {
    const now = Date.now();
    const expired = [];
    for (const [key, booking] of tempBookings.entries()) {
        if (now - booking.timestamp > EXPIRY_TIME) {
            tempBookings.delete(key);
            const [date, service] = key.split('-');
            expired.push({ date, service });
        }
    }
    return expired;
};