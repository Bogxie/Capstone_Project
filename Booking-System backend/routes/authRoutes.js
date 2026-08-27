import express from 'express'
import { register, login, getCurrentUser } from '../controllers/authControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';

export const router = express.Router();

router.get('/auth/me', authenticate, getCurrentUser);

router.post('/auth/register', register);
router.post('/auth/login', login);

