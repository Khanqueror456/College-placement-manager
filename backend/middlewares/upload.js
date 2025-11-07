import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'uploads', 'resumes'),
    path.join(process.cwd(), 'uploads', 'offers'),
    path.join(process.cwd(), 'uploads', 'documents')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories on startup
createUploadDirs();

/**
 * Storage configuration for multer
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    
    // Determine upload path based on file field name
    if (file.fieldname === 'resume') {
      uploadPath = path.join(process.cwd(), 'uploads', 'resumes');
    } else if (file.fieldname === 'offerLetter') {
      uploadPath = path.join(process.cwd(), 'uploads', 'offers');
    } else {
      uploadPath = path.join(process.cwd(), 'uploads', 'documents');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: fieldname-userId-timestamp-originalname
    const userId = req.user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    
    const filename = `${file.fieldname}-${userId}-${timestamp}-${sanitizedName}${ext}`;
    cb(null, filename);
  }
});

/**
 * File filter to validate file types
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`), false);
  }
};

/**
 * Base multer configuration
 */
const uploadBase = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize // 5MB default
  },
  fileFilter: fileFilter
});

/**
 * Middleware for single resume upload
 */
export const uploadResume = uploadBase.single('resume');

/**
 * Middleware for single offer letter upload
 */
export const uploadOfferLetter = uploadBase.single('offerLetter');

/**
 * Middleware for multiple document uploads
 */
export const uploadDocuments = uploadBase.array('documents', 5); // Max 5 files

/**
 * Middleware for mixed file uploads (resume + documents)
 */
export const uploadMultiple = uploadBase.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]);

/**
 * Error handler for multer errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${config.upload.maxFileSize / (1024 * 1024)}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // Other errors (like file filter errors)
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

/**
 * Validate uploaded file
 */
export const validateUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  next();
};

/**
 * Delete file helper function
 */
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file URL helper
 */
export const getFileUrl = (filename, type = 'documents') => {
  return `/uploads/${type}/${filename}`;
};

export default {
  uploadResume,
  uploadOfferLetter,
  uploadDocuments,
  uploadMultiple,
  handleUploadError,
  validateUpload,
  deleteFile,
  getFileUrl
};
