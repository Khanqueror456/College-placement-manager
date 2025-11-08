import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateChangePassword,
  validateEmail,
  validateResetPassword
} from '../middlewares/validate.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateEmail, forgotPassword);
router.put('/reset-password/:token', validateResetPassword, resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/change-password', authenticate, validateChangePassword, changePassword);

export default router;
