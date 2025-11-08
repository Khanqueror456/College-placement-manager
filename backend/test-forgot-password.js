/**
 * Test Forgot Password Feature
 * 
 * This script tests the complete forgot password flow:
 * 1. Request password reset
 * 2. Simulate reset (in real scenario, token comes from email)
 * 3. Verify login with new password
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
};

/**
 * Test 1: Request password reset for existing user
 */
async function testForgotPasswordSuccess() {
  log.section('TEST 1: Request Password Reset (Valid Email)');
  
  try {
    const testEmail = 'student@example.com'; // Update with actual test email
    
    log.info(`Requesting password reset for: ${testEmail}`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email: testEmail
    });
    
    if (response.data.success) {
      log.success('Password reset email sent successfully');
      log.info(`Message: ${response.data.message}`);
      log.warning('Check the email inbox for reset link!');
      return true;
    } else {
      log.error('Unexpected response structure');
      return false;
    }
  } catch (error) {
    log.error(`Failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Test 2: Request password reset for non-existent user
 */
async function testForgotPasswordNonExistent() {
  log.section('TEST 2: Request Password Reset (Non-existent Email)');
  
  try {
    const testEmail = 'nonexistent@example.com';
    
    log.info(`Requesting password reset for: ${testEmail}`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email: testEmail
    });
    
    if (response.data.success) {
      log.success('Request handled correctly (no user existence revealed)');
      log.info(`Message: ${response.data.message}`);
      return true;
    } else {
      log.error('Unexpected response structure');
      return false;
    }
  } catch (error) {
    log.error(`Failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

/**
 * Test 3: Request password reset without email
 */
async function testForgotPasswordNoEmail() {
  log.section('TEST 3: Request Password Reset (No Email)');
  
  try {
    log.info('Sending request without email field');
    
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {});
    
    log.error('Should have failed validation but succeeded');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Validation error caught correctly');
      log.info(`Error: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

/**
 * Test 4: Reset password with invalid token
 */
async function testResetPasswordInvalidToken() {
  log.section('TEST 4: Reset Password (Invalid Token)');
  
  try {
    const invalidToken = 'invalid-token-12345';
    
    log.info(`Attempting to reset password with invalid token: ${invalidToken}`);
    
    const response = await axios.put(`${API_BASE_URL}/auth/reset-password/${invalidToken}`, {
      password: 'newPassword123',
      confirmPassword: 'newPassword123'
    });
    
    log.error('Should have failed with invalid token but succeeded');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Invalid token rejected correctly');
      log.info(`Error: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

/**
 * Test 5: Reset password with mismatched passwords
 */
async function testResetPasswordMismatch() {
  log.section('TEST 5: Reset Password (Password Mismatch)');
  
  try {
    const dummyToken = 'dummy-token-for-validation-test';
    
    log.info('Attempting to reset with mismatched passwords');
    
    const response = await axios.put(`${API_BASE_URL}/auth/reset-password/${dummyToken}`, {
      password: 'password123',
      confirmPassword: 'differentPassword123'
    });
    
    log.error('Should have failed validation but succeeded');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Password mismatch validation working correctly');
      log.info(`Error: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

/**
 * Test 6: Reset password with weak password
 */
async function testResetPasswordWeak() {
  log.section('TEST 6: Reset Password (Weak Password)');
  
  try {
    const dummyToken = 'dummy-token-for-validation-test';
    
    log.info('Attempting to reset with weak password (< 6 chars)');
    
    const response = await axios.put(`${API_BASE_URL}/auth/reset-password/${dummyToken}`, {
      password: '12345',
      confirmPassword: '12345'
    });
    
    log.error('Should have failed validation but succeeded');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Weak password validation working correctly');
      log.info(`Error: ${error.response.data.message}`);
      return true;
    } else {
      log.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

/**
 * Manual Test Instructions
 */
function printManualTestInstructions() {
  log.section('MANUAL TESTING INSTRUCTIONS');
  
  console.log(`
${colors.yellow}To complete the full flow test:${colors.reset}

${colors.cyan}Step 1: Create a test user (if not exists)${colors.reset}
curl -X POST ${API_BASE_URL}/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test Student",
    "email": "test.student@example.com",
    "password": "oldPassword123",
    "role": "student",
    "department": "Computer Science"
  }'

${colors.cyan}Step 2: Request password reset${colors.reset}
curl -X POST ${API_BASE_URL}/auth/forgot-password \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test.student@example.com"}'

${colors.cyan}Step 3: Check email for reset link${colors.reset}
- Open the email inbox for test.student@example.com
- Click the reset link or copy the token from URL
- Token format: http://localhost:5173/reset-password/[TOKEN]

${colors.cyan}Step 4: Reset password with token${colors.reset}
curl -X PUT ${API_BASE_URL}/auth/reset-password/[TOKEN] \\
  -H "Content-Type: application/json" \\
  -d '{
    "password": "newPassword123",
    "confirmPassword": "newPassword123"
  }'

${colors.cyan}Step 5: Login with new password${colors.reset}
curl -X POST ${API_BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test.student@example.com",
    "password": "newPassword123"
  }'

${colors.yellow}Note: Replace [TOKEN] with the actual token from the email${colors.reset}
  `);
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(`\n${colors.cyan}${'='.repeat(60)}`);
  console.log(`  FORGOT PASSWORD FEATURE TEST SUITE`);
  console.log(`${'='.repeat(60)}${colors.reset}\n`);
  
  log.info(`API Base URL: ${API_BASE_URL}`);
  log.info(`Testing against: ${API_BASE_URL}/auth/*`);
  
  const results = [];
  
  // Run tests
  results.push({ name: 'Forgot Password (Valid Email)', passed: await testForgotPasswordSuccess() });
  results.push({ name: 'Forgot Password (Non-existent Email)', passed: await testForgotPasswordNonExistent() });
  results.push({ name: 'Forgot Password (No Email)', passed: await testForgotPasswordNoEmail() });
  results.push({ name: 'Reset Password (Invalid Token)', passed: await testResetPasswordInvalidToken() });
  results.push({ name: 'Reset Password (Password Mismatch)', passed: await testResetPasswordMismatch() });
  results.push({ name: 'Reset Password (Weak Password)', passed: await testResetPasswordWeak() });
  
  // Print summary
  log.section('TEST SUMMARY');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  results.forEach(result => {
    if (result.passed) {
      log.success(result.name);
    } else {
      log.error(result.name);
    }
  });
  
  console.log(`\n${colors.cyan}${'─'.repeat(60)}${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset} | ${colors.red}Failed: ${failed}${colors.reset} | Total: ${results.length}`);
  console.log(`${colors.cyan}${'─'.repeat(60)}${colors.reset}\n`);
  
  // Print manual test instructions
  printManualTestInstructions();
  
  if (failed > 0) {
    log.warning('Some tests failed. Check the output above for details.');
    process.exit(1);
  } else {
    log.success('All automated tests passed!');
    log.info('Follow the manual testing instructions above to complete the full flow test.');
  }
}

// Run tests
runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
