import api from './api';

/**
 * TPO Service
 * Handles all TPO (Training and Placement Officer) related API calls
 */

// Get TPO dashboard
export const getTpoDashboard = async () => {
  const response = await api.get('/tpo/dashboard');
  return response.data;
};

// Get all placement drives
export const getAllDrives = async () => {
  const response = await api.get('/tpo/drives');
  return response.data;
};

// Create new placement drive
export const createDrive = async (driveData) => {
  const response = await api.post('/tpo/drives', driveData);
  return response.data;
};

// Update placement drive
export const updateDrive = async (driveId, driveData) => {
  const response = await api.put(`/tpo/drives/${driveId}`, driveData);
  return response.data;
};

// Delete placement drive
export const deleteDrive = async (driveId) => {
  const response = await api.delete(`/tpo/drives/${driveId}`);
  return response.data;
};

// Get drive registrations
export const getDriveRegistrations = async (driveId) => {
  const response = await api.get(`/tpo/drives/${driveId}/registrations`);
  return response.data;
};

// Get placement statistics
export const getPlacementStats = async () => {
  const response = await api.get('/tpo/stats');
  return response.data;
};

// Get all students
export const getAllStudents = async () => {
  const response = await api.get('/tpo/students');
  return response.data;
};

// Update student placement status
export const updatePlacementStatus = async (studentId, status) => {
  const response = await api.put(`/tpo/students/${studentId}/status`, { status });
  return response.data;
};

export default {
  getTpoDashboard,
  getAllDrives,
  createDrive,
  updateDrive,
  deleteDrive,
  getDriveRegistrations,
  getPlacementStats,
  getAllStudents,
  updatePlacementStatus
};
