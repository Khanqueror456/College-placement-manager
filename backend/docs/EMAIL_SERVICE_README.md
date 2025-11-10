# Email Service Implementation Guide

## 🚀 Overview

This implementation adds comprehensive email notifications to the College Placement Management Portal. Students will receive automatic email notifications when:

- ✅ Their registration is **approved** by HOD
- ❌ Their registration is **rejected** by HOD  
- 📋 Their application status is **updated** by TPO (accepted, rejected, shortlisted, etc.)
- 🔔 New placement drives are posted that match their profile

## 📧 Email Configuration

### Gmail App Password Setup

1. **Your Gmail App Password is already configured:**
   ```
   APP_PASS=nnfb reqj jjfw fypp
   ```

2. **Update the .env file with your actual Gmail address:**
   ```bash
   EMAIL_USER=your-actual-email@gmail.com  # Replace with your Gmail
   EMAIL_PASSWORD=nnfbrqjjjfwfypp
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_FROM=noreply@collegeplacement.com
   ```

### Environment Variables

Add these to your `.env` file:
```bash
# Email Configuration (Gmail with App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=nnfbrqjjjfwfypp
EMAIL_FROM=noreply@collegeplacement.com
```

## 📁 Files Created/Modified

### New Files:
1. **`lib/emailService.js`** - Main email service with all email templates
2. **`controllers/emailTestController.js`** - Testing endpoints
3. **`routes/emailTestRoutes.js`** - Email testing routes

### Modified Files:
1. **`controllers/hodController.js`** - Added email notifications for approve/reject
2. **`controllers/tpoController.js`** - Added email notifications for status updates
3. **`server.js`** - Added email test routes
4. **`.env`** - Added email configuration

## 🧪 Testing the Email Service

### 1. Start the Server
```bash
npm run dev
```

### 2. Test Email Connection
```bash
curl http://localhost:3000/api/test/email/connection
```

Expected response:
```json
{
  "success": true,
  "connected": true,
  "message": "Email service connected successfully"
}
```

### 3. Send Test Email
```bash
curl -X POST http://localhost:3000/api/test/email/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test email from the placement portal"
  }'
```

## 📋 Email Templates

### 1. Student Approval Email
- **Trigger:** HOD approves student registration
- **Recipient:** Student
- **Content:** Welcome message, login instructions, next steps

### 2. Student Rejection Email  
- **Trigger:** HOD rejects student registration
- **Recipient:** Student
- **Content:** Rejection reason, contact information, reapplication guidance

### 3. Application Status Email
- **Trigger:** TPO updates application status
- **Recipient:** Student
- **Status Types:**
  - ✅ **Accepted/Selected** - Congratulations message
  - ❌ **Rejected** - Encouragement to apply elsewhere  
  - ⭐ **Shortlisted** - Interview preparation guidance
  - 👀 **Under Review** - Wait for updates message

### 4. New Drive Notification
- **Trigger:** TPO creates new placement drive
- **Recipient:** Eligible students
- **Content:** Job details, application deadline, apply now button

## 🔧 Usage Examples

### HOD Approving Student
```javascript
// In hodController.js - approveStudent function
await sendStudentApprovalEmail(student, {
  name: req.user.name,
  email: req.user.email
});
```

### TPO Updating Application Status
```javascript
// In tpoController.js - updateApplicationStatus function
await sendApplicationStatusEmail(student, application, status, comments);
```

### Bulk Status Updates
```javascript
// In tpoController.js - bulkUpdateStatus function
// Automatically sends emails to all affected students
```

## 🎨 Email Design Features

- **Professional HTML templates** with inline CSS
- **Mobile-responsive** design
- **Color-coded status indicators**
- **Clear call-to-action buttons**
- **Fallback plain text** versions
- **Branded college placement portal** styling

## 🔒 Security & Error Handling

### Email Failures
- Email failures **don't stop** the main process (approve/reject/update)
- All email attempts are **logged** for debugging
- **Graceful degradation** - system works even if email fails

### Development vs Production
- Email testing endpoints only work in **development mode**
- Production emails use **secure configurations**
- **Rate limiting** prevents email spam

## 📊 Monitoring & Logging

### Email Logs
All email activities are logged with:
- Recipient email address
- Email subject and type
- Success/failure status
- Error messages (if any)
- Timestamp

### Log Examples
```
[INFO] Email sent successfully - student@example.com - Account Approved
[ERROR] Email sending failed - student@example.com - SMTP connection timeout
```

## 🚀 Deployment Checklist

### Before Going Live:

1. **✅ Update EMAIL_USER** in .env with your actual Gmail
2. **✅ Verify Gmail App Password** is working
3. **✅ Test email connection** using test endpoint
4. **✅ Send test emails** to verify formatting
5. **✅ Test all email scenarios:**
   - Student approval
   - Student rejection  
   - Application status updates
   - Bulk updates

### Production Settings:
```bash
NODE_ENV=production
EMAIL_SECURE=true  # Use for production Gmail
```

## 🎯 Future Enhancements

- **Email queuing** for bulk operations
- **Template customization** from admin panel
- **Email analytics** and tracking
- **SMS notifications** integration
- **Email preferences** for students
- **Automated reminder emails**

## 🆘 Troubleshooting

### Common Issues:

#### 1. "Authentication failed" Error
- **Solution:** Verify Gmail app password is correct
- **Check:** EMAIL_USER and EMAIL_PASSWORD in .env

#### 2. "Connection timeout" Error  
- **Solution:** Check internet connection and Gmail settings
- **Check:** EMAIL_HOST and EMAIL_PORT settings

#### 3. Emails not being sent
- **Solution:** Check logs for error messages
- **Check:** Test email connection endpoint first

#### 4. HTML emails not displaying properly
- **Solution:** Email clients vary - plain text fallback provided
- **Check:** Test with different email clients

### Debug Commands:
```bash
# Test email connection
curl http://localhost:3000/api/test/email/connection

# Check server logs
npm run dev

# Test with actual email
curl -X POST http://localhost:3000/api/test/email/send \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com"}'
```

## 📞 Support

For email-related issues:
1. Check the server logs first
2. Verify .env configuration  
3. Test email connection endpoint
4. Review Gmail app password setup

---

**Email Service Status:** ✅ Ready for Production  
**Last Updated:** November 2024  
**Version:** 1.0.0