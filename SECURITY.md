# 🔐 Security Guide - College Placement Manager

## Important Security Notice

**⚠️ NEVER commit sensitive credentials to version control!**

This guide will help you set up your credentials securely without exposing them in your repository.

---

## 📋 Table of Contents

1. [Setting Up Environment Variables](#setting-up-environment-variables)
2. [Google OAuth2 Setup](#google-oauth2-setup)
3. [Gmail App Password Setup](#gmail-app-password-setup)
4. [Database Credentials](#database-credentials)
5. [Best Practices](#best-practices)
6. [What's Already Protected](#whats-already-protected)

---

## Setting Up Environment Variables

### Step 1: Create Your `.env` File

1. Navigate to the `backend` directory
2. Copy the example file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` in your editor (this file is already in `.gitignore`)

### Step 2: Fill In Your Credentials

The `.env` file is where ALL your secrets should go. Never hardcode them in your source files.

---

## Google OAuth2 Setup

If you want to use Gmail API for sending emails (more reliable for production):

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

### Step 2: Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure OAuth consent screen if prompted:
   - User Type: External
   - Add your email as test user
   - Add scopes: `gmail.send`
4. Choose "Desktop application" as application type
5. Download the credentials or copy:
   - Client ID
   - Client Secret

### Step 3: Add to Your `.env` File

```env
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Step 4: Generate Refresh Token

Run the setup script to get your refresh token:

```bash
cd backend
node get-auth-url.js
```

Follow the instructions:
1. Open the URL in your browser
2. Sign in with your Gmail account
3. Grant permissions
4. Copy the authorization code
5. Exchange it for tokens:

```bash
node exchange-token.js YOUR_AUTHORIZATION_CODE
```

Add the tokens to your `.env`:

```env
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_ACCESS_TOKEN=your-access-token
```

---

## Gmail App Password Setup

If you prefer the simpler App Password method (good for development):

### Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Name it "College Placement Manager"
4. Copy the 16-character password

### Step 3: Add to Your `.env` File

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

---

## Database Credentials

### PostgreSQL Setup

Update these in your `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_placement_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

### Database URL (Alternative)

Or use a connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/college_placement_db
```

---

## Best Practices

### ✅ DO:

- Keep all credentials in `.env` file
- Use different credentials for development and production
- Rotate credentials regularly
- Use environment-specific `.env` files (`.env.development`, `.env.production`)
- Share `.env.example` with placeholder values
- Use a password manager for storing credentials

### ❌ DON'T:

- Commit `.env` files to Git
- Hardcode credentials in source code
- Share credentials via email or chat
- Use production credentials in development
- Commit API keys, tokens, or passwords
- Push credentials to public repositories

### 🔍 Checking for Exposed Credentials

Before committing, always check:

```bash
git status
git diff
```

If you accidentally committed credentials:
1. Immediately revoke/regenerate them
2. Remove from Git history:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch path/to/file" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if on a personal repo):
   ```bash
   git push origin --force --all
   ```

---

## What's Already Protected

The following files are already in `.gitignore`:

- `.env`
- `.env.local`
- `.env.*.local`
- `node_modules/`
- `logs/`

The following credentials have been removed from the codebase:

- ✅ Google OAuth Client ID and Secret (moved to environment variables)
- ✅ Gmail credentials (moved to environment variables)
- ✅ Hardcoded email addresses (replaced with environment variables)

---

## Need Help?

If you're setting this up for the first time:

1. Start with the simple App Password method for Gmail
2. Test email sending with `node test.js`
3. Once working, you can upgrade to OAuth2 if needed

For OAuth2 issues:
- Make sure redirect URI matches exactly in Google Cloud Console
- Check that Gmail API is enabled
- Verify test users are added in OAuth consent screen

---

## Production Deployment

When deploying to production:

1. Use your hosting provider's environment variable system:
   - Heroku: `heroku config:set KEY=value`
   - Vercel: Add in project settings
   - AWS: Use Parameter Store or Secrets Manager
   - Docker: Use secrets or env files

2. Never commit production `.env` files

3. Use different credentials for each environment

4. Enable logging for authentication failures

5. Monitor for suspicious activity

---

## Questions?

If you have questions about security setup, please:
- Check this guide thoroughly
- Review `.env.example` for required variables
- Test with development credentials first
- Never share your actual credentials when asking for help

**Remember: Security is not optional. Take the time to do it right! 🔒**
