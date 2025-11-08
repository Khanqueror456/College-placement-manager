import express from 'express';
import {
  createDrive,
  updateDrive,
  deleteDrive,
  getAllDrives,
  closeDrive,
  addCompany,
  getAllCompanies,
  getApplicationsForDrive,
  updateApplicationStatus,
  bulkUpdateStatus,
  uploadOfferLetter,
  sendNotification,
  getDashboard,
  getPendingStudents,
  approveStudent,
  getAllStudents,
  updateStudentProfile,
  generateExcelReport,
  generatePDFReport
} from '../controllers/tpoController.js';
import { getResume } from '../controllers/studentController.js';
import { authenticate, isTPO } from '../middlewares/auth.js';
import { uploadOfferLetter as uploadOfferLetterMiddleware } from '../middlewares/upload.js';
import { validatePlacementDrive } from '../middlewares/validate.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public/stats', getDashboard);

// All routes below require authentication and TPO role
router.use(authenticate, isTPO);

// Company routes
router.post('/companies', addCompany);
router.get('/companies', getAllCompanies);

// Drive routes
router.post('/drives', validatePlacementDrive, createDrive);
router.get('/drives', getAllDrives);
router.put('/drives/:driveId', updateDrive);
router.delete('/drives/:driveId', deleteDrive);
router.post('/drives/:driveId/close', closeDrive);

// Application routes
router.get('/drives/:driveId/applications', getApplicationsForDrive);
router.put('/applications/:applicationId/status', updateApplicationStatus);
router.post('/applications/bulk-update', bulkUpdateStatus);
router.post('/applications/:applicationId/offer-letter', uploadOfferLetterMiddleware, uploadOfferLetter);

// Student management routes
router.get('/students/pending', getPendingStudents);
router.get('/students/:studentId/resume', getResume); // View student resume
router.get('/students', getAllStudents);
router.put('/students/:studentId/approve', approveStudent);
router.put('/students/:studentId', updateStudentProfile);

// Report generation routes
router.get('/reports/excel', generateExcelReport);
router.get('/reports/pdf', generatePDFReport);

// Notification routes
router.post('/notifications', sendNotification);

// Dashboard
router.get('/dashboard', getDashboard);

export default router;
