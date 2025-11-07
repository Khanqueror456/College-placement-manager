/**
 * Email Testing Controller
 * Test endpoints for email functionality
 */

import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendEmail, testEmailConnection } from '../lib/emailService.js';
import { logInfo } from '../middlewares/logger.js';

// @desc    Test email connection
// @route   GET /api/test/email/connection
// @access  Private (Development only)
export const testConnection = asyncHandler(async (req, res, next) => {
  const isConnected = await testEmailConnection();
  
  res.status(200).json({
    success: true,
    connected: isConnected,
    message: isConnected ? 'Email service connected successfully' : 'Email service connection failed'
  });
});

// @desc    Send test email
// @route   POST /api/test/email/send
// @access  Private (Development only)
export const sendTestEmail = asyncHandler(async (req, res, next) => {
  const { to, subject = 'Test Email', message = 'This is a test email from College Placement Portal' } = req.body;

  if (!to) {
    return res.status(400).json({
      success: false,
      message: 'Recipient email is required'
    });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🧪 Test Email</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px; color: #333;">
          ${message}
        </p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Sent at:</strong> ${new Date().toLocaleString()}<br>
            <strong>From:</strong> College Placement Portal<br>
            <strong>Test ID:</strong> ${Date.now()}
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          This is a test email. Please ignore if received by mistake.
        </p>
      </div>
    </div>
  `;

  const emailSent = await sendEmail({
    to,
    subject,
    text: `${message}\n\nSent at: ${new Date().toLocaleString()}\nTest ID: ${Date.now()}`,
    html
  });

  logInfo('Test email attempt', { to, subject, success: emailSent });

  res.status(200).json({
    success: true,
    emailSent,
    message: emailSent ? 'Test email sent successfully' : 'Failed to send test email',
    details: {
      to,
      subject,
      sentAt: new Date().toISOString()
    }
  });
});

export default {
  testConnection,
  sendTestEmail
};