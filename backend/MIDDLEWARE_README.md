# Backend Middleware Documentation

## 🔧 Installed Middleware & Dependencies

### Core Dependencies
- **express** (v5.1.0) - Web framework
- **mongoose** (v8.0.0) - MongoDB ODM
- **dotenv** (v16.0.0) - Environment variable management

### Security & Authentication
- **jsonwebtoken** (v9.0.0) - JWT token generation/verification
- **bcryptjs** (v2.4.3) - Password hashing
- **cors** (v2.8.5) - Cross-Origin Resource Sharing
- **helmet** (v7.0.0) - Security headers
- **express-rate-limit** (v7.0.0) - Rate limiting

### File Handling
- **multer** (v1.4.5-lts.1) - File upload middleware
- Configured for resume and offer letter uploads
- File type validation (PDF, DOC, DOCX)
- File size limit: 5MB

### Validation
- **express-validator** (v7.0.0) - Request validation and sanitization
- Custom validation rules for all endpoints

### Email
- **nodemailer** (v6.9.0) - Email notification service

### Logging
- **winston** (v3.11.0) - Application logging
- **morgan** (v1.10.0) - HTTP request logging

### Utilities
- **compression** (v1.7.4) - Response compression
- **cookie-parser** (v1.4.6) - Cookie parsing

---

## 📁 Middleware Structure

```
backend/middlewares/
├── auth.js           # Authentication & Authorization
├── upload.js         # File Upload (Multer)
├── validate.js       # Request Validation
├── errorHandler.js   # Error Handling
├── logger.js         # Logging Configuration
└── mid.js           # Middleware Index
```

---

## 🔐 Authentication Middleware (`auth.js`)

### Available Middleware Functions:

1. **`authenticate`** - Verify JWT token
   ```javascript
   import { authenticate } from './middlewares/auth.js';
   router.get('/profile', authenticate, controller);
   ```

2. **`authorize(...roles)`** - Role-based access control
   ```javascript
   router.post('/drive', authenticate, authorize('tpo'), controller);
   ```

3. **`isStudent`** - Student-only access
4. **`isHOD`** - HOD-only access
5. **`isTPO`** - TPO-only access
6. **`isAdmin`** - HOD or TPO access
7. **`checkDepartmentAccess`** - Department-specific access
8. **`optionalAuth`** - Optional authentication

### Usage Example:
```javascript
// Protect route with authentication
router.get('/drives', authenticate, getDrives);

// Restrict to TPO only
router.post('/drives', authenticate, isTPO, createDrive);

// Allow HOD or TPO
router.get('/reports', authenticate, isAdmin, getReports);

// Department-specific access
router.get('/students/:department', authenticate, checkDepartmentAccess, getStudents);
```

---

## 📤 File Upload Middleware (`upload.js`)

### Available Functions:

1. **`uploadResume`** - Single resume upload
2. **`uploadOfferLetter`** - Single offer letter upload
3. **`uploadDocuments`** - Multiple documents (max 5)
4. **`uploadMultiple`** - Mixed file uploads
5. **`handleUploadError`** - Multer error handler
6. **`validateUpload`** - Validate uploaded file

### File Storage:
- Resumes: `uploads/resumes/`
- Offer Letters: `uploads/offers/`
- Other Documents: `uploads/documents/`

### Usage Example:
```javascript
import { uploadResume, handleUploadError } from './middlewares/upload.js';

router.post(
  '/profile/resume',
  authenticate,
  uploadResume,
  handleUploadError,
  updateResume
);
```

### File Naming:
Format: `{fieldname}-{userId}-{timestamp}-{originalname}.{ext}`

---

## ✅ Validation Middleware (`validate.js`)

### Available Validators:

1. **`validateRegistration`** - User registration
2. **`validateLogin`** - User login
3. **`validateStudentProfile`** - Student profile update
4. **`validatePlacementDrive`** - Placement drive creation
5. **`validateApplication`** - Drive application
6. **`validateRoundResult`** - Round results
7. **`validateEmail`** - Email sending
8. **`validateId`** - MongoDB ID parameter
9. **`validatePagination`** - Pagination params
10. **`validateDateRange`** - Date range queries
11. **`validateDepartment`** - Department data

### Usage Example:
```javascript
import { validateRegistration } from './middlewares/validate.js';

router.post('/register', validateRegistration, registerUser);
```

### Validation Rules:
- Password: Min 8 chars, uppercase, lowercase, number, special char
- Email: Valid email format
- CGPA: 0-10 range
- File size: Max 5MB
- Phone: 10 digits

---

## ⚠️ Error Handler Middleware (`errorHandler.js`)

### Available Functions:

1. **`AppError`** - Custom error class
2. **`asyncHandler`** - Async error wrapper
3. **`notFound`** - 404 handler
4. **`errorHandler`** - Global error handler
5. **`handleUnhandledRejection`** - Promise rejection handler
6. **`handleUncaughtException`** - Exception handler

### Usage Example:
```javascript
import { asyncHandler, AppError } from './middlewares/errorHandler.js';

// Wrap async routes
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
});
```

### Error Response Format:
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack (dev only)"
}
```

---

## 📝 Logger Middleware (`logger.js`)

### Features:
- **Winston** for application logging
- **Morgan** for HTTP request logging
- Separate log files for errors and combined logs
- Console output in development

### Log Files:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/access.log` - HTTP access logs

### Available Functions:
```javascript
import { logInfo, logError, logWarning, logActivity } from './middlewares/logger.js';

logInfo('User logged in', { userId: user.id });
logError('Database error', error);
logWarning('High memory usage');
logActivity('DRIVE_CREATED', userId, { driveId });
```

---

## 🚀 Server Configuration (`server.js`)

### Middleware Load Order:
1. ✅ Security (Helmet, CORS)
2. ✅ Rate Limiting
3. ✅ Body Parsing
4. ✅ Cookie Parser
5. ✅ Compression
6. ✅ Logging
7. ✅ Static Files
8. ✅ Routes
9. ✅ 404 Handler
10. ✅ Error Handler

### Environment Variables:
Copy `.env.example` to `.env` and configure:
- Database connection
- JWT secrets
- Email credentials
- Upload settings
- CORS origins

---

## 🔒 Security Features

### Implemented:
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting (100 req/15min)
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation & sanitization
- ✅ File type validation
- ✅ File size limits

### Best Practices:
- Use strong JWT secrets
- Enable HTTPS in production
- Configure proper CORS origins
- Regular security updates
- Monitor logs for suspicious activity

---

## 📊 Usage Statistics

### Request Limits:
- Rate Limit: 100 requests per 15 minutes
- File Size: 5MB max
- Request Body: 10MB max
- Multiple Files: 5 max

---

## 🧪 Testing Endpoints

```bash
# Health check
GET http://localhost:3000/health

# API root
GET http://localhost:3000/

# Protected route example (after implementation)
GET http://localhost:3000/api/profile
Headers: Authorization: Bearer <token>
```

---

## 📦 Next Steps

1. **Database Setup**: Configure MongoDB connection
2. **Models**: Create Mongoose schemas
3. **Routes**: Implement API endpoints
4. **Controllers**: Add business logic
5. **Email Service**: Configure email templates
6. **AI Integration**: Add AI features

---

## 🐛 Debugging

### Enable Debug Logs:
```bash
NODE_ENV=development npm run dev
```

### Check Logs:
```bash
# View combined logs
cat logs/combined.log

# View error logs
cat logs/error.log

# Follow access logs
tail -f logs/access.log
```

---

## 📞 Support

For issues or questions:
1. Check logs in `logs/` directory
2. Verify environment variables in `.env`
3. Review middleware configuration
4. Check console output in development mode

---

**✅ All middleware successfully configured and ready to use!**
