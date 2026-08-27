import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getAllBookings, createBooking, updateBookingStatus, updateBooking} from "../controllers/bookingsController.js";

export const router = express.Router()

router.get('/bookings', authenticate, getAllBookings);
router.post('/bookings', authenticate, createBooking );
router.put('/bookings/:id/status', authenticate, updateBookingStatus);
router.put('/bookings/:id/', authenticate, updateBooking);





