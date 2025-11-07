// Central Route Registry
// All routes are now modularized in separate files:
// - authRoutes.js - Authentication & User Management
// - studentRoutes.js - Student Operations
// - hodRoutes.js - HOD Operations
// - tpoRoutes.js - TPO Operations
// - driveRoutes.js - Drive Operations (shared across roles)

import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import hodRoutes from './hodRoutes.js';
import tpoRoutes from './tpoRoutes.js';
import driveRoutes from './driveRoutes.js';

export default {
  authRoutes,
  studentRoutes,
  hodRoutes,
  tpoRoutes,
  driveRoutes
};

// Route Structure:
// 
// /api/auth/*
//   POST   /register          - Register new user (student/hod/tpo)
//   POST   /login             - Login user
//   POST   /logout            - Logout user (requires auth)
//   GET    /me                - Get current user (requires auth)
//   POST   /change-password   - Change password (requires auth)
//   POST   /forgot-password   - Request password reset
//   POST   /reset-password/:token - Reset password with token
//   POST   /refresh-token     - Refresh JWT token
//
// /api/student/*              (All require authentication + student role)
//   GET    /profile           - Get student profile
//   PUT    /profile           - Update student profile
//   POST   /resume            - Upload resume
//   DELETE /resume            - Delete resume
//   GET    /drives/active     - Get active drives
//   POST   /drives/:id/apply  - Apply to drive
//   GET    /applications      - Get my applications
//   GET    /applications/:id/status - Get application status
//   DELETE /applications/:id  - Withdraw application
//   GET    /applications/:id/offer-letter - Download offer letter
//   GET    /dashboard         - Get student dashboard
//
// /api/hod/*                  (All require authentication + HOD role)
//   GET    /approvals/pending - Get pending student approvals
//   POST   /approvals/:id/approve - Approve student
//   POST   /approvals/:id/reject - Reject student
//   GET    /students          - Get department students
//   GET    /students/:id      - Get student details
//   POST   /students/:id/verify - Verify student profile
//   GET    /statistics        - Get department statistics
//   GET    /reports/placement - Get placement report
//   GET    /dashboard         - Get HOD dashboard
//
// /api/tpo/*                  (All require authentication + TPO role)
//   POST   /companies         - Add company
//   GET    /companies         - Get all companies
//   POST   /drives            - Create placement drive
//   GET    /drives            - Get all drives
//   PUT    /drives/:id        - Update drive
//   DELETE /drives/:id        - Delete drive
//   POST   /drives/:id/close  - Close drive
//   GET    /drives/:id/applications - Get applications for drive
//   PUT    /applications/:id/status - Update application status
//   POST   /applications/bulk-update - Bulk update status
//   POST   /applications/:id/offer-letter - Upload offer letter
//   POST   /notifications     - Send notification
//   GET    /dashboard         - Get TPO dashboard
//
// /api/drives/*               (All require authentication - role-based access)
//   GET    /                  - Get all drives (filtered by role)
//   GET    /active            - Get active drives
//   GET    /upcoming          - Get upcoming drives
//   GET    /search            - Search drives
//   GET    /company/:id       - Get drives by company
//   GET    /:id               - Get drive by ID
//   GET    /:id/stats         - Get drive statistics
//   GET    /:id/check-eligibility - Check eligibility for drive
