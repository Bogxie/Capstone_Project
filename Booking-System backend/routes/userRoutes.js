import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userControllers.js';
import { authenticate } from '../middleware/authMiddleware.js'

export const router = express.Router();

router.get('/users', authenticate, getAllUsers);
router.get('/users/:id', authenticate, getUserById);
router.post('/users', authenticate, createUser);
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);