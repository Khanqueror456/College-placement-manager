/**
 * Controllers Index
 * Central export point for all controller modules
 */

// Import all controllers
import * as authController from './authController.js';
import * as studentController from './studentController.js';
import * as hodController from './hodController.js';
import * as tpoController from './tpoController.js';
import * as driveController from './driveController.js';

// Export all controllers
export {
  authController,
  studentController,
  hodController,
  tpoController,
  driveController
};

// Default export as object
export default {
  auth: authController,
  student: studentController,
  hod: hodController,
  tpo: tpoController,
  drive: driveController
};
