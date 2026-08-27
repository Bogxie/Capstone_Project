import { 
    tempBookings, 
    EXPIRY_TIME,
    getTempBookings,
    isSlotAvailable,
    getSlotBooking,
    clearUserBookings,
    autoCleanupExpired
} from './sharedState.js';

export const initBookingSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`📅 Booking socket connected: ${socket.id}`);

        // Send current temp bookings to new client
        socket.on("get-active-bookings", (callback) => {
            const bookings = getTempBookings().map(([key, data]) => ({
                key,
                userId: data.userId,
                timestamp: data.timestamp
            }));
            if (callback) callback(bookings);
            else socket.emit("active-temp-bookings", bookings);
        });

        // Check availability
        socket.on("check-availability", ({ date, service }, callback) => {
            // ✅ kailangan naka-login
            if (!socket.user) {
                callback({ available: false, message: "Please log in to book." });
                return;
            }

            const dateKey = `${date}-${service}`;
            const userIdStr = String(socket.user.user_id); // ✅ galing sa verified token, hindi sa payload

            console.log(`🔍 Checking availability: ${dateKey} for user ${userIdStr}`);

            if (!isSlotAvailable(dateKey)) {
                const existingBooking = getSlotBooking(dateKey);
                
                if (String(existingBooking.userId) === userIdStr) {
                    callback({ available: true, existing: true });
                    return;
                }
                
                callback({ 
                    available: false, 
                    message: `${service} is currently being booked by another user.` 
                });

                io.to(existingBooking.socketId).emit("booking-conflict", {
                    date,
                    service,
                    message: "Another user is trying to book this slot. Please complete your booking quickly!"
                });
            } else {
                tempBookings.set(dateKey, {
                    userId: userIdStr,
                    socketId: socket.id,
                    date,
                    service,
                    timestamp: Date.now()
                });

                console.log(`✅ Reserved: ${dateKey} for user ${userIdStr}`);
                
                io.emit("slot-reserved", { 
                    date, 
                    service, 
                    userId: userIdStr,
                    timestamp: Date.now()
                });

                callback({ available: true });
            }
        });

        // Get available services for a date
        socket.on("get-available-services", ({ date, allServices }, callback) => {
            const available = allServices.filter(service => {
                const key = `${date}-${service}`;
                return isSlotAvailable(key);
            });
            callback({ available });
        });

        // Check date conflicts
        socket.on("check-date-conflicts", ({ date, allServices }, callback) => {
            const conflicts = allServices.filter(service => {
                const key = `${date}-${service}`;
                return !isSlotAvailable(key);
            });
            callback({ 
                hasConflicts: conflicts.length > 0,
                conflictingServices: conflicts 
            });
        });

        // Booking confirmed
        socket.on("booking-confirmed", ({ date, service }) => {
            if (!socket.user) return; // ✅ walang effect kung hindi naka-login

            const dateKey = `${date}-${service}`;
            const userIdStr = String(socket.user.user_id); // ✅ verified
            const booking = getSlotBooking(dateKey);
            
            if (booking && String(booking.userId) === userIdStr) {
                tempBookings.delete(dateKey);
                console.log(`✅ Booking confirmed and removed from temp: ${dateKey}`);
                io.emit("slot-confirmed", { date, service, userId: userIdStr });
            }
        });

        // Booking cancelled
        socket.on("booking-cancelled", ({ date, service }) => {
            if (!socket.user) return; // ✅ walang effect kung hindi naka-login

            const dateKey = `${date}-${service}`;
            const userIdStr = String(socket.user.user_id); // ✅ verified
            const booking = getSlotBooking(dateKey);
            
            if (booking && String(booking.userId) === userIdStr) {
                tempBookings.delete(dateKey);
                console.log(`❌ Booking cancelled and released: ${dateKey}`);
                io.emit("slot-released", { date, service });
            }
        });

        // Admin force release
        socket.on("admin-release-slot", ({ date, service }) => {
            // ✅ kailangan Admin role
            if (!socket.user || socket.user.user_role !== 'Admin') {
                socket.emit("error", { message: "Unauthorized" });
                console.log(`🚫 Unauthorized admin-release-slot attempt from ${socket.id}`);
                return;
            }

            const dateKey = `${date}-${service}`;
            if (!isSlotAvailable(dateKey)) {
                tempBookings.delete(dateKey);
                io.emit("slot-released", { date, service, releasedBy: "admin" });
                console.log(`👑 Admin released slot: ${dateKey}`);
            }
        });

        // Get all temp bookings (for admin)
        socket.on("get-all-temp-bookings", (callback) => {
            const bookings = getTempBookings().map(([key, data]) => ({
                key,
                ...data,
                timeRemaining: Math.max(0, Math.floor((EXPIRY_TIME - (Date.now() - data.timestamp)) / 1000))
            }));
            callback(bookings);
        });

        // Handle disconnect - cleanup booking only
        socket.on("disconnect", () => {
            console.log(`📅 Booking socket disconnected: ${socket.id}`);
            
            // ✅ Booking cleanup only
            const released = clearUserBookings(socket.id);
            released.forEach(({ date, service }) => {
                io.emit("slot-released", { date, service });
                console.log(`🧹 Cleaned up booking: ${date}-${service}`);
            });
        });
    });

    // Auto-cleanup expired bookings every 30 seconds
    setInterval(() => {
        const expired = autoCleanupExpired();
        if (expired.length > 0) {
            console.log(`🧹 Auto-cleaned ${expired.length} expired bookings`);
            expired.forEach(({ date, service }) => {
                io.emit("slot-released", { date, service });
            });
        }
    }, 30000);

    const logTempBookings = () => {
        const bookings = getTempBookings();
        for (const [key, data] of bookings) {
            const age = Math.floor((Date.now() - data.timestamp) / 1000);
            console.log(`   ${key} - User: ${data.userId} - Age: ${age}s`);
        }
    };

    io._tempBookings = tempBookings;
    io._logTempBookings = logTempBookings;
};