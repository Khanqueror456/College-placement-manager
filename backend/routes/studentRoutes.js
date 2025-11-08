import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
  getResume,
  getActiveDrives,
  applyToDrive,
  getMyApplications,
  getApplicationStatus,
  withdrawApplication,
  downloadOfferLetter,
  getDashboard
} from '../controllers/studentController.js';
import { authenticate, isStudent } from '../middlewares/auth.js';
import { uploadResume as uploadResumeMiddleware } from '../middlewares/upload.js';
import { validateStudentProfile } from '../middlewares/validate.js';

const router = express.Router();

// All routes require authentication and student role
router.use(authenticate, isStudent);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', validateStudentProfile, updateProfile);

// Resume routes
router.post('/resume', uploadResumeMiddleware, uploadResume);
router.get('/resume/:studentId', getResume); // Get specific student's resume
router.get('/resume', getResume); // Get own resume
router.delete('/resume', deleteResume);

// Drive routes
router.get('/drives/active', getActiveDrives);
router.post('/drives/:driveId/apply', applyToDrive);

// Application routes
router.get('/applications', getMyApplications);
router.get('/applications/:applicationId/status', getApplicationStatus);
router.delete('/applications/:applicationId', withdrawApplication);
router.get('/applications/:applicationId/offer-letter', downloadOfferLetter);

// Dashboard
router.get('/dashboard', getDashboard);

export default router;
