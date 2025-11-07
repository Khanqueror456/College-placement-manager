/**
 * Middleware Index
 * Central export point for all middleware modules
 */

// Authentication & Authorization
export * from './auth.js';

// File Upload
export * from './upload.js';

// Validation
export * from './validate.js';

// Error Handling
export * from './errorHandler.js';

// Logging
export * from './logger.js';

// Import default exports
import authMiddleware from './auth.js';
import uploadMiddleware from './upload.js';
import validateMiddleware from './validate.js';
import errorMiddleware from './errorHandler.js';
import loggerMiddleware from './logger.js';

export default {
  auth: authMiddleware,
  upload: uploadMiddleware,
  validate: validateMiddleware,
  error: errorMiddleware,
  logger: loggerMiddleware
};
