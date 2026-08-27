import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
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

router.post('/feedback', authenticate, createFeedback);
router.get('/feedback', authenticate, getAllFeedbacks);
router.get('/feedback/booking/:bookingId', authenticate, getFeedbackByBooking);
router.put('/feedback/:id', authenticate, updateFeedback);
router.delete('/feedback/:id', authenticate, deleteFeedback);

router.get('/feedback/stats', authenticate, getFeedbackStats);
router.get('/feedback/stats/:serviceId',authenticate, getFeedbackStats);
router.get('/feedback/user/:userId', authenticate, getFeedbacksByUser); 