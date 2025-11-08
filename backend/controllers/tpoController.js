import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';
import { sendApplicationStatusEmail, sendNewDriveNotification, sendOfferLetterEmail, sendBulkNotification } from '../lib/emailService.js';
import Company from '../models/company.js';
import Drive from '../models/drive.js';
import Application from '../models/application.js';
import User from '../models/users.js';
import StudentSkill from '../models/studentSkills.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

/**
 * TPO (Training & Placement Officer) Controller
 * Handles placement drives, companies, and overall system management
 */

// @desc    Create new placement drive
// @route   POST /api/tpo/drives
// @access  Private (TPO)
export const createDrive = asyncHandler(async (req, res, next) => {
  const {
    companyId,
    companyName,
    jobRole,
    jobDescription,
    package: packageOffered,
    jobType,
    eligibilityCriteria,
    applicationDeadline,
    driveDate,
    location,
  } = req.body;

  // Validate company exists
  const company = await Company.findByPk(companyId);
  if (!company) {
    throw new AppError('Company not found. Please add company first.', 404);
  }

  // Create drive in database
  const drive = await Drive.create({
    company_id: companyId,
    company_name: companyName || company.name,
    job_role: jobRole,
    job_description: jobDescription,
    package: packageOffered,
    job_type: jobType || 'FULL_TIME',
    min_cgpa: eligibilityCriteria?.minCGPA || 6.0,
    allowed_departments: eligibilityCriteria?.allowedDepartments || [],
    max_backlogs: eligibilityCriteria?.maxBacklogs || 0,
    graduation_years: eligibilityCriteria?.graduationYears || [],
    application_deadline: applicationDeadline,
    drive_date: driveDate,
    location: location,
    status: 'ACTIVE',
    created_by: req.user.id
  });

  // Notify eligible students about new drive
  try {
    const whereClause = {
      role: 'STUDENT',
      profile_status: 'APPROVED'
    };

    if (drive.allowed_departments && drive.allowed_departments.length > 0) {
      whereClause.department = { [Op.in]: drive.allowed_departments };
    }

    if (drive.min_cgpa) {
      whereClause.cgpa = { [Op.gte]: drive.min_cgpa };
    }

    const eligibleStudents = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email']
    });

    if (eligibleStudents.length > 0) {
      // Send notification emails in background (don't wait)
      const emailPromises = eligibleStudents.map(student => 
        sendNewDriveNotification(student, {
          companyName: drive.company_name,
          jobRole: drive.job_role,
          package: drive.package,
          deadline: drive.application_deadline,
          driveDate: drive.drive_date,
          location: drive.location,
          minCGPA: drive.min_cgpa
        })
      );

      Promise.allSettled(emailPromises).then(results => {
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        logInfo('New drive notifications sent', { 
          driveId: drive.id, 
          totalEligible: eligibleStudents.length,
          successCount 
        });
      });
    }
  } catch (error) {
    logInfo('Failed to send new drive notifications', { 
      driveId: drive.id, 
      error: error.message 
    });
    // Don't fail drive creation if email fails
  }

  // Log activity
  logActivity('DRIVE_CREATED', req.user.id, { companyName, jobRole, driveId: drive.id });

  res.status(201).json({
    success: true,
    message: 'Placement drive created successfully and notifications sent to eligible students',
    drive: {
      id: drive.id,
      companyName: drive.company_name,
      jobRole: drive.job_role,
      status: drive.status,
      createdAt: drive.createdAt
    }
  });
});

// @desc    Update placement drive
// @route   PUT /api/tpo/drives/:driveId
// @access  Private (TPO)
export const updateDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;
  const updates = req.body;

  // Find and update drive
  const drive = await Drive.findByPk(driveId);
  if (!drive) {
    throw new AppError('Placement drive not found', 404);
  }

  if (drive.status === 'CLOSED') {
    throw new AppError('Cannot update closed drive', 400);
  }

  // Update drive fields
  await drive.update({
    job_role: updates.jobRole || drive.job_role,
    job_description: updates.jobDescription || drive.job_description,
    package: updates.package || drive.package,
    min_cgpa: updates.eligibilityCriteria?.minCGPA || drive.min_cgpa,
    allowed_departments: updates.eligibilityCriteria?.allowedDepartments || drive.allowed_departments,
    max_backlogs: updates.eligibilityCriteria?.maxBacklogs || drive.max_backlogs,
    graduation_years: updates.eligibilityCriteria?.graduationYears || drive.graduation_years,
    application_deadline: updates.applicationDeadline || drive.application_deadline,
    drive_date: updates.driveDate || drive.drive_date,
    location: updates.location || drive.location,
    status: updates.status || drive.status,
  });

  logActivity('DRIVE_UPDATED', req.user.id, { driveId });

  res.status(200).json({
    success: true,
    message: 'Drive updated successfully',
    drive: {
      id: drive.id,
      companyName: drive.company_name,
      jobRole: drive.job_role,
      status: drive.status,
      updatedAt: drive.updatedAt
    }
  });
});

// @desc    Delete placement drive
// @route   DELETE /api/tpo/drives/:driveId
// @access  Private (TPO)
export const deleteDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // Check if drive exists
  const drive = await Drive.findByPk(driveId);
  if (!drive) {
    throw new AppError('Placement drive not found', 404);
  }

  // Check if drive has applications
  const applicationCount = await Application.count({ where: { drive_id: driveId } });
  if (applicationCount > 0) {
    throw new AppError('Cannot delete drive with existing applications', 400);
  }

  await drive.destroy();

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

  // Build query
  const where = {};
  if (status) where.status = status.toUpperCase();
  if (search) {
    where[Op.or] = [
      { company_name: { [Op.like]: `%${search}%` } },
      { job_role: { [Op.like]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: drives } = await Drive.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry']
      }
    ]
  });

  // Get application counts for each drive
  const drivesWithCounts = await Promise.all(drives.map(async (drive) => {
    const applicationsCount = await Application.count({ where: { drive_id: drive.id } });
    return {
      id: drive.id,
      companyName: drive.company_name,
      jobRole: drive.job_role,
      package: drive.package,
      status: drive.status,
      applicationsCount,
      driveDate: drive.drive_date,
      applicationDeadline: drive.application_deadline,
      createdAt: drive.createdAt
    };
  }));

  res.status(200).json({
    success: true,
    count: drivesWithCounts.length,
    total: count,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    drives: drivesWithCounts
  });
});

// @desc    Close/End placement drive
// @route   PUT /api/tpo/drives/:driveId/close
// @access  Private (TPO)
export const closeDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // Update drive status
  const drive = await Drive.findByPk(driveId);
  if (!drive) {
    throw new AppError('Drive not found', 404);
  }

  drive.status = 'CLOSED';
  drive.closed_at = new Date();
  drive.closed_by = req.user.id;
  await drive.save();

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

  // Check if company already exists
  const existingCompany = await Company.findOne({ where: { name } });
  if (existingCompany) {
    throw new AppError('Company already exists', 400);
  }

  // Create company
  const company = await Company.create({
    name,
    description,
    website,
    industry,
    location,
    contact_person: contactPerson,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    added_by: req.user.id
  });

  logActivity('COMPANY_ADDED', req.user.id, { companyName: name });

  res.status(201).json({
    success: true,
    message: 'Company added successfully',
    company: {
      id: company.id,
      name: company.name,
      website: company.website,
      industry: company.industry,
      createdAt: company.createdAt
    }
  });
});

// @desc    Get all companies
// @route   GET /api/tpo/companies
// @access  Private (TPO)
export const getAllCompanies = asyncHandler(async (req, res, next) => {
  // Fetch companies from database
  const companies = await Company.findAll({
    where: { is_active: true },
    order: [['name', 'ASC']],
    attributes: ['id', 'name', 'industry', 'website', 'location', 'createdAt']
  });

  // Get drive counts for each company
  const companiesWithDrives = await Promise.all(companies.map(async (company) => {
    const totalDrives = await Drive.count({ where: { company_id: company.id } });
    return {
      id: company.id,
      name: company.name,
      industry: company.industry,
      website: company.website,
      location: company.location,
      totalDrives,
      createdAt: company.createdAt
    };
  }));

  res.status(200).json({
    success: true,
    count: companiesWithDrives.length,
    companies: companiesWithDrives
  });
});

// @desc    Get applications for a specific drive
// @route   GET /api/tpo/drives/:driveId/applications
// @access  Private (TPO)
export const getApplicationsForDrive = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;
  const { status, page = 1, limit = 20 } = req.query;

  // Build query
  const where = { drive_id: driveId };
  if (status) where.status = status.toUpperCase();

  const offset = (page - 1) * limit;

  const { count, rows: applications } = await Application.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: offset,
    order: [['applied_at', 'DESC']],
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'student_id', 'cgpa', 'resume_path', 'department', 'batch_year']
      }
    ]
  });

  const formattedApplications = applications.map(app => ({
    id: app.id,
    student: {
      id: app.student.id,
      name: app.student.name,
      email: app.student.email,
      rollNumber: app.student.student_id,
      cgpa: app.student.cgpa,
      department: app.student.department,
      batchYear: app.student.batch_year,
      resumeUrl: app.student.resume_path
    },
    status: app.status,
    currentRound: app.current_round,
    feedback: app.feedback,
    offerLetterPath: app.offer_letter_path,
    appliedAt: app.applied_at
  }));

  res.status(200).json({
    success: true,
    count: formattedApplications.length,
    total: count,
    page: parseInt(page),
    applications: formattedApplications
  });
});

// @desc    Update application status
// @route   PUT /api/tpo/applications/:applicationId/status
// @access  Private (TPO)
export const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { status, round, feedback } = req.body;

  const validStatuses = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'ON_HOLD'];
  if (!validStatuses.includes(status.toUpperCase())) {
    throw new AppError('Invalid status', 400);
  }

  // Update application
  const application = await Application.findByPk(applicationId, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Drive,
        as: 'drive',
        attributes: ['id', 'company_name', 'job_role']
      }
    ]
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  application.status = status.toUpperCase();
  application.current_round = round;
  application.feedback = feedback;
  application.last_updated = new Date();
  await application.save();

  // Send email notification to student
  try {
    await sendApplicationStatusEmail(
      application.student, 
      {
        id: application.id,
        companyName: application.drive.company_name,
        jobRole: application.drive.job_role,
        status: application.status
      }, 
      status, 
      feedback
    );
    logInfo('Application status email sent successfully', { 
      applicationId, 
      studentEmail: application.student.email, 
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
      id: application.id,
      status: application.status,
      round: application.current_round,
      updatedAt: application.last_updated
    }
  });
});

// @desc    Bulk update application status
// @route   PUT /api/tpo/applications/bulk-update
// @access  Private (TPO)
export const bulkUpdateStatus = asyncHandler(async (req, res, next) => {
  const { applicationIds, status, round, comments } = req.body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new AppError('Please provide application IDs', 400);
  }

  // Bulk update applications
  await Application.update(
    { 
      status: status.toUpperCase(), 
      current_round: round, 
      feedback: comments,
      last_updated: new Date() 
    },
    { where: { id: { [Op.in]: applicationIds } } }
  );

  // Send bulk emails to all students
  let emailsSent = 0;
  const applications = await Application.findAll({
    where: { id: { [Op.in]: applicationIds } },
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Drive,
        as: 'drive',
        attributes: ['company_name', 'job_role']
      }
    ]
  });

  const emailPromises = applications.map(async (app) => {
    try {
      await sendApplicationStatusEmail(
        app.student, 
        {
          id: app.id,
          companyName: app.drive.company_name,
          jobRole: app.drive.job_role,
          status: status
        }, 
        status, 
        comments || ''
      );
      emailsSent++;
      return true;
    } catch (error) {
      logInfo('Failed to send bulk email', { applicationId: app.id, error: error.message });
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
  const offerLetterPath = req.file.path;

  // Update application with offer letter
  const application = await Application.findByPk(applicationId, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email']
      },
      {
        model: Drive,
        as: 'drive',
        attributes: ['company_name', 'job_role', 'package']
      }
    ]
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.status !== 'SELECTED') {
    throw new AppError('Can only upload offer letter for selected candidates', 400);
  }

  application.offer_letter_path = offerLetterUrl;
  application.offer_letter_uploaded_at = new Date();
  await application.save();

  // Send email with offer letter attachment
  try {
    await sendOfferLetterEmail(
      application.student,
      {
        companyName: application.drive.company_name,
        jobRole: application.drive.job_role,
        package: application.drive.package
      },
      offerLetterPath
    );
    logInfo('Offer letter email sent successfully', { 
      applicationId, 
      studentEmail: application.student.email 
    });
  } catch (error) {
    logInfo('Failed to send offer letter email', { 
      applicationId, 
      error: error.message 
    });
    // Don't fail the upload if email fails
  }

  logActivity('OFFER_LETTER_UPLOADED', req.user.id, { applicationId });

  res.status(200).json({
    success: true,
    message: 'Offer letter uploaded successfully and email sent to student',
    offerLetterUrl
  });
});

// @desc    Send email notification
// @route   POST /api/tpo/notifications/send
// @access  Private (TPO)
export const sendNotification = asyncHandler(async (req, res, next) => {
  const { type, department, driveId, subject, message, recipients: customRecipients } = req.body;

  if (!subject || !message) {
    throw new AppError('Subject and message are required', 400);
  }

  let emails = [];
  let driveDetails = null;

  // Build recipient list based on type
  if (type === 'all-students') {
    const students = await User.findAll({ 
      where: { role: 'STUDENT', profile_status: 'APPROVED' },
      attributes: ['email']
    });
    emails = students.map(s => s.email);
  } else if (type === 'department') {
    if (!department) {
      throw new AppError('Department is required for department notifications', 400);
    }
    const students = await User.findAll({ 
      where: { 
        role: 'STUDENT', 
        department: department,
        profile_status: 'APPROVED'
      },
      attributes: ['email']
    });
    emails = students.map(s => s.email);
  } else if (type === 'drive-applicants') {
    if (!driveId) {
      throw new AppError('Drive ID is required for drive applicant notifications', 400);
    }
    
    // Get drive details
    const drive = await Drive.findByPk(driveId);
    if (drive) {
      driveDetails = {
        companyName: drive.company_name,
        jobRole: drive.job_role,
        package: drive.package,
        deadline: drive.application_deadline
      };
    }

    // Get all students who applied to this drive
    const applications = await Application.findAll({
      where: { drive_id: driveId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['email']
        }
      ]
    });
    emails = applications.map(app => app.student.email);
  } else if (type === 'eligible-students' && driveId) {
    // Notify students eligible for a specific drive
    const drive = await Drive.findByPk(driveId);
    if (!drive) {
      throw new AppError('Drive not found', 404);
    }

    driveDetails = {
      companyName: drive.company_name,
      jobRole: drive.job_role,
      package: drive.package,
      deadline: drive.application_deadline
    };

    // Find eligible students based on drive criteria
    const whereClause = {
      role: 'STUDENT',
      profile_status: 'APPROVED'
    };

    if (drive.allowed_departments && drive.allowed_departments.length > 0) {
      whereClause.department = { [Op.in]: drive.allowed_departments };
    }

    if (drive.min_cgpa) {
      whereClause.cgpa = { [Op.gte]: drive.min_cgpa };
    }

    const students = await User.findAll({ 
      where: whereClause,
      attributes: ['email']
    });
    emails = students.map(s => s.email);
  } else if (type === 'custom' && Array.isArray(customRecipients)) {
    emails = customRecipients;
  } else {
    throw new AppError('Invalid notification type or missing parameters', 400);
  }

  if (emails.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No recipients found matching the criteria',
      recipientCount: 0
    });
  }

  // Send bulk emails
  const results = await sendBulkNotification(emails, subject, message, driveDetails);
  
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  logActivity('NOTIFICATION_SENT', req.user.id, { 
    type, 
    totalRecipients: emails.length,
    successCount,
    failureCount
  });

  res.status(200).json({
    success: true,
    message: `Notification sent successfully`,
    recipientCount: emails.length,
    successCount,
    failureCount,
    details: failureCount > 0 ? results.filter(r => !r.success) : undefined
  });
});

// @desc    Get TPO dashboard statistics
// @route   GET /api/tpo/dashboard
// @access  Private (TPO)
export const getDashboard = asyncHandler(async (req, res, next) => {
  // Aggregate dashboard statistics
  const totalDrives = await Drive.count();
  const activeDrives = await Drive.count({ where: { status: 'ACTIVE' } });
  const closedDrives = await Drive.count({ where: { status: 'CLOSED' } });
  const totalApplications = await Application.count();
  const totalStudents = await User.count({ where: { role: 'STUDENT' } });
  const approvedStudents = await User.count({ where: { role: 'STUDENT', profile_status: 'APPROVED' } });
  const pendingApprovals = await User.count({ where: { role: 'STUDENT', profile_status: 'PENDING' } });
  const placedStudents = await Application.count({ where: { status: 'SELECTED' } });
  const totalCompanies = await Company.count({ where: { is_active: true } });

  const placementPercentage = approvedStudents > 0 
    ? ((placedStudents / approvedStudents) * 100).toFixed(2) 
    : 0;

  // Get recent drives
  const recentDrives = await Drive.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'company_name', 'job_role', 'status', 'createdAt']
  });

  const drivesWithCounts = await Promise.all(recentDrives.map(async (drive) => {
    const applicationsCount = await Application.count({ where: { drive_id: drive.id } });
    return {
      id: drive.id,
      companyName: drive.company_name,
      jobRole: drive.job_role,
      applicationsCount,
      status: drive.status
    };
  }));

  // Get recent applications
  const recentApplications = await Application.findAll({
    limit: 5,
    order: [['applied_at', 'DESC']],
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['name']
      },
      {
        model: Drive,
        as: 'drive',
        attributes: ['company_name']
      }
    ]
  });

  const formattedApplications = recentApplications.map(app => ({
    studentName: app.student.name,
    companyName: app.drive.company_name,
    status: app.status,
    appliedAt: app.applied_at
  }));

  const dashboardData = {
    totalDrives,
    activeDrives,
    closedDrives,
    totalApplications,
    totalStudents,
    approvedStudents,
    pendingApprovals,
    placedStudents,
    placementPercentage: parseFloat(placementPercentage),
    totalCompanies,
    recentDrives: drivesWithCounts,
    recentApplications: formattedApplications
  };

  res.status(200).json({
    success: true,
    dashboard: dashboardData
  });
});

// @desc    Get pending student signups
// @route   GET /api/tpo/students/pending
// @access  Private (TPO)
export const getPendingStudents = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, department } = req.query;

  const where = { 
    role: 'STUDENT', 
    profile_status: 'PENDING' 
  };
  
  if (department) where.department = department;

  const offset = (page - 1) * limit;

  const { count, rows: students } = await User.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'email', 'student_id', 'department', 'batch_year', 'cgpa', 'phone', 'createdAt']
  });

  res.status(200).json({
    success: true,
    count: students.length,
    total: count,
    page: parseInt(page),
    students
  });
});

// @desc    Approve student signup
// @route   PUT /api/tpo/students/:studentId/approve
// @access  Private (TPO)
export const approveStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { status } = req.body; // 'APPROVED' or 'REJECTED'

  const student = await User.findByPk(studentId);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  if (student.role !== 'STUDENT') {
    throw new AppError('User is not a student', 400);
  }

  student.profile_status = status;
  await student.save();

  logActivity('STUDENT_APPROVAL', req.user.id, { studentId, status });

  res.status(200).json({
    success: true,
    message: `Student ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`,
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      status: student.profile_status
    }
  });
});

// @desc    Get all students with filters
// @route   GET /api/tpo/students
// @access  Private (TPO)
export const getAllStudents = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, department, status, search } = req.query;

  const where = { role: 'STUDENT' };
  
  if (department) where.department = department;
  if (status) where.profile_status = status.toUpperCase();
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { student_id: { [Op.like]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: students } = await User.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'email', 'student_id', 'department', 'batch_year', 'cgpa', 'phone', 'profile_status', 'resume_path', 'ats_score', 'is_approved'],
    include: [
      {
        model: StudentSkill,
        as: 'skills',
        attributes: ['skill_name', 'skill_category', 'proficiency_level'],
        required: false
      }
    ]
  });

  res.status(200).json({
    success: true,
    count: students.length,
    total: count,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    students
  });
});

// @desc    Update student profile (by TPO)
// @route   PUT /api/tpo/students/:studentId
// @access  Private (TPO)
export const updateStudentProfile = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const updates = req.body;

  const student = await User.findByPk(studentId);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  if (student.role !== 'STUDENT') {
    throw new AppError('User is not a student', 400);
  }

  // Update allowed fields
  const allowedFields = ['name', 'email', 'phone', 'department', 'batch_year', 'cgpa', 'profile_status'];
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      student[field] = updates[field];
    }
  });

  await student.save();

  logActivity('STUDENT_PROFILE_UPDATED', req.user.id, { studentId });

  res.status(200).json({
    success: true,
    message: 'Student profile updated successfully',
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department,
      cgpa: student.cgpa
    }
  });
});

// @desc    Generate placement report (Excel)
// @route   GET /api/tpo/reports/excel
// @access  Private (TPO)
export const generateExcelReport = asyncHandler(async (req, res, next) => {
  const { department, batchYear } = req.query;

  // Fetch placed students
  const where = { role: 'STUDENT' };
  if (department) where.department = department;
  if (batchYear) where.batch_year = batchYear;

  const students = await User.findAll({
    where,
    include: [
      {
        model: Application,
        as: 'applications',
        where: { status: 'SELECTED' },
        required: true,
        include: [
          {
            model: Drive,
            as: 'drive',
            attributes: ['company_name', 'job_role', 'package']
          }
        ]
      }
    ],
    attributes: ['id', 'name', 'email', 'student_id', 'department', 'batch_year', 'cgpa']
  });

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Placement Report');

  // Add headers
  worksheet.columns = [
    { header: 'Student ID', key: 'student_id', width: 15 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Batch Year', key: 'batch_year', width: 12 },
    { header: 'CGPA', key: 'cgpa', width: 10 },
    { header: 'Company', key: 'company', width: 25 },
    { header: 'Job Role', key: 'job_role', width: 20 },
    { header: 'Package', key: 'package', width: 15 }
  ];

  // Add data
  students.forEach(student => {
    student.applications.forEach(app => {
      worksheet.addRow({
        student_id: student.student_id,
        name: student.name,
        email: student.email,
        department: student.department,
        batch_year: student.batch_year,
        cgpa: student.cgpa,
        company: app.drive.company_name,
        job_role: app.drive.job_role,
        package: app.drive.package
      });
    });
  });

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=placement-report-${Date.now()}.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);
  res.end();

  logActivity('EXCEL_REPORT_GENERATED', req.user.id, { department, batchYear });
});

// @desc    Generate placement report (PDF)
// @route   GET /api/tpo/reports/pdf
// @access  Private (TPO)
export const generatePDFReport = asyncHandler(async (req, res, next) => {
  const { department, batchYear } = req.query;

  // Fetch placement statistics
  const where = { role: 'STUDENT' };
  if (department) where.department = department;
  if (batchYear) where.batch_year = batchYear;

  const totalStudents = await User.count({ where });
  const placedStudents = await Application.count({
    where: { status: 'SELECTED' },
    include: [
      {
        model: User,
        as: 'student',
        where,
        attributes: []
      }
    ]
  });

  const placementPercentage = totalStudents > 0 
    ? ((placedStudents / totalStudents) * 100).toFixed(2) 
    : 0;

  // Fetch placed students details
  const students = await User.findAll({
    where,
    include: [
      {
        model: Application,
        as: 'applications',
        where: { status: 'SELECTED' },
        required: true,
        include: [
          {
            model: Drive,
            as: 'drive',
            attributes: ['company_name', 'job_role', 'package']
          }
        ]
      }
    ],
    attributes: ['name', 'student_id', 'department', 'cgpa']
  });

  // Create PDF
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=placement-report-${Date.now()}.pdf`);

  // Pipe PDF to response
  doc.pipe(res);

  // Add content
  doc.fontSize(20).text('Placement Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(2);

  // Statistics
  doc.fontSize(14).text('Statistics', { underline: true });
  doc.moveDown();
  doc.fontSize(11).text(`Total Students: ${totalStudents}`);
  doc.text(`Placed Students: ${placedStudents}`);
  doc.text(`Placement Percentage: ${placementPercentage}%`);
  if (department) doc.text(`Department: ${department}`);
  if (batchYear) doc.text(`Batch Year: ${batchYear}`);
  doc.moveDown(2);

  // Placed Students List
  doc.fontSize(14).text('Placed Students', { underline: true });
  doc.moveDown();

  students.forEach((student, index) => {
    student.applications.forEach(app => {
      doc.fontSize(10);
      doc.text(`${index + 1}. ${student.name} (${student.student_id})`, { continued: false });
      doc.text(`   Department: ${student.department} | CGPA: ${student.cgpa}`);
      doc.text(`   Company: ${app.drive.company_name} | Role: ${app.drive.job_role} | Package: ${app.drive.package}`);
      doc.moveDown(0.5);
    });
  });

  // Finalize PDF
  doc.end();

  logActivity('PDF_REPORT_GENERATED', req.user.id, { department, batchYear });
});

// @desc    Filter students by skills/tech stack
// @route   GET /api/tpo/students/filter-by-skills
// @access  Private (TPO)
export const filterStudentsBySkills = asyncHandler(async (req, res, next) => {
  const { skills, department, batchYear, minCgpa, matchType = 'any' } = req.query;

  if (!skills) {
    throw new AppError('Please provide skills to filter', 400);
  }

  // Parse skills (comma-separated)
  const skillList = skills.split(',').map(s => s.trim().toLowerCase());

  // Build base where clause
  const whereClause = {
    role: 'STUDENT',
    profile_status: 'APPROVED'
  };

  if (department) whereClause.department = department;
  if (batchYear) whereClause.batch_year = parseInt(batchYear);
  if (minCgpa) whereClause.cgpa = { [Op.gte]: parseFloat(minCgpa) };

  // Find students with matching skills
  let studentSkillsQuery = {
    where: {
      skill_name: {
        [Op.iLike]: { [Op.any]: skillList.map(skill => `%${skill}%`) }
      }
    },
    attributes: ['student_id'],
    group: ['student_id'],
    raw: true
  };

  if (matchType === 'all') {
    // Student must have ALL specified skills
    studentSkillsQuery.having = sequelize.literal(`COUNT(DISTINCT LOWER(skill_name)) >= ${skillList.length}`);
  }

  const studentsWithSkills = await StudentSkill.findAll(studentSkillsQuery);
  const studentIds = studentsWithSkills.map(s => s.student_id);

  if (studentIds.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No students found with specified skills',
      students: [],
      totalCount: 0
    });
  }

  // Fetch student details with their skills
  whereClause.id = { [Op.in]: studentIds };

  const students = await User.findAll({
    where: whereClause,
    attributes: ['id', 'name', 'email', 'student_id', 'department', 'batch_year', 'cgpa', 'phone', 'ats_score', 'resume_path'],
    include: [
      {
        model: StudentSkill,
        as: 'skills',
        attributes: ['skill_name', 'skill_category', 'proficiency_level'],
        required: false
      }
    ],
    order: [['ats_score', 'DESC NULLS LAST'], ['cgpa', 'DESC']]
  });

  // Format response
  const formattedStudents = students.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email,
    studentId: student.student_id,
    department: student.department,
    batchYear: student.batch_year,
    cgpa: student.cgpa,
    phone: student.phone,
    atsScore: student.ats_score,
    hasResume: !!student.resume_path,
    skills: student.skills || [],
    matchedSkills: (student.skills || [])
      .filter(skill => skillList.some(searchSkill => 
        skill.skill_name.toLowerCase().includes(searchSkill)
      ))
      .map(s => s.skill_name)
  }));

  res.status(200).json({
    success: true,
    totalCount: formattedStudents.length,
    filterCriteria: {
      skills: skillList,
      matchType,
      department: department || 'all',
      batchYear: batchYear || 'all',
      minCgpa: minCgpa || 'any'
    },
    students: formattedStudents
  });
});

// @desc    Get all unique skills from database
// @route   GET /api/tpo/skills/all
// @access  Private (TPO)
export const getAllSkills = asyncHandler(async (req, res, next) => {
  const { category } = req.query;

  const whereClause = {};
  if (category) whereClause.skill_category = category;

  const skills = await StudentSkill.findAll({
    where: whereClause,
    attributes: [
      'skill_name',
      'skill_category',
      [sequelize.fn('COUNT', sequelize.col('student_id')), 'student_count']
    ],
    group: ['skill_name', 'skill_category'],
    order: [[sequelize.literal('student_count'), 'DESC']]
  });

  res.status(200).json({
    success: true,
    totalSkills: skills.length,
    skills: skills.map(s => ({
      name: s.skill_name,
      category: s.skill_category,
      studentCount: parseInt(s.dataValues.student_count)
    }))
  });
});
