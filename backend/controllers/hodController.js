import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';
import { sendStudentApprovalEmail, sendStudentRejectionEmail } from '../lib/emailService.js';
import User from '../models/users.js';
import Drive from '../models/drive.js';
import Application from '../models/application.js';
import { Op } from 'sequelize';

/**
 * HOD (Head of Department) Controller
 * Handles department-level operations and student approvals
 */

// @desc    Get pending student approvals for department
// @route   GET /api/hod/approvals/pending
// @access  Private (HOD)
export const getPendingApprovals = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;

  // Fetch pending students from database
  const pendingStudents = await User.findAll({
    where: {
      role: 'STUDENT',
      department: hodDepartment,
      profile_status: 'PENDING'
    },
    attributes: ['id', 'name', 'email', 'student_id', 'department', 'phone', 'batch_year', 'cgpa', 'resume_path', 'last_resume_update', 'created_at'],
    order: [['created_at', 'DESC']]
  });

  // Format the response
  const formattedStudents = pendingStudents.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email,
    rollNumber: student.student_id,
    department: student.department,
    phone: student.phone,
    batchYear: student.batch_year,
    cgpa: student.cgpa,
    resumePath: student.resume_path,
    resumeUploadedAt: student.last_resume_update,
    registeredAt: student.created_at,
    isApproved: false
  }));

  res.status(200).json({
    success: true,
    count: formattedStudents.length,
    students: formattedStudents
  });
});

// @desc    Approve student registration
// @route   PUT /api/hod/approvals/:studentId/approve
// @access  Private (HOD)
export const approveStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const hodDepartment = req.user.department;

  // Find student and verify department
  const student = await User.findOne({
    where: {
      id: studentId,
      role: 'STUDENT',
      department: hodDepartment
    }
  });

  if (!student) {
    throw new AppError('Student not found or not in your department', 404);
  }

  if (student.profile_status === 'APPROVED') {
    throw new AppError('Student is already approved', 400);
  }

  // Update student approval status
  student.profile_status = 'APPROVED';
  await student.save();

  // Send approval email to student
  try {
    await sendStudentApprovalEmail({
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department,
      rollNumber: student.student_id
    }, {
      name: req.user.name,
      email: req.user.email
    });
    logInfo('Approval email sent successfully', { studentId, studentEmail: student.email });
  } catch (error) {
    logInfo('Failed to send approval email', { studentId, error: error.message });
    // Don't fail the approval process if email fails
  }

  logActivity('STUDENT_APPROVED', req.user.id, { studentId, department: hodDepartment });

  res.status(200).json({
    success: true,
    message: 'Student approved successfully and notification email sent',
    student: {
      id: studentId,
      name: student.name,
      email: student.email,
      isApproved: true,
      approvedAt: new Date()
    }
  });
});

// @desc    Reject student registration
// @route   PUT /api/hod/approvals/:studentId/reject
// @access  Private (HOD)
export const rejectStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { reason } = req.body;
  const hodDepartment = req.user.department;

  // Find student and verify department
  const student = await User.findOne({
    where: {
      id: studentId,
      role: 'STUDENT',
      department: hodDepartment
    }
  });

  if (!student) {
    throw new AppError('Student not found or not in your department', 404);
  }

  // Update student rejection status
  student.profile_status = 'REJECTED';
  await student.save();

  // Send rejection email to student
  try {
    await sendStudentRejectionEmail({
      id: student.id,
      name: student.name,
      email: student.email,
      department: student.department,
      rollNumber: student.student_id
    }, {
      name: req.user.name,
      email: req.user.email
    }, reason || 'No reason provided');
    logInfo('Rejection email sent successfully', { studentId, studentEmail: student.email });
  } catch (error) {
    logInfo('Failed to send rejection email', { studentId, error: error.message });
    // Don't fail the rejection process if email fails
  }

  logActivity('STUDENT_REJECTED', req.user.id, { studentId, reason });

  res.status(200).json({
    success: true,
    message: 'Student registration rejected and notification email sent'
  });
});

// @desc    Get all students in department
// @route   GET /api/hod/students
// @access  Private (HOD)
export const getDepartmentStudents = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;
  const { page = 1, limit = 10, search = '' } = req.query;

  // Build query with pagination and search
  const whereClause = {
    role: 'STUDENT',
    department: hodDepartment,
    profile_status: 'APPROVED'
  };

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { student_id: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;
  
  const { count, rows: students } = await User.findAndCountAll({
    where: whereClause,
    attributes: ['id', 'name', 'email', 'student_id', 'department', 'cgpa', 'phone', 'batch_year', 'resume_path'],
    limit: parseInt(limit),
    offset: offset,
    order: [['name', 'ASC']]
  });

  // Format the response
  const formattedStudents = students.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email,
    rollNumber: student.student_id,
    department: student.department,
    cgpa: student.cgpa,
    phone: student.phone,
    batchYear: student.batch_year,
    isApproved: true,
    resumeUrl: student.resume_path
  }));

  res.status(200).json({
    success: true,
    count: formattedStudents.length,
    total: count,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    students: formattedStudents
  });
});

// @desc    Get single student details
// @route   GET /api/hod/students/:studentId
// @access  Private (HOD)
export const getStudentDetails = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const hodDepartment = req.user.department;

  // TODO: Fetch student details
  // const student = await User.findOne({
  //   _id: studentId,
  //   role: 'student',
  //   department: hodDepartment
  // }).select('-password');

  // if (!student) {
  //   throw new AppError('Student not found or not in your department', 404);
  // }

  // Mock student details
  const student = {
    id: studentId,
    name: 'John Doe',
    email: 'john@example.com',
    rollNumber: 'CS2023001',
    department: hodDepartment,
    cgpa: 8.5,
    backlogs: 0,
    phone: '9876543210',
    skills: ['JavaScript', 'Python', 'React'],
    resumeUrl: '/uploads/resumes/resume-1.pdf',
    githubUrl: 'https://github.com/johndoe',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    isApproved: true,
    totalApplications: 5,
    offers: 1
  };

  res.status(200).json({
    success: true,
    student
  });
});

// @desc    Verify/Edit student profile
// @route   PUT /api/hod/students/:studentId/verify
// @access  Private (HOD)
export const verifyStudentProfile = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const updates = req.body;
  const hodDepartment = req.user.department;

  // TODO: Find student
  // const student = await User.findOne({
  //   _id: studentId,
  //   role: 'student',
  //   department: hodDepartment
  // });

  // if (!student) {
  //   throw new AppError('Student not found or not in your department', 404);
  // }

  // TODO: HOD can edit specific fields
  // const allowedUpdates = ['name', 'rollNumber', 'cgpa', 'backlogs', 'phone'];
  // Object.keys(updates).forEach(key => {
  //   if (allowedUpdates.includes(key)) {
  //     student[key] = updates[key];
  //   }
  // });

  // student.profileVerified = true;
  // student.verifiedBy = req.user.id;
  // student.verifiedAt = new Date();
  // await student.save();

  logActivity('STUDENT_PROFILE_VERIFIED', req.user.id, { studentId });

  res.status(200).json({
    success: true,
    message: 'Student profile verified and updated',
    student: updates
  });
});

// @desc    Get department placement statistics
// @route   GET /api/hod/statistics
// @access  Private (HOD)
export const getDepartmentStats = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;

  // TODO: Fetch statistics from database
  // const totalStudents = await User.countDocuments({
  //   role: 'student',
  //   department: hodDepartment,
  //   isApproved: true
  // });

  // const placedStudents = await Application.countDocuments({
  //   status: 'selected',
  //   // Join with User to filter by department
  // });

  // const averagePackage = await Application.aggregate([...]);
  // const topCompanies = await Application.aggregate([...]);

  // Mock statistics
  const statistics = {
    totalStudents: 120,
    registeredStudents: 118,
    placedStudents: 85,
    placementPercentage: 72.03,
    averagePackage: '8.5 LPA',
    highestPackage: '45 LPA',
    lowestPackage: '3.5 LPA',
    totalOffers: 95,
    pendingApprovals: 2,
    topCompanies: [
      { name: 'Google', offers: 5 },
      { name: 'Microsoft', offers: 8 },
      { name: 'Amazon', offers: 6 }
    ],
    packageDistribution: {
      '0-5 LPA': 25,
      '5-10 LPA': 40,
      '10-20 LPA': 15,
      '20+ LPA': 5
    }
  };

  res.status(200).json({
    success: true,
    department: hodDepartment,
    statistics
  });
});

// @desc    Generate department placement report
// @route   GET /api/hod/reports
// @access  Private (HOD)
export const getPlacementReport = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;
  const { format = 'json', startDate, endDate } = req.query;

  // TODO: Fetch detailed report data
  // const students = await User.find({
  //   role: 'student',
  //   department: hodDepartment,
  //   isApproved: true
  // }).populate('applications');

  // Mock report data
  const reportData = {
    department: hodDepartment,
    generatedBy: req.user.email,
    generatedAt: new Date(),
    summary: {
      totalStudents: 120,
      placedStudents: 85,
      averagePackage: '8.5 LPA'
    },
    students: [
      {
        name: 'John Doe',
        rollNumber: 'CS2023001',
        cgpa: 8.5,
        status: 'Placed',
        company: 'Google',
        package: '25 LPA'
      },
      {
        name: 'Jane Smith',
        rollNumber: 'CS2023002',
        cgpa: 9.0,
        status: 'Placed',
        company: 'Microsoft',
        package: '22 LPA'
      }
    ]
  };

  // TODO: If format is 'excel' or 'pdf', generate file
  // if (format === 'excel') {
  //   const workbook = createExcelReport(reportData);
  //   return res.download(workbook);
  // }
  // if (format === 'pdf') {
  //   const pdf = createPdfReport(reportData);
  //   return res.download(pdf);
  // }

  res.status(200).json({
    success: true,
    report: reportData
  });
});

// @desc    Get HOD dashboard
// @route   GET /api/hod/dashboard
// @access  Private (HOD)
export const getDashboard = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;

  // Aggregate dashboard data from database
  const pendingApprovals = await User.count({
    where: {
      role: 'STUDENT',
      department: hodDepartment,
      profile_status: 'PENDING'
    }
  });

  const totalStudents = await User.count({
    where: {
      role: 'STUDENT',
      department: hodDepartment,
      profile_status: 'APPROVED'
    }
  });

  // Get students with placements (applications with status='SELECTED')
  const placedStudentsCount = await Application.count({
    where: {
      status: 'SELECTED'
    },
    include: [{
      model: User,
      as: 'student',
      where: {
        department: hodDepartment,
        profile_status: 'APPROVED'
      },
      attributes: []
    }],
    distinct: true,
    col: 'student_id'
  });

  const placementPercentage = totalStudents > 0 
    ? ((placedStudentsCount / totalStudents) * 100).toFixed(2) 
    : 0;

  // Count active drives
  const activeDrives = await Drive.count({
    where: {
      status: 'ACTIVE',
      application_deadline: {
        [Op.gte]: new Date()
      }
    }
  });

  // Get recent approvals (last 5)
  const recentlyApproved = await User.findAll({
    where: {
      role: 'STUDENT',
      department: hodDepartment,
      profile_status: 'APPROVED'
    },
    attributes: ['name', 'student_id', 'updated_at'],
    order: [['updated_at', 'DESC']],
    limit: 5
  });

  const recentApprovals = recentlyApproved.map(student => ({
    studentName: student.name,
    rollNumber: student.student_id,
    approvedAt: student.updated_at
  }));

  // Get recent placements (applications with status='SELECTED')
  const recentPlacementsData = await Application.findAll({
    where: {
      status: 'SELECTED'
    },
    include: [
      {
        model: User,
        as: 'student',
        where: {
          department: hodDepartment
        },
        attributes: ['name']
      },
      {
        model: Drive,
        as: 'drive',
        attributes: ['company_name', 'package']
      }
    ],
    order: [['last_updated', 'DESC']],
    limit: 5
  });

  const recentPlacements = recentPlacementsData.map(app => ({
    studentName: app.student?.name,
    company: app.drive?.company_name,
    package: app.drive?.package,
    placedAt: app.last_updated
  }));

  // Get upcoming drives
  const upcomingDrivesData = await Drive.findAll({
    where: {
      status: 'ACTIVE',
      drive_date: {
        [Op.gte]: new Date()
      }
    },
    attributes: ['company_name', 'drive_date', 'job_role'],
    order: [['drive_date', 'ASC']],
    limit: 5
  });

  const upcomingDrives = upcomingDrivesData.map(drive => ({
    company: drive.company_name,
    date: drive.drive_date,
    role: drive.job_role
  }));

  const dashboardData = {
    pendingApprovals,
    totalStudents,
    placedStudents: placedStudentsCount,
    placementPercentage: parseFloat(placementPercentage),
    activeDrives,
    recentApprovals,
    recentPlacements,
    upcomingDrives
  };

  res.status(200).json({
    success: true,
    dashboard: dashboardData
  });
});

export default {
  getPendingApprovals,
  approveStudent,
  rejectStudent,
  getDepartmentStudents,
  getStudentDetails,
  verifyStudentProfile,
  getDepartmentStats,
  getPlacementReport,
  getDashboard
};
