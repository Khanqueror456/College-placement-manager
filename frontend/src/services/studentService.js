import api from './api';

/**
 * Student Service
 * Handles all student-related API calls
 */

const studentService = {
  // ========== Profile Management ==========
  
  /**
   * Get student profile
   */
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  /**
   * Update student profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/student/profile', profileData);
    return response.data;
  },

  // ========== Resume Management ==========
  
  /**
   * Upload resume
   */
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/student/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete resume
   */
  deleteResume: async () => {
    const response = await api.delete('/student/resume');
    return response.data;
  },

  // ========== Placement Drives ==========
  
  /**
   * Get all active placement drives
   */
  getActiveDrives: async () => {
    const response = await api.get('/student/drives/active');
    return response.data;
  },

  /**
   * Apply to a placement drive
   */
  applyToDrive: async (driveId, coverLetter = '') => {
    const response = await api.post(`/student/drives/${driveId}/apply`, {
      coverLetter
    });
    return response.data;
  },

  // ========== Applications Management ==========
  
  /**
   * Get all student applications
   */
  getMyApplications: async () => {
    const response = await api.get('/student/applications');
    return response.data;
  },

  /**
   * Get detailed application status
   */
  getApplicationStatus: async (applicationId) => {
    const response = await api.get(`/student/applications/${applicationId}/status`);
    return response.data;
  },

  /**
   * Withdraw application
   */
  withdrawApplication: async (applicationId) => {
    const response = await api.delete(`/student/applications/${applicationId}`);
    return response.data;
  },

  /**
   * Download offer letter
   */
  downloadOfferLetter: async (applicationId) => {
    const response = await api.get(`/student/applications/${applicationId}/offer-letter`);
    return response.data;
  },

  // ========== Dashboard ==========
  
  /**
   * Get student dashboard statistics
   */
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  }
};

export default studentService;
