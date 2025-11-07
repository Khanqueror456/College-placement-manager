/**
 * Quick Reference Guide for Middleware Usage
 * Import this file to get all common middleware patterns
 */

// ============================================
// AUTHENTICATION PATTERNS
// ============================================

// Protect any route - requires valid JWT
import { authenticate } from './auth.js';
// Usage: router.get('/profile', authenticate, controller);

// Role-based protection
import { isStudent, isHOD, isTPO, isAdmin } from './auth.js';
// Usage: router.post('/apply', authenticate, isStudent, applyToDrive);

// Department access control
import { checkDepartmentAccess } from './auth.js';
// Usage: router.get('/dept/:department', authenticate, checkDepartmentAccess, getStudents);

// ============================================
// FILE UPLOAD PATTERNS
// ============================================

// Single resume upload
import { uploadResume, handleUploadError } from './upload.js';
// Usage: router.post('/resume', authenticate, uploadResume, handleUploadError, saveResume);

// Offer letter upload (TPO only)
import { uploadOfferLetter } from './upload.js';
// Usage: router.post('/offer', authenticate, isTPO, uploadOfferLetter, handleUploadError, saveOffer);

// Multiple documents
import { uploadDocuments } from './upload.js';
// Usage: router.post('/docs', authenticate, uploadDocuments, handleUploadError, saveDocs);

// ============================================
// VALIDATION PATTERNS
// ============================================

// User registration
import { validateRegistration } from './validate.js';
// Usage: router.post('/register', validateRegistration, registerUser);

// Login validation
import { validateLogin } from './validate.js';
// Usage: router.post('/login', validateLogin, loginUser);

// Drive creation (TPO only)
import { validatePlacementDrive } from './validate.js';
// Usage: router.post('/drives', authenticate, isTPO, validatePlacementDrive, createDrive);

// Student profile update
import { validateStudentProfile } from './validate.js';
// Usage: router.put('/profile', authenticate, isStudent, validateStudentProfile, updateProfile);

// ============================================
// ERROR HANDLING PATTERNS
// ============================================

// Wrap async route handlers
import { asyncHandler } from './errorHandler.js';
// Usage:
// export const getUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id);
//   res.json(user);
// });

// Throw custom errors
import { AppError } from './errorHandler.js';
// Usage: throw new AppError('User not found', 404);

// ============================================
// LOGGING PATTERNS
// ============================================

// Log important events
import { logInfo, logError, logActivity } from './logger.js';
// Usage:
// logInfo('User registered', { userId: user.id });
// logError('Database error', error);
// logActivity('DRIVE_CREATED', userId, { driveId });

// ============================================
// COMPLETE ROUTE EXAMPLES
// ============================================

/*
// Student applies to placement drive
router.post('/drives/:id/apply',
  authenticate,           // Verify JWT
  isStudent,             // Only students can apply
  validateApplication,   // Validate request body
  asyncHandler(applyToDrive)  // Handle the request
);

// Student uploads resume
router.post('/profile/resume',
  authenticate,
  isStudent,
  uploadResume,
  handleUploadError,
  validateUpload,
  asyncHandler(updateResume)
);

// TPO creates new drive
router.post('/drives',
  authenticate,
  isTPO,
  validatePlacementDrive,
  asyncHandler(createDrive)
);

// HOD views department students
router.get('/students/:department',
  authenticate,
  isHOD,
  checkDepartmentAccess,
  validateId,
  asyncHandler(getDepartmentStudents)
);

// TPO uploads offer letter for student
router.post('/offers/:studentId',
  authenticate,
  isTPO,
  uploadOfferLetter,
  handleUploadError,
  validateId,
  asyncHandler(uploadOfferLetter)
);

// Admin (HOD/TPO) views reports
router.get('/reports',
  authenticate,
  isAdmin,
  validateDateRange,
  asyncHandler(getReports)
);
*/

// ============================================
// MIDDLEWARE COMBINATION HELPER
// ============================================

/**
 * Common middleware combinations for different routes
 */
export const middlewareCombos = {
  // Student routes
  studentRoute: (validators = []) => [
    authenticate,
    isStudent,
    ...validators,
  ],

  // HOD routes
  hodRoute: (validators = []) => [
    authenticate,
    isHOD,
    checkDepartmentAccess,
    ...validators,
  ],

  // TPO routes
  tpoRoute: (validators = []) => [
    authenticate,
    isTPO,
    ...validators,
  ],

  // Admin routes (HOD or TPO)
  adminRoute: (validators = []) => [
    authenticate,
    isAdmin,
    ...validators,
  ],

  // File upload route
  uploadRoute: (uploadMiddleware, validators = []) => [
    authenticate,
    uploadMiddleware,
    handleUploadError,
    ...validators,
  ],
};

/*
// Usage of middleware combos:
import { middlewareCombos } from './middlewares/quickReference.js';
import { validateStudentProfile } from './middlewares/validate.js';

router.put('/profile',
  ...middlewareCombos.studentRoute([validateStudentProfile]),
  asyncHandler(updateProfile)
);
*/

export default middlewareCombos;
