# Fixing Forgot Password 500 Error

## Quick Fix Steps

### Step 1: Stop the Backend Server
Press `Ctrl+C` in the backend terminal to stop the server.

### Step 2: Run the Test Script
This will check what's missing:

```bash
node test-forgot-password-setup.js
```

### Step 3: Add Missing Database Fields
Run this command to add the reset password fields to your database:

```bash
node add-reset-fields.js
```

### Step 4: Configure Email (IMPORTANT!)
Open your `.env` file and add these lines (or update if they exist):

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**For Gmail:**
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Go to "App passwords": https://myaccount.google.com/apppasswords
5. Select "Mail" and "Other (Custom name)"
6. Enter "College Placement Manager" as the name
7. Click "Generate"
8. Copy the 16-character password (remove spaces)
9. Use this password as EMAIL_PASSWORD in your .env file

### Step 5: Restart Backend Server
```bash
npm start
```

### Step 6: Test Forgot Password
1. Go to the login page
2. Click "Forgot Password?"
3. Enter a registered user's email
4. Click "Send Reset Link"
5. Check the email inbox

## Alternative: Force Database Sync

If the above doesn't work, you can force sync the database (⚠️ WARNING: This will drop all tables):

1. Open `backend/server.js`
2. Find the line around line 132:
   ```javascript
   await syncDatabase(forceSync, false);
   ```
3. Change `false` to `true` temporarily:
   ```javascript
   await syncDatabase(forceSync, true);
   ```
4. Restart the server
5. **IMPORTANT**: Change it back to `false` after first run

## Common Issues

### Issue 1: "resetPasswordToken field missing"
**Solution**: Run `node add-reset-fields.js`

### Issue 2: "Email not configured"
**Solution**: Add EMAIL_USER and EMAIL_PASSWORD to .env file

### Issue 3: "Invalid credentials" email error
**Solution**: 
- Make sure you're using an App Password, not your regular Gmail password
- Remove any spaces from the app password
- Try regenerating the app password

### Issue 4: "Connection refused" database error
**Solution**: Make sure PostgreSQL is running

## Verify Setup

After fixing, test the API directly:

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Should return:
```json
{
  "success": true,
  "message": "Password reset email sent successfully. Please check your inbox."
}
```

## Still Not Working?

Check the backend terminal for detailed error messages. The server logs will show exactly what went wrong.

Common error patterns:
- `column "resetPasswordToken" does not exist` → Database not synced
- `Invalid login: 535` → Wrong email credentials
- `Missing credentials` → Email not configured in .env
- `User not found` → Email doesn't exist in database (this is OK, returns generic message)
