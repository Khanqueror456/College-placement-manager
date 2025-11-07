import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';
import { deleteFile, getFileUrl } from '../middlewares/upload.js';
import User from '../models/users.js';

/**
 * Student Controller
 * Handles student-specific operations
 */

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
export const getProfile = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  console.log('Fetching profile for student ID:', studentId);

  // Fetch student profile from database
  const student = await User.findByPk(studentId, {
    attributes: { exclude: ['password'] }
  });
  
  if (!student) {
    throw new AppError('Student profile not found', 404);
  }

  console.log('Student profile found:', student.toJSON());

  res.status(200).json({
    success: true,
    profile: student
  });
});

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
export const updateProfile = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const updates = req.body;

  // Fields that students can update (only existing database fields)
  const allowedUpdates = [
    'name', 'phone', 'cgpa', 'student_id', 'batch_year'
  ];

  // Filter out fields that are not allowed
  const filteredUpdates = {};
  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      filteredUpdates[key] = updates[key];
    }
  });

  // Update student in database
  const student = await User.findByPk(studentId);

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Update the fields
  Object.keys(filteredUpdates).forEach(key => {
    student[key] = filteredUpdates[key];
  });

  await student.save();

  // Return updated profile without password
  const updatedStudent = await User.findByPk(studentId, {
    attributes: { exclude: ['password'] }
  });

  // Log activity
  logActivity('PROFILE_UPDATED', studentId, { updates: Object.keys(filteredUpdates) });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    profile: updatedStudent
  });
});

// @desc    Upload/Update resume
// @route   POST /api/student/resume
// @access  Private (Student)
export const uploadResume = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  if (!req.file) {
    throw new AppError('Please upload a resume file', 400);
  }

  const resumePath = req.file.path;
  const resumeUrl = getFileUrl(req.file.filename, 'resumes');

  // TODO: Update student resume in database
  // const student = await User.findById(studentId);
  // if (!student) {
  //   throw new AppError('Student not found', 404);
  // }

  // Delete old resume if exists
  // if (student.resumeUrl) {
  //   const oldResumePath = path.join(process.cwd(), student.resumeUrl);
  //   deleteFile(oldResumePath);
  // }

  // student.resumeUrl = resumeUrl;
  // student.resumeUploadedAt = new Date();
  // await student.save();

  // Log activity
  logActivity('RESUME_UPLOADED', studentId, { filename: req.file.filename });

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    resumeUrl,
    filename: req.file.filename
  });
});

// @desc    Delete resume
// @route   DELETE /api/student/resume
// @access  Private (Student)
export const deleteResume = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  // TODO: Get student from database
  // const student = await User.findById(studentId);
  // if (!student || !student.resumeUrl) {
  //   throw new AppError('No resume found to delete', 404);
  // }

  // TODO: Delete file and update database
  // const resumePath = path.join(process.cwd(), student.resumeUrl);
  // deleteFile(resumePath);
  // student.resumeUrl = null;
  // await student.save();

  logActivity('RESUME_DELETED', studentId);

  res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

// @desc    Get active placement drives
// @route   GET /api/student/drives/active
// @access  Private (Student)
export const getActiveDrives = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  
  // TODO: Get student details for eligibility check
  // const student = await User.findById(studentId);

  // TODO: Fetch active drives from database with eligibility filtering
  // const drives = await Drive.find({
  //   status: 'active',
  //   applicationDeadline: { $gte: new Date() },
  //   'eligibilityCriteria.allowedDepartments': student.department,
  //   'eligibilityCriteria.minCGPA': { $lte: student.cgpa }
  // }).sort({ createdAt: -1 });

  // Mock active drives
  const drives = [
    {
      id: 'drive_1',
      companyName: 'Google',
      jobRole: 'Software Engineer',
      package: '25 LPA',
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science', 'IT'],
        maxBacklogs: 0
      },
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'drive_2',
      companyName: 'Microsoft',
      jobRole: 'SDE Intern',
      package: '80k/month',
      eligibilityCriteria: {
        minCGPA: 7.5,
        allowedDepartments: ['Computer Science', 'IT', 'ECE'],
        maxBacklogs: 0
      },
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    drives
  });
});

// @desc    Apply to placement drive
// @route   POST /api/student/drives/:driveId/apply
// @access  Private (Student)
export const applyToDrive = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const { driveId } = req.params;
  const { coverLetter } = req.body;

  // TODO: Check if student exists and has resume
  // const student = await User.findById(studentId);
  // if (!student.resumeUrl) {
  //   throw new AppError('Please upload your resume before applying', 400);
  // }

  // TODO: Check if drive exists and is active
  // const drive = await Drive.findById(driveId);
  // if (!drive) {
  //   throw new AppError('Placement drive not found', 404);
  // }
  // if (drive.status !== 'active') {
  //   throw new AppError('This drive is not accepting applications', 400);
  // }

  // TODO: Check eligibility
  // if (student.cgpa < drive.eligibilityCriteria.minCGPA) {
  //   throw new AppError('You do not meet the minimum CGPA requirement', 403);
  // }

  // TODO: Check if already applied
  // const existingApplication = await Application.findOne({ student: studentId, drive: driveId });
  // if (existingApplication) {
  //   throw new AppError('You have already applied to this drive', 400);
  // }

  // TODO: Create application
  // const application = await Application.create({
  //   student: studentId,
  //   drive: driveId,
  //   coverLetter,
  //   status: 'applied',
  //   appliedAt: new Date()
  // });

  // Log activity
  logActivity('APPLIED_TO_DRIVE', studentId, { driveId });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    application: {
      id: `app_${Date.now()}`,
      driveId,
      status: 'applied',
      appliedAt: new Date()
    }
  });
});

// @desc    Get my applications
// @route   GET /api/student/applications
// @access  Private (Student)
export const getMyApplications = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  // TODO: Fetch applications from database
  // const applications = await Application.find({ student: studentId })
  //   .populate('drive', 'companyName jobRole package status')
  //   .sort({ appliedAt: -1 });

  // Mock applications
  const applications = [
    {
      id: 'app_1',
      drive: {
        id: 'drive_1',
        companyName: 'Google',
        jobRole: 'Software Engineer',
        package: '25 LPA'
      },
      status: 'shortlisted',
      currentRound: 'Technical Interview',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'app_2',
      drive: {
        id: 'drive_2',
        companyName: 'Microsoft',
        jobRole: 'SDE Intern',
        package: '80k/month'
      },
      status: 'applied',
      currentRound: 'Resume Screening',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ];

  res.status(200).json({
    success: true,
    count: applications.length,
    applications
  });
});

// @desc    Get application status
// @route   GET /api/student/applications/:applicationId
// @access  Private (Student)
export const getApplicationStatus = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const { applicationId } = req.params;

  // TODO: Fetch application from database
  // const application = await Application.findOne({
  //   _id: applicationId,
  //   student: studentId
  // }).populate('drive', 'companyName jobRole package');

  // if (!application) {
  //   throw new AppError('Application not found', 404);
  // }

  // Mock application
  const application = {
    id: applicationId,
    drive: {
      companyName: 'Google',
      jobRole: 'Software Engineer',
      package: '25 LPA'
    },
    status: 'shortlisted',
    currentRound: 'Technical Interview',
    rounds: [
      { name: 'Resume Screening', status: 'cleared', date: new Date() },
      { name: 'Online Test', status: 'cleared', date: new Date() },
      { name: 'Technical Interview', status: 'pending', date: null }
    ],
    appliedAt: new Date(),
    lastUpdated: new Date()
  };

  res.status(200).json({
    success: true,
    application
  });
});

// @desc    Withdraw application
// @route   DELETE /api/student/applications/:applicationId
// @access  Private (Student)
export const withdrawApplication = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const { applicationId } = req.params;

  // TODO: Find and update application
  // const application = await Application.findOne({
  //   _id: applicationId,
  //   student: studentId
  // });

  // if (!application) {
  //   throw new AppError('Application not found', 404);
  // }

  // if (['selected', 'rejected'].includes(application.status)) {
  //   throw new AppError('Cannot withdraw application after final decision', 400);
  // }

  // application.status = 'withdrawn';
  // application.withdrawnAt = new Date();
  // await application.save();

  logActivity('APPLICATION_WITHDRAWN', studentId, { applicationId });

  res.status(200).json({
    success: true,
    message: 'Application withdrawn successfully'
  });
});

// @desc    Download offer letter
// @route   GET /api/student/offer-letter/:applicationId
// @access  Private (Student)
export const downloadOfferLetter = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const { applicationId } = req.params;

  // TODO: Find application with offer letter
  // const application = await Application.findOne({
  //   _id: applicationId,
  //   student: studentId,
  //   status: 'selected'
  // });

  // if (!application || !application.offerLetterUrl) {
  //   throw new AppError('Offer letter not available', 404);
  // }

  // TODO: Send file for download
  // const filePath = path.join(process.cwd(), application.offerLetterUrl);
  // res.download(filePath);

  res.status(200).json({
    success: true,
    message: 'Offer letter download initiated',
    offerLetterUrl: '/uploads/offers/offer-letter-123.pdf'
  });
});

// @desc    Get student dashboard statistics
// @route   GET /api/student/dashboard
// @access  Private (Student)
export const getDashboard = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  // TODO: Fetch dashboard data from database
  // const totalApplications = await Application.countDocuments({ student: studentId });
  // const activeApplications = await Application.countDocuments({ 
  //   student: studentId, 
  //   status: { $in: ['applied', 'shortlisted'] } 
  // });
  // const offers = await Application.countDocuments({ 
  //   student: studentId, 
  //   status: 'selected' 
  // });
  // const activeDrives = await Drive.countDocuments({ status: 'active' });

  // Mock dashboard data
  const dashboardData = {
    totalApplications: 5,
    activeApplications: 3,
    offers: 1,
    rejected: 1,
    activeDrives: 8,
    profileComplete: 85,
    recentActivity: [
      {
        type: 'application',
        message: 'Applied to Google - Software Engineer',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'status_update',
        message: 'Shortlisted for Microsoft Technical Interview',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
  };

  res.status(200).json({
    success: true,
    dashboard: dashboardData
  });
});

export default {
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
  getActiveDrives,
  applyToDrive,
  getMyApplications,
  getApplicationStatus,
  withdrawApplication,
  downloadOfferLetter,
  getDashboard
};
