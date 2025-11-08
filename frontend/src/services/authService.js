import api from './api';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Save token and user data
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    // Format error message properly with validation details
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // Validation errors
      errorMessage = error.response.data.errors.map(err => err.message).join(', ');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw errorMessage;
  }
};

// Login user
export const login = async (email, password, role) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Save token and user data
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    // Format error message properly with validation details
    let errorMessage = 'Login failed. Please check your credentials.';
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // Validation errors
      errorMessage = error.response.data.errors.map(err => err.message).join(', ');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw errorMessage;
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await api.put(`/auth/reset-password/${token}`, { 
      password,
      confirmPassword 
    });
    return response.data;
  } catch (error) {
    // Format error message properly
    let errorMessage = 'Failed to reset password. Please try again.';
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // Validation errors
      errorMessage = error.response.data.errors.map(err => err.message).join(', ');
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw errorMessage;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get stored user data
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
  isAuthenticated,
  getStoredUser
};
