# Forgot Password Feature Documentation

## Overview
The forgot password feature has been implemented for all user roles (Student, HOD, TPO). This feature allows users to reset their password securely via email.

## Features Implemented

### 1. Database Schema Updates
- Added `resetPasswordToken` field to store hashed reset token
- Added `resetPasswordExpire` field to store token expiry (15 minutes)

### 2. Email Service
- Created professional HTML email template for password reset
- Includes security warnings and instructions
- Shows account details and request timestamp
- Provides both button and text link for accessibility

### 3. Password Reset Flow

#### Step 1: Request Password Reset
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully. Please check your inbox."
}
```

**Notes:**
- Security: Returns same message whether email exists or not
- Token is valid for 15 minutes
- Token is hashed before storing in database
- Previous reset tokens are invalidated when new one is requested

#### Step 2: Reset Password
**Endpoint:** `PUT /api/auth/reset-password/:token`

**URL Parameter:**
- `token`: The reset token received in email

**Request Body:**
```json
{
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

**Validation:**
- Password must be at least 6 characters
- Password and confirmPassword must match
- Token must be valid and not expired

## Testing the Feature

### 1. Test Forgot Password API

```bash
# Request password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com"}'
```

### 2. Check Email
- Check the email inbox for the password reset link
- The email will contain a link like: `http://localhost:5173/reset-password/[TOKEN]`

### 3. Test Reset Password API

```bash
# Reset password with token
curl -X PUT http://localhost:3000/api/auth/reset-password/[TOKEN] \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newPassword123",
    "confirmPassword": "newPassword123"
  }'
```

### 4. Test Login with New Password

```bash
# Login with new password
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "newPassword123"
  }'
```

## Security Features

### 1. Token Security
- Reset token is randomly generated (32 bytes)
- Token is hashed using SHA-256 before storing
- Token expires after 15 minutes
- Token is single-use only (cleared after successful reset)

### 2. Email Privacy
- Doesn't reveal if email exists in system
- Returns generic success message for non-existent emails

### 3. Password Requirements
- Minimum 6 characters (can be increased)
- Password confirmation required
- Old password is properly replaced with hashed version

## Email Configuration

Ensure these environment variables are set in `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the generated app password (not your regular Gmail password)

## Frontend Integration

### Forgot Password Page
Create a form with email input:

```jsx
// Example React component
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    // Show success message
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required 
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};
```

### Reset Password Page
Create a form with password inputs:

```jsx
// Example React component
const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, confirmPassword })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Redirect to login page
      navigate('/login');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required 
      />
      <input 
        type="password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required 
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};
```

## Error Handling

### Common Errors

1. **Invalid or Expired Token**
   - Message: "Invalid or expired reset token. Please request a new password reset link."
   - Solution: Request a new password reset

2. **Email Send Failure**
   - Message: "Failed to send password reset email. Please try again later."
   - Solution: Check email configuration and credentials

3. **Password Mismatch**
   - Message: "Passwords do not match"
   - Solution: Ensure password and confirmPassword are identical

4. **Weak Password**
   - Message: "Password must be at least 6 characters"
   - Solution: Use a stronger password

## Logging

All password reset activities are logged:
- Password reset requests (successful and failed)
- Token generation
- Email sending status
- Password reset completion
- Security events (invalid tokens, expired tokens)

Check logs in `backend/logs/` directory.

## Database Migration

After pulling these changes, the database will automatically add the new fields:
- `resetPasswordToken` (STRING, nullable)
- `resetPasswordExpire` (DATE, nullable)

If using manual migrations, ensure these fields are added to the `Users` table.

## Works For All User Roles

This feature is available for:
- ✅ **Students** - Can reset their login password
- ✅ **HOD** - Can reset their login password
- ✅ **TPO** - Can reset their login password

All users use the same forgot password flow regardless of their role.

## Support

For issues or questions:
1. Check logs in `backend/logs/`
2. Verify email configuration
3. Ensure database fields are properly added
4. Test with Postman/curl before frontend integration
