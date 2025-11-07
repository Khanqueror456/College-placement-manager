import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticate, isStudent, isTPO } from '../middlewares/auth.js';
import { 
  uploadResume, 
  uploadOfferLetter, 
  handleUploadError, 
  validateUpload,
  deleteFile,
  getFileUrl 
} from '../middlewares/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Upload student resume
 * POST /api/upload/resume
 */
router.post('/resume', authenticate, isStudent, uploadResume, handleUploadError, validateUpload, async (req, res) => {
  try {
    const file = req.file;
    
    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: getFileUrl(file.filename, 'resumes'),
        path: `/uploads/resumes/${file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message
    });
  }
});

/**
 * Upload offer letter (TPO only)
 * POST /api/upload/offer-letter
 */
router.post('/offer-letter', authenticate, isTPO, uploadOfferLetter, handleUploadError, validateUpload, async (req, res) => {
  try {
    const file = req.file;
    
    res.status(200).json({
      success: true,
      message: 'Offer letter uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: getFileUrl(file.filename, 'offers'),
        path: `/uploads/offers/${file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading offer letter',
      error: error.message
    });
  }
});

/**
 * Get file information
 * GET /api/upload/info/:folder/:filename
 */
router.get('/info/:folder/:filename', authenticate, async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const allowedFolders = ['resumes', 'offers', 'documents'];
    
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder specified'
      });
    }
    
    const filePath = path.join(__dirname, '..', 'uploads', folder, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    const stats = fs.statSync(filePath);
    
    res.status(200).json({
      success: true,
      data: {
        filename: filename,
        folder: folder,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${folder}/${filename}`,
        exists: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting file information',
      error: error.message
    });
  }
});

/**
 * Delete file
 * DELETE /api/upload/:folder/:filename
 */
router.delete('/:folder/:filename', authenticate, async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const allowedFolders = ['resumes', 'offers', 'documents'];
    
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder specified'
      });
    }
    
    // Check permissions - students can only delete their own resumes, TPO can delete offers
    if (folder === 'resumes' && req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can delete resumes'
      });
    }
    
    if (folder === 'offers' && req.user.role !== 'tpo') {
      return res.status(403).json({
        success: false,
        message: 'Only TPO can delete offer letters'
      });
    }
    
    const filePath = path.join(__dirname, '..', 'uploads', folder, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    const deleted = deleteFile(filePath);
    
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error deleting file'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
});

/**
 * List files in a folder
 * GET /api/upload/list/:folder
 */
router.get('/list/:folder', authenticate, async (req, res) => {
  try {
    const { folder } = req.params;
    const allowedFolders = ['resumes', 'offers', 'documents'];
    
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid folder specified'
      });
    }
    
    // Check permissions
    if (folder === 'resumes' && req.user.role !== 'student' && req.user.role !== 'tpo' && req.user.role !== 'hod') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const folderPath = path.join(__dirname, '..', 'uploads', folder);
    
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    const files = fs.readdirSync(folderPath);
    const fileInfos = files.map(filename => {
      const filePath = path.join(folderPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename: filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/${folder}/${filename}`
      };
    });
    
    res.status(200).json({
      success: true,
      data: {
        folder: folder,
        files: fileInfos,
        count: fileInfos.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error listing files',
      error: error.message
    });
  }
});

export default router;
