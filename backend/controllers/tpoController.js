import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';
import { sendApplicationStatusEmail, sendNewDriveNotification } from '../lib/emailService.js';

/**
 * TPO (Training & Placement Officer) Controller
 * Handles placement drives, companies, and overall system management
 */

// @desc    Create new placement drive
// @route   POST /api/tpo/drives
// @access  Private (TPO)
export const createDrive = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    jobRole,
    jobDescription,
    package: packageOffered,
    eligibilityCriteria,
    applicationDeadline,
    driveDate,
    location,
    jobType
  } = req.body;

  // TODO: Validate company exists
  // const company = await Company.findOne({ name: companyName });
  // if (!company) {
  //   throw new AppError('Company not found. Please add company first.', 404);
  // }

  // TODO: Create drive in database
  // const drive = await Drive.create({
  //   company: company._id,
  //   companyName,
  //   jobRole,
  //   jobDescription,
  //   package: packageOffered,
  //   eligibilityCriteria: {
  //     minCGPA: eligibilityCriteria.minCGPA,
  //     allowedDepartments: eligibilityCriteria.allowedDepartments,
  //     maxBacklogs: eligibilityCriteria.maxBacklogs,
  //     graduationYear: eligibilityCriteria.graduationYear
  //   },
  //   applicationDeadline,
  //   driveDate,
  //   location,
  //   jobType,
  //   status: 'active',
  //   createdBy: req.user.id
  // });

  // Log activity
  logActivity('DRIVE_CREATED', req.user.id, { companyName, jobRole });

  res.status(201).json({
    success: true,
    message: 'Placement drive created successfully',
    drive: {
      id: `drive_${Date.now()}`,
      companyName,
      jobRole,
      status: 'active',
      createdAt: new Date()
    }
  });
});

// @desc    Update placement drive
// @route   PUT /api/tpo/drives/:driveId
// @access  Private (TPO)
export const updateDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;
  const updates = req.body;

  // TODO: Find and update drive
  // const drive = await Drive.findById(driveId);
  // if (!drive) {
  //   throw new AppError('Placement drive not found', 404);
  // }

  // if (drive.status === 'closed') {
  //   throw new AppError('Cannot update closed drive', 400);
  // }

  // const updatedDrive = await Drive.findByIdAndUpdate(
  //   driveId,
  //   updates,
  //   { new: true, runValidators: true }
  // );

  logActivity('DRIVE_UPDATED', req.user.id, { driveId });

  res.status(200).json({
    success: true,
    message: 'Drive updated successfully',
    drive: updates
  });
});

// @desc    Delete placement drive
// @route   DELETE /api/tpo/drives/:driveId
// @access  Private (TPO)
export const deleteDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // TODO: Check if drive has applications
  // const drive = await Drive.findById(driveId);
  // if (!drive) {
  //   throw new AppError('Placement drive not found', 404);
  // }

  // const applicationCount = await Application.countDocuments({ drive: driveId });
  // if (applicationCount > 0) {
  //   throw new AppError('Cannot delete drive with existing applications', 400);
  // }

  // await Drive.findByIdAndDelete(driveId);

  logActivity('DRIVE_DELETED', req.user.id, { driveId });

  res.status(200).json({
    success: true,
    message: 'Drive deleted successfully'
  });
});

// @desc    Get all placement drives
// @route   GET /api/tpo/drives
// @access  Private (TPO)
export const getAllDrives = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10, search = '' } = req.query;

  // TODO: Build query
  // const query = {};
  // if (status) query.status = status;
  // if (search) {
  //   query.$or = [
  //     { companyName: { $regex: search, $options: 'i' } },
  //     { jobRole: { $regex: search, $options: 'i' } }
  //   ];
  // }

  // const drives = await Drive.find(query)
  //   .limit(limit * 1)
  //   .skip((page - 1) * limit)
  //   .sort({ createdAt: -1 });

  // const total = await Drive.countDocuments(query);

  // Mock drives
  const drives = [
    {
      id: 'drive_1',
      companyName: 'Google',
      jobRole: 'Software Engineer',
      package: '25 LPA',
      status: 'active',
      applicationsCount: 45,
      createdAt: new Date()
    },
    {
      id: 'drive_2',
      companyName: 'Microsoft',
      jobRole: 'SDE Intern',
      package: '80k/month',
      status: 'active',
      applicationsCount: 62,
      createdAt: new Date()
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    total: 15,
    page: parseInt(page),
    pages: Math.ceil(15 / limit),
    drives
  });
});

// @desc    Close/End placement drive
// @route   PUT /api/tpo/drives/:driveId/close
// @access  Private (TPO)
export const closeDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // TODO: Update drive status
  // const drive = await Drive.findById(driveId);
  // if (!drive) {
  //   throw new AppError('Drive not found', 404);
  // }

  // drive.status = 'closed';
  // drive.closedAt = new Date();
  // drive.closedBy = req.user.id;
  // await drive.save();

  logActivity('DRIVE_CLOSED', req.user.id, { driveId });

  res.status(200).json({
    success: true,
    message: 'Drive closed successfully'
  });
});

// @desc    Add new company
// @route   POST /api/tpo/companies
// @access  Private (TPO)
export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    website,
    industry,
    location,
    contactPerson,
    contactEmail,
    contactPhone
  } = req.body;

  // TODO: Check if company already exists
  // const existingCompany = await Company.findOne({ name });
  // if (existingCompany) {
  //   throw new AppError('Company already exists', 400);
  // }

  // TODO: Create company
  // const company = await Company.create({
  //   name,
  //   description,
  //   website,
  //   industry,
  //   location,
  //   contactPerson,
  //   contactEmail,
  //   contactPhone,
  //   addedBy: req.user.id
  // });

  logActivity('COMPANY_ADDED', req.user.id, { companyName: name });

  res.status(201).json({
    success: true,
    message: 'Company added successfully',
    company: {
      id: `company_${Date.now()}`,
      name,
      website,
      createdAt: new Date()
    }
  });
});

// @desc    Get all companies
// @route   GET /api/tpo/companies
// @access  Private (TPO)
export const getAllCompanies = asyncHandler(async (req, res, next) => {
  // TODO: Fetch companies from database
  // const companies = await Company.find().sort({ name: 1 });

  // Mock companies
  const companies = [
    {
      id: 'company_1',
      name: 'Google',
      industry: 'Technology',
      website: 'https://google.com',
      totalDrives: 5
    },
    {
      id: 'company_2',
      name: 'Microsoft',
      industry: 'Technology',
      website: 'https://microsoft.com',
      totalDrives: 8
    }
  ];

  res.status(200).json({
    success: true,
    count: companies.length,
    companies
  });
});

// @desc    Get applications for a specific drive
// @route   GET /api/tpo/drives/:driveId/applications
// @access  Private (TPO)
export const getApplicationsForDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;
  const { status, page = 1, limit = 20 } = req.query;

  // TODO: Fetch applications with filters
  // const query = { drive: driveId };
  // if (status) query.status = status;

  // const applications = await Application.find(query)
  //   .populate('student', 'name email rollNumber cgpa resumeUrl')
  //   .limit(limit * 1)
  //   .skip((page - 1) * limit)
  //   .sort({ appliedAt: -1 });

  // const total = await Application.countDocuments(query);

  // Mock applications
  const applications = [
    {
      id: 'app_1',
      student: {
        id: 'student_1',
        name: 'John Doe',
        email: 'john@example.com',
        rollNumber: 'CS2023001',
        cgpa: 8.5,
        resumeUrl: '/uploads/resumes/resume-1.pdf'
      },
      status: 'applied',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'app_2',
      student: {
        id: 'student_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        rollNumber: 'CS2023002',
        cgpa: 9.0,
        resumeUrl: '/uploads/resumes/resume-2.pdf'
      },
      status: 'shortlisted',
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  res.status(200).json({
    success: true,
    count: applications.length,
    total: 45,
    page: parseInt(page),
    applications
  });
});

// @desc    Update application status
// @route   PUT /api/tpo/applications/:applicationId/status
// @access  Private (TPO)
export const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { status, round, feedback } = req.body;

  const validStatuses = ['applied', 'shortlisted', 'selected', 'rejected', 'on-hold'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  // TODO: Update application
  // const application = await Application.findById(applicationId)
  //   .populate('student', 'email name')
  //   .populate('drive', 'companyName jobRole');

  // if (!application) {
  //   throw new AppError('Application not found', 404);
  // }

  // application.status = status;
  // application.currentRound = round;
  // application.feedback = feedback;
  // application.lastUpdated = new Date();
  // await application.save();

  // Mock data for email (replace with actual database queries)
  const student = {
    id: 'student_1',
    name: 'Student Name', // TODO: Get from database
    email: 'student@example.com' // TODO: Get from database
  };

  const application = {
    id: applicationId,
    companyName: 'Company Name', // TODO: Get from database
    jobRole: 'Job Role', // TODO: Get from database
    status: status
  };

  // Send email notification to student
  try {
    await sendApplicationStatusEmail(student, application, status, feedback);
    logInfo('Application status email sent successfully', { 
      applicationId, 
      studentEmail: student.email, 
      status 
    });
  } catch (error) {
    logInfo('Failed to send application status email', { 
      applicationId, 
      error: error.message 
    });
    // Don't fail the status update if email fails
  }

  logActivity('APPLICATION_STATUS_UPDATED', req.user.id, { applicationId, status });

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully and notification email sent',
    application: {
      id: applicationId,
      status,
      round,
      updatedAt: new Date()
    }
  });
});

// @desc    Bulk update application status
// @route   PUT /api/tpo/applications/bulk-update
// @access  Private (TPO)
export const bulkUpdateStatus = asyncHandler(async (req, res, next) => {
  const { applicationIds, status, round } = req.body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new AppError('Please provide application IDs', 400);
  }

  // TODO: Bulk update applications
  // const result = await Application.updateMany(
  //   { _id: { $in: applicationIds } },
  //   { status, currentRound: round, lastUpdated: new Date() }
  // );

  // Send bulk emails to all students (mock data - replace with actual database queries)
  let emailsSent = 0;
  const emailPromises = applicationIds.map(async (appId) => {
    try {
      // Mock data for each application (replace with actual database queries)
      const student = {
        id: `student_${appId}`,
        name: 'Student Name',
        email: 'student@example.com'
      };

      const application = {
        id: appId,
        companyName: 'Company Name',
        jobRole: 'Job Role',
        status: status
      };

      await sendApplicationStatusEmail(student, application, status, req.body.comments || '');
      emailsSent++;
      return true;
    } catch (error) {
      logInfo('Failed to send bulk email', { applicationId: appId, error: error.message });
      return false;
    }
  });

  // Wait for all emails to complete (don't fail the bulk update if some emails fail)
  await Promise.allSettled(emailPromises);

  logActivity('BULK_STATUS_UPDATE', req.user.id, { 
    count: applicationIds.length, 
    status,
    emailsSent 
  });

  res.status(200).json({
    success: true,
    message: `${applicationIds.length} applications updated successfully. ${emailsSent} notification emails sent.`,
    updatedCount: applicationIds.length,
    emailsSent
  });
});

// @desc    Upload offer letter for selected student
// @route   POST /api/tpo/applications/:applicationId/offer
// @access  Private (TPO)
export const uploadOfferLetter = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;

  if (!req.file) {
    throw new AppError('Please upload offer letter file', 400);
  }

  const offerLetterUrl = `/uploads/offers/${req.file.filename}`;

  // TODO: Update application with offer letter
  // const application = await Application.findById(applicationId)
  //   .populate('student', 'email name');

  // if (!application) {
  //   throw new AppError('Application not found', 404);
  // }

  // if (application.status !== 'selected') {
  //   throw new AppError('Can only upload offer letter for selected candidates', 400);
  // }

  // application.offerLetterUrl = offerLetterUrl;
  // application.offerLetterUploadedAt = new Date();
  // await application.save();

  // TODO: Send email with offer letter
  // await sendEmail({
  //   email: application.student.email,
  //   subject: 'Congratulations! Offer Letter',
  //   message: 'Your offer letter has been uploaded. Please download from portal.',
  //   attachments: [{ path: req.file.path }]
  // });

  logActivity('OFFER_LETTER_UPLOADED', req.user.id, { applicationId });

  res.status(200).json({
    success: true,
    message: 'Offer letter uploaded successfully',
    offerLetterUrl
  });
});

// @desc    Send email notification
// @route   POST /api/tpo/notifications/send
// @access  Private (TPO)
export const sendNotification = asyncHandler(async (req, res, next) => {
  const { recipients, subject, message, type } = req.body;

  // recipients can be: 'all', 'department', 'drive-applicants', or specific emails
  
  // TODO: Build recipient list based on type
  // let emails = [];
  // if (type === 'all-students') {
  //   const students = await User.find({ role: 'student' }).select('email');
  //   emails = students.map(s => s.email);
  // } else if (type === 'department') {
  //   const students = await User.find({ 
  //     role: 'student', 
  //     department: recipients.department 
  //   }).select('email');
  //   emails = students.map(s => s.email);
  // } else if (Array.isArray(recipients)) {
  //   emails = recipients;
  // }

  // TODO: Send bulk emails
  // await sendBulkEmail({
  //   emails,
  //   subject,
  //   message
  // });

  logActivity('NOTIFICATION_SENT', req.user.id, { type, count: 0 });

  res.status(200).json({
    success: true,
    message: `Notification sent to recipients`,
    recipientCount: 0
  });
});

// @desc    Get TPO dashboard statistics
// @route   GET /api/tpo/dashboard
// @access  Private (TPO)
export const getDashboard = asyncHandler(async (req, res, next) => {
  // TODO: Aggregate dashboard statistics
  // const totalDrives = await Drive.countDocuments();
  // const activeDrives = await Drive.countDocuments({ status: 'active' });
  // const totalApplications = await Application.countDocuments();
  // const totalStudents = await User.countDocuments({ role: 'student', isApproved: true });
  // const placedStudents = await Application.countDocuments({ status: 'selected' });

  // Mock dashboard data
  const dashboardData = {
    totalDrives: 25,
    activeDrives: 8,
    closedDrives: 17,
    totalApplications: 450,
    totalStudents: 300,
    approvedStudents: 285,
    pendingApprovals: 15,
    placedStudents: 180,
    placementPercentage: 63.16,
    totalCompanies: 35,
    recentDrives: [
      {
        id: 'drive_1',
        companyName: 'Google',
        jobRole: 'SDE',
        applicationsCount: 45,
        status: 'active'
      }
    ],
    recentApplications: [
      {
        studentName: 'John Doe',
        companyName: 'Microsoft',
        status: 'shortlisted',
        appliedAt: new Date()
      }
    ],
    monthlyStats: {
      applications: [30, 45, 60, 55],
      placements: [10, 15, 20, 18]
    }
  };

  res.status(200).json({
    success: true,
    dashboard: dashboardData
  });
});

export default {
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
  getDashboard
};
