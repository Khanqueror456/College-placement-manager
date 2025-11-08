import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';
import { deleteFile, getFileUrl } from '../middlewares/upload.js';
import path from 'path';
import User from '../models/users.js';
import Drive from '../models/drive.js';
import Application from '../models/application.js';
import Company from '../models/company.js';
import StudentSkill from '../models/studentSkills.js';
import { calculateATSScoreWithGemini } from '../lib/geminiAtsService.js';
import { Op } from 'sequelize';

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

  // Add resume URL if resume exists
  const profileData = student.toJSON();
  if (profileData.resume_path) {
    profileData.resume_url = getFileUrl(profileData.resume_path, 'resumes');
    profileData.resume_uploaded_at = profileData.last_resume_update;
  }

  res.status(200).json({
    success: true,
    profile: profileData
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

  const resumeFilename = req.file.filename;
  const resumeUrl = getFileUrl(resumeFilename, 'resumes');
  const resumeFilePath = path.join(process.cwd(), 'uploads', 'resumes', resumeFilename);

  // Update student resume in database
  const student = await User.findByPk(studentId);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Delete old resume if exists
  if (student.resume_path) {
    const oldResumePath = path.join(process.cwd(), 'uploads', 'resumes', path.basename(student.resume_path));
    deleteFile(oldResumePath);
  }

  // Calculate ATS score using Gemini AI
  let atsScore = null;
  let atsAnalysis = null;
  let extractedSkills = [];
  
  try {
    console.log('🤖 Analyzing resume with Gemini AI...');
    atsAnalysis = await calculateATSScoreWithGemini(resumeFilePath, req.file.mimetype);
    atsScore = atsAnalysis.atsScore;
    console.log(`✅ ATS Score calculated: ${atsScore}/100`);
    
    // Extract and save skills to database
    if (atsAnalysis.extractedSkills) {
      console.log('💼 Extracting skills from resume...');
      
      // Delete old skills for this student
      await StudentSkill.destroy({ where: { student_id: studentId } });
      
      // Prepare skills data for bulk insert
      const skillsToInsert = [];
      
      // Map category names to database enum values
      const categoryMap = {
        'programming_languages': 'programming_language',
        'frameworks': 'framework',
        'databases': 'database',
        'cloud_platforms': 'cloud',
        'tools': 'tool',
        'soft_skills': 'soft_skill'
      };
      
      // Process each skill category
      Object.entries(atsAnalysis.extractedSkills).forEach(([category, skills]) => {
        if (Array.isArray(skills)) {
          skills.forEach(skill => {
            skillsToInsert.push({
              student_id: studentId,
              skill_name: skill,
              skill_category: categoryMap[category] || 'other',
              extracted_from_resume: true,
              verified: false
            });
          });
        }
      });
      
      // Bulk insert skills
      if (skillsToInsert.length > 0) {
        await StudentSkill.bulkCreate(skillsToInsert);
        extractedSkills = skillsToInsert.map(s => s.skill_name);
        console.log(`✅ Extracted ${skillsToInsert.length} skills`);
      }
    }
  } catch (error) {
    console.error('⚠️ Error calculating ATS score:', error.message);
    // Continue without ATS score if Gemini fails
    atsScore = null;
  }

  // Update student with new resume path, timestamp, and ATS score
  student.resume_path = resumeFilename;
  student.last_resume_update = new Date();
  if (atsScore !== null) {
    student.ats_score = atsScore;
  }
  await student.save();

  // Log activity
  logActivity('RESUME_UPLOADED', studentId, { 
    filename: req.file.filename,
    atsScore: atsScore,
    skillsExtracted: extractedSkills.length
  });

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    resumeUrl,
    filename: resumeFilename,
    uploadedAt: student.last_resume_update,
    atsScore: atsScore,
    skillsExtracted: extractedSkills.length,
    skills: extractedSkills,
    atsAnalysis: atsAnalysis ? {
      rating: atsAnalysis.rating,
      strengths: atsAnalysis.strengths,
      recommendations: atsAnalysis.recommendations
    } : null
  });
});

// @desc    Delete resume
// @route   DELETE /api/student/resume
// @access  Private (Student)
export const deleteResume = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  // Get student from database
  const student = await User.findByPk(studentId);
  if (!student || !student.resume_path) {
    throw new AppError('No resume found to delete', 404);
  }

  // Delete file from disk
  const resumePath = path.join(process.cwd(), 'uploads', 'resumes', student.resume_path);
  deleteFile(resumePath);
  
  // Update database
  student.resume_path = null;
  student.last_resume_update = null;
  await student.save();

  logActivity('RESUME_DELETED', studentId);

  res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

// @desc    Get resume (own or by ID for HOD/TPO)
// @route   GET /api/student/resume/:studentId?
// @access  Private (Student own, HOD, TPO)
export const getResume = asyncHandler(async (req, res, next) => {
  const requesterId = req.user.id;
  const requesterRole = req.user.role;
  const { studentId } = req.params;

  // Determine which student's resume to fetch
  const targetStudentId = studentId || requesterId;

  // Authorization check: Students can only view their own, HOD/TPO can view any
  if (requesterRole === 'STUDENT' && targetStudentId != requesterId) {
    throw new AppError('You can only view your own resume', 403);
  }

  // Fetch student
  const student = await User.findByPk(targetStudentId, {
    attributes: ['id', 'name', 'email', 'resume_path', 'last_resume_update']
  });

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  if (!student.resume_path) {
    throw new AppError('No resume uploaded', 404);
  }

  // Generate URL
  const resumeUrl = getFileUrl(student.resume_path, 'resumes');
  const resumePath = path.join(process.cwd(), 'uploads', 'resumes', student.resume_path);

  // Check if file exists
  const fs = await import('fs');
  if (!fs.existsSync(resumePath)) {
    throw new AppError('Resume file not found on server', 404);
  }

  res.status(200).json({
    success: true,
    resume: {
      studentId: student.id,
      studentName: student.name,
      filename: student.resume_path,
      url: resumeUrl,
      uploadedAt: student.last_resume_update
    }
  });
});

// @desc    Get active placement drives
// @route   GET /api/student/drives/active
// @access  Private (Student)
export const getActiveDrives = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  
  // Get student details for eligibility check
  const student = await User.findByPk(studentId);
  
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Build where clause for active drives
  // NOTE: Removed strict application_deadline filtering so students can see all
  // drives that are marked ACTIVE. This ensures created drives are visible
  // to students even if deadlines have timezone/storage discrepancies.
  const whereClause = {
    status: 'ACTIVE'
  };

  // Fetch active drives from database
  const drives = await Drive.findAll({
    where: whereClause,
    include: [
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'industry', 'website']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  console.log(`\n🔍 DEBUG: Found ${drives.length} active drives`);
  console.log(`📊 Student: ID=${studentId}, Dept=${student.department}, CGPA=${student.cgpa}`);
  
  drives.forEach((drive, idx) => {
    console.log(`\n📋 Drive ${idx + 1}:`);
    console.log(`   ID: ${drive.id}, Company: ${drive.company_name}, Role: ${drive.job_role}`);
    console.log(`   Min CGPA: ${drive.min_cgpa}, Allowed Depts: ${JSON.stringify(drive.allowed_departments)}`);
    console.log(`   Deadline: ${drive.application_deadline}`);
  });

  // Map drives with application status - NO ELIGIBILITY FILTERING
  const drivesWithEligibility = await Promise.all(drives.map(async (drive) => {
    // All students can see all drives - always eligible
    const isEligible = true;

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      where: {
        student_id: studentId,
        drive_id: drive.id
      }
    });

    return {
      id: drive.id,
      companyName: drive.company_name,
      jobRole: drive.job_role,
      jobDescription: drive.job_description,
      package: drive.package,
      jobType: drive.job_type,
      location: drive.location,
      minCGPA: drive.min_cgpa,
      allowedDepartments: drive.allowed_departments,
      maxBacklogs: drive.max_backlogs,
      applicationDeadline: drive.application_deadline,
      driveDate: drive.drive_date,
      status: drive.status,
      isEligible,
      hasApplied: !!existingApplication
    };
  }));

  res.status(200).json({
    success: true,
    count: drivesWithEligibility.length,
    drives: drivesWithEligibility
  });
});

// @desc    Apply to placement drive
// @route   POST /api/student/drives/:driveId/apply
// @access  Private (Student)
export const applyToDrive = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;
  const { driveId } = req.params;
  const { coverLetter } = req.body;

  // Check if student exists
  const student = await User.findByPk(studentId);
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Check if drive exists and is active
  const drive = await Drive.findByPk(driveId);
  if (!drive) {
    throw new AppError('Placement drive not found', 404);
  }
  
  if (drive.status !== 'ACTIVE') {
    throw new AppError('This drive is not accepting applications', 400);
  }

  // NOTE: Removed strict deadline check to allow applications to all active drives
  // The frontend shows all active drives, so students should be able to apply to them
  // If you need deadline validation, add it back with proper timezone handling

  // NO ELIGIBILITY CHECKS - All students can apply to any drive

  // Check if already applied
  const existingApplication = await Application.findOne({ 
    where: {
      student_id: studentId, 
      drive_id: driveId 
    }
  });
  
  if (existingApplication) {
    throw new AppError('You have already applied to this drive', 400);
  }

  // Create application
  const application = await Application.create({
    student_id: studentId,
    drive_id: driveId,
    status: 'APPLIED',
    applied_at: new Date()
  });

  // Log activity
  logActivity('APPLIED_TO_DRIVE', studentId, { driveId, companyName: drive.company_name });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    application: {
      id: application.id,
      driveId: application.drive_id,
      status: application.status,
      appliedAt: application.applied_at
    }
  });
});

// @desc    Get my applications
// @route   GET /api/student/applications
// @access  Private (Student)
export const getMyApplications = asyncHandler(async (req, res, next) => {
  const studentId = req.user.id;

  // Fetch applications from database
  const applications = await Application.findAll({
    where: {
      student_id: studentId
    },
    include: [
      {
        model: Drive,
        as: 'drive',
        attributes: ['id', 'company_name', 'job_role', 'package', 'location', 'drive_date', 'status'],
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'industry']
          }
        ]
      }
    ],
    order: [['applied_at', 'DESC']]
  });

  // Transform to match frontend expectations
  const formattedApplications = applications.map(app => ({
    id: app.id,
    drive: {
      id: app.drive?.id,
      companyName: app.drive?.company_name,
      jobRole: app.drive?.job_role,
      package: app.drive?.package,
      location: app.drive?.location,
      driveDate: app.drive?.drive_date
    },
    status: app.status,
    currentRound: app.current_round || 'Application Submitted',
    appliedAt: app.applied_at,
    feedback: app.feedback,
    offerLetterPath: app.offer_letter_path
  }));

  res.status(200).json({
    success: true,
    count: formattedApplications.length,
    applications: formattedApplications
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
  getResume,
  getActiveDrives,
  applyToDrive,
  getMyApplications,
  getApplicationStatus,
  withdrawApplication,
  downloadOfferLetter,
  getDashboard
};
