import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * User Registration Validation
 */
export const validateRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['student', 'hod', 'tpo']).withMessage('Invalid role'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Department must be between 2-100 characters'),
  
  validate
];

/**
 * User Login Validation
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

/**
 * Student Profile Validation
 */
export const validateStudentProfile = [
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  
  body('rollNumber')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Roll number must be 1-50 characters'),
  
  body('cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
  
  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),
  
  body('githubUrl')
    .optional()
    .isURL().withMessage('Invalid GitHub URL'),
  
  body('linkedinUrl')
    .optional()
    .isURL().withMessage('Invalid LinkedIn URL'),
  
  validate
];

/**
 * Placement Drive Validation
 */
export const validatePlacementDrive = [
  body('companyName')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Company name must be between 2-200 characters'),
  
  body('jobRole')
    .trim()
    .notEmpty().withMessage('Job role is required')
    .isLength({ min: 2, max: 200 }).withMessage('Job role must be between 2-200 characters'),
  
  body('jobDescription')
    .trim()
    .notEmpty().withMessage('Job description is required'),
  
  body('eligibilityCriteria.minCGPA')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Minimum CGPA must be between 0 and 10'),
  
  body('eligibilityCriteria.allowedDepartments')
    .optional()
    .isArray().withMessage('Allowed departments must be an array'),
  
  body('package')
    .optional()
    .isNumeric().withMessage('Package must be a number'),
  
  body('applicationDeadline')
    .notEmpty().withMessage('Application deadline is required')
    .isISO8601().withMessage('Invalid date format'),
  
  body('driveDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  
  validate
];

/**
 * Application Validation
 */
export const validateApplication = [
  body('driveId')
    .notEmpty().withMessage('Drive ID is required')
    .isMongoId().withMessage('Invalid drive ID format'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Cover letter must not exceed 1000 characters'),
  
  validate
];

/**
 * Round Result Validation
 */
export const validateRoundResult = [
  body('roundName')
    .trim()
    .notEmpty().withMessage('Round name is required'),
  
  body('selectedStudents')
    .isArray().withMessage('Selected students must be an array'),
  
  body('selectedStudents.*')
    .isMongoId().withMessage('Invalid student ID format'),
  
  body('rejectedStudents')
    .optional()
    .isArray().withMessage('Rejected students must be an array'),
  
  validate
];

/**
 * Email Validation
 */
export const validateEmail = [
  body('to')
    .notEmpty().withMessage('Recipient email is required')
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }).withMessage('Invalid email format'),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Email subject is required')
    .isLength({ min: 1, max: 200 }).withMessage('Subject must be between 1-200 characters'),
  
  body('body')
    .trim()
    .notEmpty().withMessage('Email body is required'),
  
  validate
];

/**
 * ID Parameter Validation
 */
export const validateId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  
  validate
];

/**
 * Pagination Validation
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  validate
];

/**
 * Date Range Validation
 */
export const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  
  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (req.query.startDate && value) {
        return new Date(value) >= new Date(req.query.startDate);
      }
      return true;
    }).withMessage('End date must be after start date'),
  
  validate
];

/**
 * Department Validation
 */
export const validateDepartment = [
  body('name')
    .trim()
    .notEmpty().withMessage('Department name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Department name must be between 2-100 characters'),
  
  body('hodEmail')
    .optional()
    .isEmail().withMessage('Invalid HOD email format'),
  
  validate
];

export default {
  validate,
  validateRegistration,
  validateLogin,
  validateStudentProfile,
  validatePlacementDrive,
  validateApplication,
  validateRoundResult,
  validateEmail,
  validateId,
  validatePagination,
  validateDateRange,
  validateDepartment
};
