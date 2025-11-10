# Test & Utility Scripts

This directory contains all test files and utility scripts for development and debugging.

## Test Files

### API Tests
- `test-api.js` - Quick API tests
- `test-all-apis.js` - Comprehensive API tests
- `test-endpoints.js` - Endpoint testing
- `test-complete-flow.js` - End-to-end flow testing

### Feature-Specific Tests
- `test-hod-tpo.js` - HOD and TPO functionality tests
- `test-student-enrollment.js` - Student enrollment tests
- `test-tpo-complete.js` - Complete TPO workflow tests
- `test-approval-flow.js` - Approval workflow tests
- `test-apply-simple.js` - Simple application tests

### Service Tests
- `test-email-notification.js` - Email service tests
- `test-forgot-password.js` - Password reset tests
- `test-forgot-password-setup.js` - Password reset setup
- `test-gemini.js` - Gemini AI integration tests
- `test-ats.js` - ATS scoring tests
- `test-pdf-ats.js` - PDF parsing for ATS tests

## Utility Scripts

### Database Utilities
- `check-schema.js` - Check database schema
- `check-drives.js` - Check placement drives
- `check-roles.js` - Check user roles
- `check-hod-dept.js` - Check HOD department assignments

### Debug Scripts
- `debug-drives.js` - Debug placement drives
- `debug-resume-upload.js` - Debug resume upload functionality

### Data Management
- `generate-test-data.js` - Generate test data
- `add-tpo-role.js` - Add TPO role to user
- `add-reset-fields.js` - Add password reset fields
- `remove-admin-role.js` - Remove admin role from user

### OAuth & API
- `setup-oauth2.js` - Setup OAuth2 configuration
- `get-auth-url.js` - Get OAuth authorization URL
- `exchange-token.js` - Exchange OAuth tokens
- `analyze-api-routes.js` - Analyze API route structure

### Quick Tests
- `quick-test-student.js` - Quick student functionality test
- `test.js` - General test file

## Running Tests

```bash
# Run quick API tests
npm test

# Run specific test suites
npm run test:hod-tpo
npm run test:endpoints

# Generate test data
npm run generate-test-data
```
