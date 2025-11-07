import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logError, logActivity } from '../middlewares/logger.js';
import User from '../models/users.js';

/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */

// Temporary in-memory user storage (DEPRECATED - now using database)
const tempUsers = new Map();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, department, phone, rollNumber, student_id, batch_year, cgpa } = req.body;

  // Check if user already exists in database
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create user in database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: (role || 'student').toUpperCase(),  // Store uppercase to match database ENUM
    department,
    phone,
    student_id: student_id || rollNumber,
    batch_year,
    cgpa,
    is_active: true,
    profile_status: role === 'student' ? 'PENDING' : 'APPROVED'
  });

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id,  // Use database integer ID
      role: user.role,
      email: user.email,
      department: user.department
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );

  // Log activity
  logActivity('USER_REGISTERED', user.id, { email, role });

  res.status(201).json({
    success: true,
    message: role === 'student' 
      ? 'Registration successful! Your account is pending HOD approval.' 
      : 'Registration successful!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isApproved: user.profile_status === 'APPROVED'
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Get user from database
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Note: Students can login even if not approved, but middleware will restrict access to protected routes

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id,  // Use database integer ID
      role: user.role,
      email: user.email,
      department: user.department
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );

  // Log activity
  logActivity('USER_LOGIN', user.id, { email, role: user.role });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isApproved: user.profile_status === 'APPROVED'
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  // User is available from auth middleware (req.user)
  
  // TODO: Fetch complete user details from database
  // const user = await User.findById(req.user.id).select('-password');
  // if (!user) {
  //   throw new AppError('User not found', 404);
  // }

  // Mock user details
  const user = {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    department: req.user.department,
    name: 'Current User',
    phone: '1234567890',
    isApproved: true
  };

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Logout user / Clear token
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  // If using cookies, clear the cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  // Log activity
  logActivity('USER_LOGOUT', req.user.id, { email: req.user.email });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current and new password', 400);
  }

  // TODO: Get user with password field
  // const user = await User.findById(req.user.id).select('+password');
  // if (!user) {
  //   throw new AppError('User not found', 404);
  // }

  // TODO: Verify current password
  // const isMatch = await bcryptjs.compare(currentPassword, user.password);
  // if (!isMatch) {
  //   throw new AppError('Current password is incorrect', 401);
  // }

  // TODO: Hash and update new password
  // const salt = await bcryptjs.genSalt(10);
  // user.password = await bcryptjs.hash(newPassword, salt);
  // await user.save();

  // Log activity
  logActivity('PASSWORD_CHANGED', req.user.id, { email: req.user.email });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Forgot password - Send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Please provide email address', 400);
  }

  // TODO: Find user by email
  // const user = await User.findOne({ email });
  // if (!user) {
  //   throw new AppError('No user found with this email', 404);
  // }

  // TODO: Generate reset token
  // const resetToken = crypto.randomBytes(32).toString('hex');
  // const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // TODO: Save token to user with expiry
  // user.resetPasswordToken = hashedToken;
  // user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  // await user.save();

  // TODO: Send email with reset link
  // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  // await sendEmail({
  //   email: user.email,
  //   subject: 'Password Reset Request',
  //   message: `Click here to reset password: ${resetUrl}`
  // });

  logInfo('Password reset requested', { email });

  res.status(200).json({
    success: true,
    message: 'Password reset email sent successfully'
  });
});

// @desc    Reset password with token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new AppError('Please provide new password', 400);
  }

  // TODO: Hash the token from params
  // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // TODO: Find user with valid token
  // const user = await User.findOne({
  //   resetPasswordToken: hashedToken,
  //   resetPasswordExpire: { $gt: Date.now() }
  // });

  // if (!user) {
  //   throw new AppError('Invalid or expired reset token', 400);
  // }

  // TODO: Update password
  // const salt = await bcryptjs.genSalt(10);
  // user.password = await bcryptjs.hash(password, salt);
  // user.resetPasswordToken = undefined;
  // user.resetPasswordExpire = undefined;
  // await user.save();

  logInfo('Password reset successful', { token });

  res.status(200).json({
    success: true,
    message: 'Password reset successful. You can now login with your new password.'
  });
});

// @desc    Refresh JWT token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // Generate new access token
    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        role: decoded.role,
        email: decoded.email,
        department: decoded.department
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    res.status(200).json({
      success: true,
      token: newToken
    });
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
});

export default {
  register,
  login,
  getMe,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken
};
