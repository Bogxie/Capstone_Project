import { db } from "../config/db.js";
import { bookings } from "../models/schema.js";
import { eq, desc } from "drizzle-orm";

const formatBookingId = (id) => {
    return `BK-${String(id).padStart(6, '0')}`;
}

const calculateTotals = (rentalFee, deliveryFee) => {
    const subtotal = (Number(rentalFee) || 0) + (Number(deliveryFee) || 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    return { subtotal, tax, total };
};

const emitBookingsChanged = (req, payload) => {
    const io = req.app.get('io');
    if (io) {
        io.emit('bookings-changed', payload);
    } else {
        console.warn('⚠️ io not found on app instance — skipping real-time broadcast');
    }
};
export const getAllBookings = async (req, res) => {
    try {
        const allBookings = await db
            .select()
            .from(bookings)
            .orderBy(desc(bookings.created_at));

        const currentUser = req.user;
        const isAdmin = currentUser?.user_role === 'Admin';

        const formatted = allBookings.map(booking => {
            let timeStart = '';
            let timeStartAmPm = '';
            let timeEnd = '';
            let timeEndAmPm = '';

            if (booking.time_start) {
                const parts = booking.time_start.split(' ');
                timeStart = parts[0] || '';
                timeStartAmPm = parts[1] || '';
            }
            if (booking.time_end) {
                const parts = booking.time_end.split(' ');
                timeEnd = parts[0] || '';
                timeEndAmPm = parts[1] || '';
            }

            const isOwner = currentUser && booking.user_id === currentUser.user_id;

            if (isAdmin || isOwner) {
                return {
                    ...booking,
                    bookID: `BK-${String(booking.booking_id).padStart(6, '0')}`,
                    display_id: `BK-${String(booking.booking_id).padStart(6, '0')}`,
                    timeStart,
                    timeStartAmPm,
                    timeEnd,
                    timeEndAmPm,
                    date: booking.day,
                    day: booking.day,
                };
            }

            return {
                booking_id: booking.booking_id,
                service: booking.service,
                status: booking.status,
                booking_date: booking.booking_date,
                month: booking.month,
                day: booking.day,
                year: booking.year,
                date: booking.day,
            };
        });

        res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch bookings"
        });
    }
};

export const createBooking = async (req, res) => {
    try {
        const data = req.body;

        const required = [
            'fullName', 'email', 'phoneNum', 'service', 'serviceType',
            'packageName', 'rentalFee', 'municipality', 'deliveryFee',
            'venue', 'lat', 'lng', 'paymentMethod'
        ];

        for (const field of required) {
            if (!data[field]) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        const { subtotal, tax, total } = calculateTotals(
            data.rentalFee,
            data.deliveryFee
        );

        const result = await db.insert(bookings).values({
            full_name: data.fullName,
            email: data.email,
            phone_num: data.phoneNum,
            service: data.service,
            service_type: data.serviceType,
            package_name: data.packageName,
            rental_fee: data.rentalFee,
            municipality: data.municipality,
            delivery_fee: data.deliveryFee,
            venue: data.venue,
            lat: data.lat,
            lng: data.lng,
            description: data.description || null,
            status: 'Pending',
            payment_method: data.paymentMethod,
            downpayment: data.downpayment || 1000,
            total: total,
            subtotal: subtotal,
            tax: tax,
            time_start: data.timeStart && data.timeStartAmPm
                ? `${data.timeStart} ${data.timeStartAmPm}`
                : null,
            time_end: data.timeEnd && data.timeEndAmPm
                ? `${data.timeEnd} ${data.timeEndAmPm}`
                : null,
            booking_date: `${data.year}-${data.month}-${data.date}`,
            month: data.month,
            day: data.date,
            year: data.year,
            user_id: data.user_id || null,
        }).returning({ booking_id: bookings.booking_id });

        const bookingId = result[0]?.booking_id;

        emitBookingsChanged(req, {
            type: 'created',
            bookingId,
            service: data.service,
            date: `${data.year}-${data.month}-${data.date}`,
        });

        res.status(201).json({
            success: true,
            bookingId: bookingId,
            displayId: formatBookingId(bookingId),
            total: total,
            subtotal: subtotal,
            tax: tax,
            message: "Booking created successfully"
        });

    } catch (err) {
        // ✅ 23505 = PostgreSQL unique constraint violation
        if (err.code === '23505' && err.constraint === 'idx_bookings_active_unique') {
            return res.status(409).json({
                success: false,
                error: "This slot has already been booked. Please choose another date or service."
            });
        }

        console.error("Error creating booking:", err);
        res.status(500).json({
            success: false,
            error: "Failed to create booking",
            details: err.message
        });
    }
}

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const result = await db
            .update(bookings)
            .set({
                status: status,
                updated_at: new Date()
            })
            .where(eq(bookings.booking_id, id))
            .returning();

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Booking not found"
            });
        }

        const updated = result[0];

        emitBookingsChanged(req, {
            type: 'status-updated',
            bookingId: updated.booking_id,
            status: updated.status,
        });

        res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            data: {
                ...updated,
                display_id: formatBookingId(updated.booking_id)
            }
        });
    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({
            success: false,
            error: "Failed to update booking"
        });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // ✅ Check if booking exists
        const existing = await db
            .select()
            .from(bookings)
            .where(eq(bookings.booking_id, id));

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Booking not found"
            });
        }

        // ✅ Get current values
        const current = existing[0];
        const rentalFee = data.rentalFee || data.rental_fee || current.rental_fee;
        const deliveryFee = data.deliveryFee || data.delivery_fee || current.delivery_fee;

        // ✅ Recalculate totals
        const { subtotal, tax, total } = calculateTotals(rentalFee, deliveryFee);

        // ✅ Update with recalculated values
        const result = await db
            .update(bookings)
            .set({
                full_name: data.fullName || data.full_name || current.full_name,
                email: data.email || current.email,
                phone_num: data.phoneNum || data.phone_num || current.phone_num,
                venue: data.venue || current.venue,
                lat: data.lat || current.lat,
                lng: data.lng || current.lng,
                municipality: data.municipality || current.municipality,
                delivery_fee: deliveryFee,
                description: data.description || current.description,
                rental_fee: rentalFee,
                subtotal: subtotal,
                tax: tax,
                total: total,
                time_start: data.timeStart && data.timeStartAmPm
                    ? `${data.timeStart} ${data.timeStartAmPm}`
                    : data.time_start || current.time_start,
                time_end: data.timeEnd && data.timeEndAmPm
                    ? `${data.timeEnd} ${data.timeEndAmPm}`
                    : data.time_end || current.time_end,
                updated_at: new Date()
            })
            .where(eq(bookings.booking_id, id))
            .returning();

        // ✅ Format response
        const updated = result[0];
        const formatted = {
            ...updated,
            bookID: formatBookingId(updated.booking_id),
            display_id: formatBookingId(updated.booking_id),
            timeStart: updated.time_start ? updated.time_start.split(' ')[0] : '',
            timeStartAmPm: updated.time_start ? updated.time_start.split(' ')[1] : '',
            timeEnd: updated.time_end ? updated.time_end.split(' ')[0] : '',
            timeEndAmPm: updated.time_end ? updated.time_end.split(' ')[1] : '',
        };

        // ✅ Broadcast update sa lahat ng clients
        emitBookingsChanged(req, {
            type: 'updated',
            bookingId: updated.booking_id,
        });

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: formatted
        });

    } catch (err) {
        console.error("Error updating booking:", err);
        res.status(500).json({
            success: false,
            error: "Failed to update booking",
            details: err.message
        });
    }
};