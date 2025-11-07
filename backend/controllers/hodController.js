import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';

/**
 * HOD (Head of Department) Controller
 * Handles department-level operations and student approvals
 */

// @desc    Get pending student approvals for department
// @route   GET /api/hod/approvals/pending
// @access  Private (HOD)
export const getPendingApprovals = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;

  // TODO: Fetch pending students from database
  // const pendingStudents = await User.find({
  //   role: 'student',
  //   department: hodDepartment,
  //   isApproved: false
  // }).select('-password').sort({ createdAt: -1 });

  // Mock pending students
  const pendingStudents = [
    {
      id: 'student_1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      rollNumber: 'CS2024001',
      department: hodDepartment,
      phone: '9876543210',
      registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isApproved: false
    },
    {
      id: 'student_2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      rollNumber: 'CS2024002',
      department: hodDepartment,
      phone: '9876543211',
      registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isApproved: false
    }
  ];

  res.status(200).json({
    success: true,
    count: pendingStudents.length,
    students: pendingStudents
  });
});

// @desc    Approve student registration
// @route   PUT /api/hod/approvals/:studentId/approve
// @access  Private (HOD)
export const approveStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const hodDepartment = req.user.department;

  // TODO: Find student and verify department
  // const student = await User.findOne({
  //   _id: studentId,
  //   role: 'student',
  //   department: hodDepartment
  // });

  // if (!student) {
  //   throw new AppError('Student not found or not in your department', 404);
  // }

  // if (student.isApproved) {
  //   throw new AppError('Student is already approved', 400);
  // }

  // TODO: Update student approval status
  // student.isApproved = true;
  // student.approvedBy = req.user.id;
  // student.approvedAt = new Date();
  // await student.save();

  // TODO: Send approval email to student
  // await sendEmail({
  //   email: student.email,
  //   subject: 'Account Approved',
  //   message: 'Your account has been approved by HOD. You can now login and access the portal.'
  // });

  logActivity('STUDENT_APPROVED', req.user.id, { studentId, department: hodDepartment });

  res.status(200).json({
    success: true,
    message: 'Student approved successfully',
    student: {
      id: studentId,
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

  // TODO: Find student and verify department
  // const student = await User.findOne({
  //   _id: studentId,
  //   role: 'student',
  //   department: hodDepartment
  // });

  // if (!student) {
  //   throw new AppError('Student not found or not in your department', 404);
  // }

  // TODO: Delete student account or mark as rejected
  // student.isRejected = true;
  // student.rejectionReason = reason;
  // student.rejectedBy = req.user.id;
  // student.rejectedAt = new Date();
  // await student.save();
  // OR
  // await User.findByIdAndDelete(studentId);

  // TODO: Send rejection email
  // await sendEmail({
  //   email: student.email,
  //   subject: 'Account Registration Rejected',
  //   message: `Your registration has been rejected. Reason: ${reason}`
  // });

  logActivity('STUDENT_REJECTED', req.user.id, { studentId, reason });

  res.status(200).json({
    success: true,
    message: 'Student registration rejected'
  });
});

// @desc    Get all students in department
// @route   GET /api/hod/students
// @access  Private (HOD)
export const getDepartmentStudents = asyncHandler(async (req, res, next) => {
  const hodDepartment = req.user.department;
  const { page = 1, limit = 10, search = '' } = req.query;

  // TODO: Build query with pagination and search
  // const query = {
  //   role: 'student',
  //   department: hodDepartment,
  //   isApproved: true
  // };

  // if (search) {
  //   query.$or = [
  //     { name: { $regex: search, $options: 'i' } },
  //     { email: { $regex: search, $options: 'i' } },
  //     { rollNumber: { $regex: search, $options: 'i' } }
  //   ];
  // }

  // const students = await User.find(query)
  //   .select('-password')
  //   .limit(limit * 1)
  //   .skip((page - 1) * limit)
  //   .sort({ createdAt: -1 });

  // const total = await User.countDocuments(query);

  // Mock students
  const students = [
    {
      id: 'student_1',
      name: 'John Doe',
      email: 'john@example.com',
      rollNumber: 'CS2023001',
      department: hodDepartment,
      cgpa: 8.5,
      phone: '9876543210',
      isApproved: true,
      resumeUrl: '/uploads/resumes/resume-1.pdf'
    },
    {
      id: 'student_2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      rollNumber: 'CS2023002',
      department: hodDepartment,
      cgpa: 9.0,
      phone: '9876543211',
      isApproved: true,
      resumeUrl: '/uploads/resumes/resume-2.pdf'
    }
  ];

  res.status(200).json({
    success: true,
    count: students.length,
    total: 25,
    page: parseInt(page),
    pages: Math.ceil(25 / limit),
    students
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

  // TODO: Aggregate dashboard data
  // const pendingApprovals = await User.countDocuments({
  //   role: 'student',
  //   department: hodDepartment,
  //   isApproved: false
  // });

  // const totalStudents = await User.countDocuments({
  //   role: 'student',
  //   department: hodDepartment,
  //   isApproved: true
  // });

  // Mock dashboard data
  const dashboardData = {
    pendingApprovals: 3,
    totalStudents: 120,
    placedStudents: 85,
    placementPercentage: 70.83,
    activeDrives: 5,
    recentApprovals: [
      {
        studentName: 'Alice Johnson',
        rollNumber: 'CS2024001',
        approvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ],
    recentPlacements: [
      {
        studentName: 'John Doe',
        company: 'Google',
        package: '25 LPA',
        placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    upcomingDrives: [
      {
        company: 'Amazon',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        role: 'SDE-1'
      }
    ]
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
