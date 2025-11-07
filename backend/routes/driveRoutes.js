import express from 'express';
import {
  getAllDrives,
  getActiveDrives,
  getDriveById,
  getDriveStats,
  searchDrives,
  getUpcomingDrives,
  checkEligibility,
  getDrivesByCompany
} from '../controllers/driveController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Drive routes
router.get('/', getAllDrives);
router.get('/active', getActiveDrives);
router.get('/upcoming', getUpcomingDrives);
router.get('/search', searchDrives);
router.get('/company/:companyId', getDrivesByCompany);
router.get('/:driveId', getDriveById);
router.get('/:driveId/stats', getDriveStats);
router.get('/:driveId/check-eligibility', checkEligibility);

export default router;
