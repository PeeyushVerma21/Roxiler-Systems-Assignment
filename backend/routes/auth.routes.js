import express from 'express';
import { register, login, updatePassword } from '../controllers/auth.controller.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register); // Normal user sign up
router.post('/login', login);       // Login all roles
router.put('/update-password', authenticate, updatePassword); // Logged-in user only

export default router;
