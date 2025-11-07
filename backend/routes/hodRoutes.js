import express from 'express';
import {
  getPendingApprovals,
  approveStudent,
  rejectStudent,
  getDepartmentStudents,
  getStudentDetails,
  verifyStudentProfile,
  getDepartmentStats,
  getPlacementReport,
  getDashboard
} from '../controllers/hodController.js';
import { authenticate, isHOD } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication and HOD role
router.use(authenticate, isHOD);

// Approval routes
router.get('/approvals/pending', getPendingApprovals);
router.post('/approvals/:studentId/approve', approveStudent);
router.post('/approvals/:studentId/reject', rejectStudent);

// Student management routes
router.get('/students', getDepartmentStudents);
router.get('/students/:studentId', getStudentDetails);
router.post('/students/:studentId/verify', verifyStudentProfile);

// Statistics and reports
router.get('/statistics', getDepartmentStats);
router.get('/reports/placement', getPlacementReport);

// Dashboard
router.get('/dashboard', getDashboard);

export default router;
