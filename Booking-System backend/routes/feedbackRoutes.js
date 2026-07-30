import express from 'express';
import { 
    createFeedback, 
    getFeedbackByBooking, 
    getAllFeedbacks, 
    updateFeedback, 
    deleteFeedback,
    getFeedbackStats,
    getFeedbacksByUser
} from '../controllers/feedbackControllers.js';

export const router = express.Router();

// Feedback CRUD
router.post('/feedback', createFeedback);
router.get('/feedback', getAllFeedbacks);
router.get('/feedback/booking/:bookingId', getFeedbackByBooking);
router.put('/feedback/:id', updateFeedback);
router.delete('/feedback/:id', deleteFeedback);

// Feedback Statistics & Filters
router.get('/feedback/stats', getFeedbackStats);
router.get('/feedback/stats/:serviceId', getFeedbackStats);
router.get('/feedback/user/:userId', getFeedbacksByUser);