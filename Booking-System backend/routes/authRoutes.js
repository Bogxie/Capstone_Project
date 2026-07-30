import express from 'express'
import { register, login, getCurrentUser } from '../controllers/authControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';
import argon2 from 'argon2';

export const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/auth/me', authenticate, getCurrentUser);
