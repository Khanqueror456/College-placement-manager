import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Authentication Middleware - Verify JWT Token
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Attach user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        department: decoded.department
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authentication failed.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Case-insensitive role comparison
    const userRole = req.user.role?.toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());
    
    if (!allowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Check if user is a Student
 */
export const isStudent = authorize(config.roles.STUDENT);

/**
 * Check if user is a HOD
 */
export const isHOD = authorize(config.roles.HOD);

/**
 * Check if user is a TPO
 */
export const isTPO = authorize(config.roles.TPO);

/**
 * Check if user is HOD or TPO (Admin roles)
 */
export const isAdmin = authorize(config.roles.HOD, config.roles.TPO);

/**
 * Department-specific access control
 * HODs can only access their own department data
 */
export const checkDepartmentAccess = (req, res, next) => {
  const { role, department } = req.user;
  const requestedDepartment = req.params.department || req.body.department;

  // TPO has access to all departments
  if (role === config.roles.TPO) {
    return next();
  }

  // HOD can only access their own department
  if (role === config.roles.HOD) {
    if (requestedDepartment && requestedDepartment !== department) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your department data.'
      });
    }
  }

  next();
};

/**
 * Optional Authentication - Attach user if token exists but don't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          department: decoded.department
        };
      } catch (error) {
        // Token invalid but don't block the request
        req.user = null;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

export default {
  authenticate,
  authorize,
  isStudent,
  isHOD,
  isTPO,
  isAdmin,
  checkDepartmentAccess,
  optionalAuth
};
