import api from './api';

/**
 * HOD Service
 * Handles all HOD-related API calls
 */

// Get HOD dashboard
export const getHodDashboard = async () => {
  const response = await api.get('/hod/dashboard');
  return response.data;
};

// Get pending student approvals
export const getPendingApprovals = async () => {
  const response = await api.get('/hod/pending-approvals');
  return response.data;
};

// Approve student
export const approveStudent = async (studentId) => {
  const response = await api.put(`/hod/approve/${studentId}`);
  return response.data;
};

// Reject student
export const rejectStudent = async (studentId, reason) => {
  const response = await api.put(`/hod/reject/${studentId}`, { reason });
  return response.data;
};

// Get department statistics
export const getDepartmentStats = async () => {
  const response = await api.get('/hod/stats');
  return response.data;
};

// Get all students in department
export const getDepartmentStudents = async () => {
  const response = await api.get('/hod/students');
  return response.data;
};

// Get placement reports
export const getPlacementReports = async () => {
  const response = await api.get('/hod/reports');
  return response.data;
};

export default {
  getHodDashboard,
  getPendingApprovals,
  approveStudent,
  rejectStudent,
  getDepartmentStats,
  getDepartmentStudents,
  getPlacementReports
};
