import api from './api';

/**
 * Student Service
 * Handles all student-related API calls
 */

// Get student profile
export const getStudentProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

// Update student profile
export const updateStudentProfile = async (profileData) => {
  const response = await api.put('/student/profile', profileData);
  return response.data;
};

// Get student dashboard data
export const getStudentDashboard = async () => {
  const response = await api.get('/student/dashboard');
  return response.data;
};

// Get available drives
export const getAvailableDrives = async () => {
  const response = await api.get('/student/drives');
  return response.data;
};

// Register for a drive
export const registerForDrive = async (driveId) => {
  const response = await api.post(`/student/drives/${driveId}/register`);
  return response.data;
};

// Get student's drive registrations
export const getMyRegistrations = async () => {
  const response = await api.get('/student/registrations');
  return response.data;
};

// Upload resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await api.post('/upload/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  getAvailableDrives,
  registerForDrive,
  getMyRegistrations,
  uploadResume
};
