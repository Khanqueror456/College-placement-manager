import config from '../config/config.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { AppError } from '../middlewares/errorHandler.js';
import { logInfo, logActivity } from '../middlewares/logger.js';

/**
 * Drive Controller
 * Handles placement drive operations (shared between TPO and Students)
 */

// @desc    Get all placement drives with filters
// @route   GET /api/drives
// @access  Private
export const getAllDrives = asyncHandler(async (req, res, next) => {
  const { 
    status, 
    company, 
    department, 
    page = 1, 
    limit = 10, 
    sortBy = 'createdAt',
    order = 'desc' 
  } = req.query;

  // TODO: Build query with filters
  // const query = {};
  // if (status) query.status = status;
  // if (company) query.companyName = { $regex: company, $options: 'i' };
  // if (department) {
  //   query['eligibilityCriteria.allowedDepartments'] = department;
  // }

  // const sortOrder = order === 'desc' ? -1 : 1;
  // const drives = await Drive.find(query)
  //   .sort({ [sortBy]: sortOrder })
  //   .limit(limit * 1)
  //   .skip((page - 1) * limit)
  //   .populate('company', 'name industry');

  // const total = await Drive.countDocuments(query);

  // Mock drives
  const drives = [
    {
      id: 'drive_1',
      companyName: 'Google',
      jobRole: 'Software Engineer',
      jobDescription: 'Full-time role for software development',
      package: '25 LPA',
      jobType: 'Full-Time',
      location: 'Bangalore',
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science', 'IT'],
        maxBacklogs: 0,
        graduationYear: [2024, 2025]
      },
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicationsCount: 45,
      createdAt: new Date()
    },
    {
      id: 'drive_2',
      companyName: 'Microsoft',
      jobRole: 'SDE Intern',
      jobDescription: 'Summer internship program',
      package: '80k/month',
      jobType: 'Internship',
      location: 'Hyderabad',
      eligibilityCriteria: {
        minCGPA: 7.5,
        allowedDepartments: ['Computer Science', 'IT', 'ECE'],
        maxBacklogs: 0,
        graduationYear: [2025, 2026]
      },
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicationsCount: 62,
      createdAt: new Date()
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    total: 25,
    page: parseInt(page),
    pages: Math.ceil(25 / limit),
    drives
  });
});

// @desc    Get active placement drives
// @route   GET /api/drives/active
// @access  Private
export const getActiveDrives = asyncHandler(async (req, res, next) => {
  const { department, minCGPA } = req.query;

  // TODO: Fetch only active drives
  // const query = {
  //   status: 'active',
  //   applicationDeadline: { $gte: new Date() }
  // };

  // if (department) {
  //   query['eligibilityCriteria.allowedDepartments'] = department;
  // }
  // if (minCGPA) {
  //   query['eligibilityCriteria.minCGPA'] = { $lte: parseFloat(minCGPA) };
  // }

  // const drives = await Drive.find(query)
  //   .sort({ applicationDeadline: 1 })
  //   .populate('company', 'name logo');

  // Mock active drives
  const drives = [
    {
      id: 'drive_1',
      companyName: 'Google',
      companyLogo: '/logos/google.png',
      jobRole: 'Software Engineer',
      package: '25 LPA',
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science', 'IT']
      },
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    drives
  });
});

// @desc    Get placement drive by ID
// @route   GET /api/drives/:driveId
// @access  Private
export const getDriveById = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // TODO: Fetch drive details
  // const drive = await Drive.findById(driveId)
  //   .populate('company', 'name description website industry')
  //   .populate('createdBy', 'name email');

  // if (!drive) {
  //   throw new AppError('Placement drive not found', 404);
  // }

  // TODO: Check if current user has applied (if student)
  // let hasApplied = false;
  // if (req.user.role === 'student') {
  //   const application = await Application.findOne({
  //     student: req.user.id,
  //     drive: driveId
  //   });
  //   hasApplied = !!application;
  // }

  // Mock drive details
  const drive = {
    id: driveId,
    companyName: 'Google',
    companyDescription: 'Global technology company',
    companyWebsite: 'https://google.com',
    jobRole: 'Software Engineer',
    jobDescription: 'Full-stack software development role. Work on cutting-edge technologies.',
    package: '25 LPA',
    jobType: 'Full-Time',
    location: 'Bangalore',
    workMode: 'Hybrid',
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedDepartments: ['Computer Science', 'IT', 'ECE'],
      maxBacklogs: 0,
      graduationYear: [2024, 2025]
    },
    selectionProcess: [
      'Resume Screening',
      'Online Coding Test',
      'Technical Interview Round 1',
      'Technical Interview Round 2',
      'HR Interview'
    ],
    skillsRequired: ['JavaScript', 'Python', 'Data Structures', 'Algorithms'],
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'active',
    applicationsCount: 45,
    hasApplied: false,
    createdAt: new Date(),
    createdBy: {
      name: 'TPO Officer',
      email: 'tpo@college.edu'
    }
  };

  res.status(200).json({
    success: true,
    drive
  });
});

// @desc    Get drive statistics
// @route   GET /api/drives/:driveId/stats
// @access  Private (TPO/HOD)
export const getDriveStats = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // TODO: Aggregate statistics
  // const totalApplications = await Application.countDocuments({ drive: driveId });
  // const statusCounts = await Application.aggregate([
  //   { $match: { drive: mongoose.Types.ObjectId(driveId) } },
  //   { $group: { _id: '$status', count: { $sum: 1 } } }
  // ]);

  // const departmentWise = await Application.aggregate([
  //   { $match: { drive: mongoose.Types.ObjectId(driveId) } },
  //   { $lookup: { from: 'users', localField: 'student', foreignField: '_id', as: 'student' } },
  //   { $unwind: '$student' },
  //   { $group: { _id: '$student.department', count: { $sum: 1 } } }
  // ]);

  // Mock statistics
  const stats = {
    driveId,
    totalApplications: 45,
    statusBreakdown: {
      applied: 20,
      shortlisted: 15,
      selected: 5,
      rejected: 5
    },
    departmentWise: {
      'Computer Science': 25,
      'IT': 15,
      'ECE': 5
    },
    roundWise: {
      'Resume Screening': 45,
      'Online Test': 30,
      'Technical Interview': 15,
      'Final Round': 8
    },
    averageCGPA: 8.2,
    cgpaDistribution: {
      '7.0-7.5': 10,
      '7.5-8.0': 15,
      '8.0-8.5': 12,
      '8.5+': 8
    }
  };

  res.status(200).json({
    success: true,
    stats
  });
});

// @desc    Search drives
// @route   GET /api/drives/search
// @access  Private
export const searchDrives = asyncHandler(async (req, res, next) => {
  const { query, filters } = req.query;

  if (!query || query.length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }

  // TODO: Full-text search in drives
  // const drives = await Drive.find({
  //   $text: { $search: query },
  //   ...filters
  // }).limit(20);

  // Mock search results
  const drives = [
    {
      id: 'drive_1',
      companyName: 'Google',
      jobRole: 'Software Engineer',
      package: '25 LPA',
      status: 'active'
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    drives
  });
});

// @desc    Get upcoming drives (next 30 days)
// @route   GET /api/drives/upcoming
// @access  Private
export const getUpcomingDrives = asyncHandler(async (req, res, next) => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // TODO: Fetch upcoming drives
  // const drives = await Drive.find({
  //   status: 'active',
  //   driveDate: {
  //     $gte: new Date(),
  //     $lte: thirtyDaysFromNow
  //   }
  // }).sort({ driveDate: 1 });

  // Mock upcoming drives
  const drives = [
    {
      id: 'drive_1',
      companyName: 'Google',
      jobRole: 'Software Engineer',
      driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'drive_2',
      companyName: 'Microsoft',
      jobRole: 'SDE Intern',
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    drives
  });
});

// @desc    Check eligibility for a drive
// @route   GET /api/drives/:driveId/eligibility
// @access  Private (Student)
export const checkEligibility = asyncHandler(async (req, res, next) => {
  const { driveId } = req.params;

  // TODO: Get student details
  // const student = await User.findById(req.user.id);
  // const drive = await Drive.findById(driveId);

  // if (!drive) {
  //   throw new AppError('Drive not found', 404);
  // }

  // Check eligibility
  // const isEligible = 
  //   student.cgpa >= drive.eligibilityCriteria.minCGPA &&
  //   drive.eligibilityCriteria.allowedDepartments.includes(student.department) &&
  //   student.backlogs <= drive.eligibilityCriteria.maxBacklogs;

  // const reasons = [];
  // if (student.cgpa < drive.eligibilityCriteria.minCGPA) {
  //   reasons.push(`CGPA requirement: ${drive.eligibilityCriteria.minCGPA}`);
  // }
  // if (!drive.eligibilityCriteria.allowedDepartments.includes(student.department)) {
  //   reasons.push('Department not eligible');
  // }

  // Mock eligibility check
  const eligibilityResult = {
    isEligible: true,
    reasons: [],
    studentProfile: {
      cgpa: 8.5,
      department: 'Computer Science',
      backlogs: 0,
      graduationYear: 2025
    },
    driveRequirements: {
      minCGPA: 7.0,
      allowedDepartments: ['Computer Science', 'IT'],
      maxBacklogs: 0
    }
  };

  res.status(200).json({
    success: true,
    ...eligibilityResult
  });
});

// @desc    Get drives by company
// @route   GET /api/drives/company/:companyId
// @access  Private
export const getDrivesByCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  // TODO: Fetch drives by company
  // const drives = await Drive.find({ company: companyId })
  //   .sort({ createdAt: -1 });

  // Mock drives
  const drives = [
    {
      id: 'drive_1',
      jobRole: 'Software Engineer',
      package: '25 LPA',
      status: 'active',
      applicationsCount: 45
    },
    {
      id: 'drive_2',
      jobRole: 'Data Analyst',
      package: '18 LPA',
      status: 'closed',
      applicationsCount: 30
    }
  ];

  res.status(200).json({
    success: true,
    count: drives.length,
    drives
  });
});

export default {
  getAllDrives,
  getActiveDrives,
  getDriveById,
  getDriveStats,
  searchDrives,
  getUpcomingDrives,
  checkEligibility,
  getDrivesByCompany
};
