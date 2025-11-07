/**
 * Email Testing Routes
 * Routes for testing email functionality (Development only)
 */

import express from 'express';
import { testConnection, sendTestEmail } from '../controllers/emailTestController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Only allow in development mode
router.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Email testing endpoints are only available in development mode'
    });
  }
  next();
});

// Test email connection
router.get('/connection', testConnection);

// Send test email (no authentication required for testing)
router.post('/send', sendTestEmail);

export default router;