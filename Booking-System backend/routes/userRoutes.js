import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userControllers.js';
import { authenticate } from '../middleware/authMiddleware.js'

export const router = express.Router();

router.use(authenticate);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);