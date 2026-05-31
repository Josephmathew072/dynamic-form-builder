import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
// import { protect, superAdminOnly } from '../middleware/auth.js';

const router = express.Router();

// router.post('/register', protect, superAdminOnly, register);  // only superadmin can create new admins
router.post('/login', login);
// router.get('/me', protect, getMe);

export default router;