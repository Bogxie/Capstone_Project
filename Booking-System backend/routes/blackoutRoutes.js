import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getBlackoutDates, updateBlackoutDates } from "../controllers/blackoutControllers.js";

export const router = express.Router();

router.get('/blackout-dates', getBlackoutDates);
router.put('/blackout-dates', authenticate, updateBlackoutDates);