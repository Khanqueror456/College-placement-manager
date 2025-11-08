import api from './api';import api from './api';



/**/**

 * TPO Service * TPO Service

 * Handles all TPO (Training and Placement Officer) related API calls * Handles all TPO (Training and Placement Officer) related API calls

 */ */



// ========== DRIVE MANAGEMENT ==========// Get TPO dashboard

export const getTpoDashboard = async () => {

export const createDrive = async (driveData) => {  const response = await api.get('/tpo/dashboard');

  const response = await api.post('/tpo/drives', driveData);  return response.data;

  return response.data;};

};

// Get all placement drives

export const getAllDrives = async (params = {}) => {export const getAllDrives = async () => {

  const response = await api.get('/tpo/drives', { params });  const response = await api.get('/tpo/drives');

  return response.data;  return response.data;

};};



export const updateDrive = async (driveId, updates) => {// Create new placement drive

  const response = await api.put(`/tpo/drives/${driveId}`, updates);export const createDrive = async (driveData) => {

  return response.data;  const response = await api.post('/tpo/drives', driveData);

};  return response.data;

};

export const deleteDrive = async (driveId) => {

  const response = await api.delete(`/tpo/drives/${driveId}`);// Update placement drive

  return response.data;export const updateDrive = async (driveId, driveData) => {

};  const response = await api.put(`/tpo/drives/${driveId}`, driveData);

  return response.data;

export const closeDrive = async (driveId) => {};

  const response = await api.post(`/tpo/drives/${driveId}/close`);

  return response.data;// Delete placement drive

};export const deleteDrive = async (driveId) => {

  const response = await api.delete(`/tpo/drives/${driveId}`);

// ========== COMPANY MANAGEMENT ==========  return response.data;

};

export const addCompany = async (companyData) => {

  const response = await api.post('/tpo/companies', companyData);// Get drive registrations

  return response.data;export const getDriveRegistrations = async (driveId) => {

};  const response = await api.get(`/tpo/drives/${driveId}/registrations`);

  return response.data;

export const getAllCompanies = async () => {};

  const response = await api.get('/tpo/companies');

  return response.data;// Get placement statistics

};export const getPlacementStats = async () => {

  const response = await api.get('/tpo/stats');

// ========== APPLICATION MANAGEMENT ==========  return response.data;

};

export const getApplicationsForDrive = async (driveId, params = {}) => {

  const response = await api.get(`/tpo/drives/${driveId}/applications`, { params });// Get all students

  return response.data;export const getAllStudents = async () => {

};  const response = await api.get('/tpo/students');

  return response.data;

export const updateApplicationStatus = async (applicationId, statusData) => {};

  const response = await api.put(`/tpo/applications/${applicationId}/status`, statusData);

  return response.data;// Update student placement status

};export const updatePlacementStatus = async (studentId, status) => {

  const response = await api.put(`/tpo/students/${studentId}/status`, { status });

export const bulkUpdateStatus = async (updateData) => {  return response.data;

  const response = await api.post('/tpo/applications/bulk-update', updateData);};

  return response.data;

};export default {

  getTpoDashboard,

export const uploadOfferLetter = async (applicationId, file) => {  getAllDrives,

  const formData = new FormData();  createDrive,

  formData.append('offerLetter', file);  updateDrive,

    deleteDrive,

  const response = await api.post(`/tpo/applications/${applicationId}/offer-letter`, formData, {  getDriveRegistrations,

    headers: {  getPlacementStats,

      'Content-Type': 'multipart/form-data',  getAllStudents,

    },  updatePlacementStatus

  });};

  return response.data;
};

// ========== STUDENT MANAGEMENT ==========

export const getPendingStudents = async (params = {}) => {
  const response = await api.get('/tpo/students/pending', { params });
  return response.data;
};

export const getAllStudents = async (params = {}) => {
  const response = await api.get('/tpo/students', { params });
  return response.data;
};

export const approveStudent = async (studentId, status) => {
  const response = await api.put(`/tpo/students/${studentId}/approve`, { status });
  return response.data;
};

export const updateStudentProfile = async (studentId, updates) => {
  const response = await api.put(`/tpo/students/${studentId}`, updates);
  return response.data;
};

export const getStudentResume = async (studentId) => {
  const response = await api.get(`/tpo/students/${studentId}/resume`);
  return response.data;
};

// ========== REPORTS ==========

export const generateExcelReport = async (params = {}) => {
  const response = await api.get('/tpo/reports/excel', {
    params,
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `placement-report-${Date.now()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return { success: true, message: 'Report downloaded successfully' };
};

export const generatePDFReport = async (params = {}) => {
  const response = await api.get('/tpo/reports/pdf', {
    params,
    responseType: 'blob',
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `placement-report-${Date.now()}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  
  return { success: true, message: 'Report downloaded successfully' };
};

// ========== DASHBOARD ==========

export const getDashboard = async () => {
  const response = await api.get('/tpo/dashboard');
  return response.data;
};

// ========== NOTIFICATIONS ==========

export const sendNotification = async (notificationData) => {
  const response = await api.post('/tpo/notifications', notificationData);
  return response.data;
};

export default {
  createDrive,
  getAllDrives,
  updateDrive,
  deleteDrive,
  closeDrive,
  addCompany,
  getAllCompanies,
  getApplicationsForDrive,
  updateApplicationStatus,
  bulkUpdateStatus,
  uploadOfferLetter,
  getPendingStudents,
  getAllStudents,
  approveStudent,
  updateStudentProfile,
  generateExcelReport,
  generatePDFReport,
  getDashboard,
  sendNotification,
};
