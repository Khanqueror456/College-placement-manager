import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = {
  passed: [],
  failed: [],
  skipped: []
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m'
};

// Test users
const testUsers = {
  student: {
    name: 'Test Student API',
    email: `student_api_${Date.now()}@test.com`,
    password: 'TestStudent@123',
    role: 'student',
    department: 'Computer Science',
    student_id: `STU_API_${Date.now()}`,
    batch_year: 2024,
    cgpa: 8.5,
    useExisting: false // Create new student for testing
  },
  hod: {
    name: 'Test HOD',
    email: `hod_${Date.now()}@test.com`,
    password: 'Test@123',
    role: 'hod',
    department: 'Computer Science'
  },
  tpo: {
    name: 'Test TPO',
    email: `tpo_${Date.now()}@test.com`,
    password: 'Test@123',
    role: 'tpo',
    department: 'Training & Placement'
  }
};

// Store tokens and IDs
const testData = {
  tokens: {},
  users: {},
  driveId: null,
  companyId: null,
  applicationId: null
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '═'.repeat(70));
  log(`  ${title}`, 'bright');
  console.log('═'.repeat(70));
}

function logTest(name, status, details = '') {
  const icon = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '⊘';
  const color = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';
  log(`${icon} ${name}`, color);
  if (details) {
    log(`  ${details}`, 'gray');
  }
}

async function makeRequest(method, endpoint, data = null, token = null, isFormData = false) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      if (isFormData) {
        config.data = data;
        config.headers = { ...config.headers, ...data.getHeaders() };
      } else {
        config.data = data;
        config.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || error.message,
      details: error.response?.data,
      status: error.response?.status
    };
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test functions
async function testHealthCheck() {
  logSection('🏥 HEALTH CHECK');
  
  const result = await makeRequest('GET', '/health');
  if (result.success) {
    logTest('Server health check', 'pass', `Status: ${result.data.status}`);
    TEST_RESULTS.passed.push('Health Check');
    return true;
  } else {
    logTest('Server health check', 'fail', result.error);
    TEST_RESULTS.failed.push('Health Check');
    return false;
  }
}

async function testAuthenticationAPIs() {
  logSection('🔐 AUTHENTICATION APIs');

  let result; // Declare result variable

  // Register Student (skip if using existing account)
  if (!testUsers.student.useExisting) {
    result = await makeRequest('POST', '/api/auth/register', testUsers.student);
    if (result.success) {
      logTest('Register Student', 'pass', `User ID: ${result.data.user?.id}`);
      testData.users.student = result.data.user;
      TEST_RESULTS.passed.push('Register Student');
    } else {
      logTest('Register Student', 'fail', result.error);
      TEST_RESULTS.failed.push('Register Student');
    }
    await sleep(500);
  } else {
    logTest('Register Student', 'skip', 'Using existing account');
    TEST_RESULTS.skipped.push('Register Student');
  }

  // Register HOD
  result = await makeRequest('POST', '/api/auth/register', testUsers.hod);
  if (result.success) {
    logTest('Register HOD', 'pass', `User ID: ${result.data.user?.id}`);
    testData.users.hod = result.data.user;
    TEST_RESULTS.passed.push('Register HOD');
  } else {
    const errorDetails = result.details?.errors ? JSON.stringify(result.details.errors) : result.error;
    logTest('Register HOD', 'fail', errorDetails);
    TEST_RESULTS.failed.push('Register HOD');
  }

  await sleep(500);

  // Register TPO
  result = await makeRequest('POST', '/api/auth/register', testUsers.tpo);
  if (result.success) {
    logTest('Register TPO', 'pass', `User ID: ${result.data.user?.id}`);
    testData.users.tpo = result.data.user;
    TEST_RESULTS.passed.push('Register TPO');
  } else {
    const errorDetails = result.details?.errors ? JSON.stringify(result.details.errors) : result.error;
    logTest('Register TPO', 'fail', errorDetails);
    TEST_RESULTS.failed.push('Register TPO');
  }

  await sleep(500);

  // Login Student
  result = await makeRequest('POST', '/api/auth/login', {
    email: testUsers.student.email,
    password: testUsers.student.password
  });
  if (result.success && result.data.token) {
    logTest('Login Student', 'pass', 'Token received');
    testData.tokens.student = result.data.token;
    TEST_RESULTS.passed.push('Login Student');
  } else {
    logTest('Login Student', 'fail', result.error);
    TEST_RESULTS.failed.push('Login Student');
  }

  await sleep(500);

  // Login HOD
  result = await makeRequest('POST', '/api/auth/login', {
    email: testUsers.hod.email,
    password: testUsers.hod.password
  });
  if (result.success && result.data.token) {
    logTest('Login HOD', 'pass', 'Token received');
    testData.tokens.hod = result.data.token;
    TEST_RESULTS.passed.push('Login HOD');
  } else {
    logTest('Login HOD', 'fail', result.error);
    TEST_RESULTS.failed.push('Login HOD');
  }

  await sleep(500);

  // Login TPO
  result = await makeRequest('POST', '/api/auth/login', {
    email: testUsers.tpo.email,
    password: testUsers.tpo.password
  });
  if (result.success && result.data.token) {
    logTest('Login TPO', 'pass', 'Token received');
    testData.tokens.tpo = result.data.token;
    TEST_RESULTS.passed.push('Login TPO');
  } else {
    logTest('Login TPO', 'fail', result.error);
    TEST_RESULTS.failed.push('Login TPO');
  }

  await sleep(500);

  // Get current user (Student)
  result = await makeRequest('GET', '/api/auth/me', null, testData.tokens.student);
  if (result.success) {
    logTest('Get current user', 'pass', `Name: ${result.data.user?.name}`);
    TEST_RESULTS.passed.push('Get Current User');
  } else {
    logTest('Get current user', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Current User');
  }

  await sleep(500);

  // Test unauthorized access
  result = await makeRequest('GET', '/api/auth/me', null, 'invalid-token');
  if (!result.success && result.status === 401) {
    logTest('Authorization validation', 'pass', 'Correctly rejected invalid token');
    TEST_RESULTS.passed.push('Authorization Validation');
  } else {
    logTest('Authorization validation', 'fail', 'Should reject invalid token');
    TEST_RESULTS.failed.push('Authorization Validation');
  }
}

async function testStudentAPIs() {
  logSection('🎓 STUDENT APIs');

  const token = testData.tokens.student;

  // Get student profile
  let result = await makeRequest('GET', '/api/student/profile', null, token);
  if (result.success) {
    logTest('Get student profile', 'pass', `Email: ${result.data.profile?.email}`);
    TEST_RESULTS.passed.push('Get Student Profile');
  } else {
    logTest('Get student profile', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Student Profile');
  }

  await sleep(500);

  // Update student profile
  result = await makeRequest('PUT', '/api/student/profile', {
    cgpa: 8.7,
    skills: ['JavaScript', 'Python', 'React']
  }, token);
  if (result.success) {
    logTest('Update student profile', 'pass', 'Profile updated');
    TEST_RESULTS.passed.push('Update Student Profile');
  } else {
    logTest('Update student profile', 'fail', result.error);
    TEST_RESULTS.failed.push('Update Student Profile');
  }

  await sleep(500);

  // Get student dashboard
  result = await makeRequest('GET', '/api/student/dashboard', null, token);
  if (result.success) {
    logTest('Get student dashboard', 'pass', 'Dashboard data retrieved');
    TEST_RESULTS.passed.push('Student Dashboard');
  } else {
    logTest('Get student dashboard', 'fail', result.error);
    TEST_RESULTS.failed.push('Student Dashboard');
  }

  await sleep(500);

  // Get active drives
  result = await makeRequest('GET', '/api/student/drives/active', null, token);
  if (result.success) {
    logTest('Get active drives', 'pass', `Found ${result.data.drives?.length || 0} drives`);
    TEST_RESULTS.passed.push('Get Active Drives');
  } else {
    logTest('Get active drives', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Active Drives');
  }

  await sleep(500);

  // Get my applications
  result = await makeRequest('GET', '/api/student/applications', null, token);
  if (result.success) {
    logTest('Get my applications', 'pass', `Found ${result.data.applications?.length || 0} applications`);
    TEST_RESULTS.passed.push('Get Applications');
  } else {
    logTest('Get my applications', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Applications');
  }
}

async function testHODAPIs() {
  logSection('👔 HOD APIs');

  const token = testData.tokens.hod;

  // Get HOD dashboard
  let result = await makeRequest('GET', '/api/hod/dashboard', null, token);
  if (result.success) {
    logTest('Get HOD dashboard', 'pass', 'Dashboard data retrieved');
    TEST_RESULTS.passed.push('HOD Dashboard');
  } else {
    logTest('Get HOD dashboard', 'fail', result.error);
    TEST_RESULTS.failed.push('HOD Dashboard');
  }

  await sleep(500);

  // Get pending approvals
  result = await makeRequest('GET', '/api/hod/approvals/pending', null, token);
  if (result.success) {
    logTest('Get pending approvals', 'pass', `Found ${result.data.approvals?.length || 0} pending`);
    TEST_RESULTS.passed.push('Pending Approvals');
  } else {
    logTest('Get pending approvals', 'fail', result.error);
    TEST_RESULTS.failed.push('Pending Approvals');
  }

  await sleep(500);

  // Get department students
  result = await makeRequest('GET', '/api/hod/students', null, token);
  if (result.success) {
    logTest('Get department students', 'pass', `Found ${result.data.students?.length || 0} students`);
    TEST_RESULTS.passed.push('Department Students');
  } else {
    logTest('Get department students', 'fail', result.error);
    TEST_RESULTS.failed.push('Department Students');
  }

  await sleep(500);

  // Get department statistics
  result = await makeRequest('GET', '/api/hod/statistics', null, token);
  if (result.success) {
    logTest('Get department statistics', 'pass', 'Statistics retrieved');
    TEST_RESULTS.passed.push('Department Statistics');
  } else {
    logTest('Get department statistics', 'fail', result.error);
    TEST_RESULTS.failed.push('Department Statistics');
  }

  await sleep(500);

  // Get placement report
  result = await makeRequest('GET', '/api/hod/reports/placement', null, token);
  if (result.success) {
    logTest('Get placement report', 'pass', 'Report generated');
    TEST_RESULTS.passed.push('Placement Report');
  } else {
    logTest('Get placement report', 'fail', result.error);
    TEST_RESULTS.failed.push('Placement Report');
  }
}

async function testTPOAPIs() {
  logSection('🏢 TPO APIs');

  const token = testData.tokens.tpo;

  // Get TPO dashboard
  let result = await makeRequest('GET', '/api/tpo/dashboard', null, token);
  if (result.success) {
    logTest('Get TPO dashboard', 'pass', 'Dashboard data retrieved');
    TEST_RESULTS.passed.push('TPO Dashboard');
  } else {
    logTest('Get TPO dashboard', 'fail', result.error);
    TEST_RESULTS.failed.push('TPO Dashboard');
  }

  await sleep(500);

  // Add new company
  result = await makeRequest('POST', '/api/tpo/companies', {
    name: 'Test Company Ltd',
    industry: 'IT Services',
    website: 'https://testcompany.com',
    description: 'A test company for API testing'
  }, token);
  if (result.success) {
    logTest('Add new company', 'pass', `Company ID: ${result.data.company?.id}`);
    testData.companyId = result.data.company?.id;
    TEST_RESULTS.passed.push('Add Company');
  } else {
    logTest('Add new company', 'fail', result.error);
    TEST_RESULTS.failed.push('Add Company');
  }

  await sleep(500);

  // Get all companies
  result = await makeRequest('GET', '/api/tpo/companies', null, token);
  if (result.success) {
    logTest('Get all companies', 'pass', `Found ${result.data.companies?.length || 0} companies`);
    TEST_RESULTS.passed.push('Get Companies');
  } else {
    logTest('Get all companies', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Companies');
  }

  await sleep(500);

  // Create placement drive
  result = await makeRequest('POST', '/api/tpo/drives', {
    companyName: 'Test Company Ltd',
    jobRole: 'Software Engineer',
    jobDescription: 'Hiring fresh graduates for Software Engineer role',
    package: 650000,  // Package as number (in rupees)
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedDepartments: ['Computer Science', 'IT'],
      maxBacklogs: 0,
      graduationYear: [2024, 2025]
    },
    applicationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai',
    jobType: 'Full-time'
  }, token);
  if (result.success) {
    logTest('Create placement drive', 'pass', `Drive ID: ${result.data.drive?.id}`);
    testData.driveId = result.data.drive?.id;
    TEST_RESULTS.passed.push('Create Drive');
  } else {
    const errorDetails = result.details?.errors ? JSON.stringify(result.details.errors) : result.error;
    logTest('Create placement drive', 'fail', errorDetails);
    TEST_RESULTS.failed.push('Create Drive');
  }

  await sleep(500);

  // Get all drives
  result = await makeRequest('GET', '/api/tpo/drives', null, token);
  if (result.success) {
    logTest('Get all drives', 'pass', `Found ${result.data.drives?.length || 0} drives`);
    TEST_RESULTS.passed.push('Get All Drives');
  } else {
    logTest('Get all drives', 'fail', result.error);
    TEST_RESULTS.failed.push('Get All Drives');
  }
}

async function testDriveAPIs() {
  logSection('🚀 PLACEMENT DRIVE APIs');

  const token = testData.tokens.student;

  // Get all drives
  let result = await makeRequest('GET', '/api/drives', null, token);
  if (result.success) {
    logTest('Get all drives', 'pass', `Found ${result.data.drives?.length || 0} drives`);
    TEST_RESULTS.passed.push('Get Drives');
  } else {
    logTest('Get all drives', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Drives');
  }

  await sleep(500);

  // Get active drives
  result = await makeRequest('GET', '/api/drives/active', null, token);
  if (result.success) {
    logTest('Get active drives', 'pass', `Found ${result.data.drives?.length || 0} active drives`);
    TEST_RESULTS.passed.push('Get Active Drives (Public)');
  } else {
    logTest('Get active drives', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Active Drives (Public)');
  }

  await sleep(500);

  // Get upcoming drives
  result = await makeRequest('GET', '/api/drives/upcoming', null, token);
  if (result.success) {
    logTest('Get upcoming drives', 'pass', `Found ${result.data.drives?.length || 0} upcoming drives`);
    TEST_RESULTS.passed.push('Get Upcoming Drives');
  } else {
    logTest('Get upcoming drives', 'fail', result.error);
    TEST_RESULTS.failed.push('Get Upcoming Drives');
  }

  await sleep(500);

  // Search drives
  result = await makeRequest('GET', '/api/drives/search?query=Software', null, token);
  if (result.success) {
    logTest('Search drives', 'pass', `Found ${result.data.drives?.length || 0} matching drives`);
    TEST_RESULTS.passed.push('Search Drives');
  } else {
    logTest('Search drives', 'fail', result.error);
    TEST_RESULTS.failed.push('Search Drives');
  }

  await sleep(500);

  if (testData.driveId) {
    // Get drive by ID
    result = await makeRequest('GET', `/api/drives/${testData.driveId}`, null, token);
    if (result.success) {
      logTest('Get drive by ID', 'pass', `Drive: ${result.data.drive?.title}`);
      TEST_RESULTS.passed.push('Get Drive By ID');
    } else {
      logTest('Get drive by ID', 'fail', result.error);
      TEST_RESULTS.failed.push('Get Drive By ID');
    }

    await sleep(500);

    // Check eligibility
    result = await makeRequest('GET', `/api/drives/${testData.driveId}/check-eligibility`, null, token);
    if (result.success) {
      logTest('Check drive eligibility', 'pass', `Eligible: ${result.data.eligible}`);
      TEST_RESULTS.passed.push('Check Eligibility');
    } else {
      logTest('Check drive eligibility', 'fail', result.error);
      TEST_RESULTS.failed.push('Check Eligibility');
    }

    await sleep(500);

    // Apply to drive
    result = await makeRequest('POST', `/api/student/drives/${testData.driveId}/apply`, {}, token);
    if (result.success) {
      logTest('Apply to drive', 'pass', `Application ID: ${result.data.application?.id}`);
      testData.applicationId = result.data.application?.id;
      TEST_RESULTS.passed.push('Apply To Drive');
    } else {
      logTest('Apply to drive', 'fail', result.error);
      TEST_RESULTS.failed.push('Apply To Drive');
    }

    await sleep(500);

    // Get drive statistics
    result = await makeRequest('GET', `/api/drives/${testData.driveId}/stats`, null, token);
    if (result.success) {
      logTest('Get drive statistics', 'pass', 'Statistics retrieved');
      TEST_RESULTS.passed.push('Drive Statistics');
    } else {
      logTest('Get drive statistics', 'fail', result.error);
      TEST_RESULTS.failed.push('Drive Statistics');
    }
  }
}

async function testFileUploadAPIs() {
  logSection('📤 FILE UPLOAD & ATS APIs');

  const token = testData.tokens.student;

  // Check if test PDF exists
  const testPdfPath = path.join(__dirname, 'uploads', 'documents', 'Sample Resumes.pdf');
  if (!fs.existsSync(testPdfPath)) {
    logTest('Upload resume with ATS', 'skip', 'No test PDF found');
    TEST_RESULTS.skipped.push('Upload Resume');
    return;
  }

  // Upload resume with ATS scoring
  const formData = new FormData();
  formData.append('resume', fs.createReadStream(testPdfPath));
  
  let result = await makeRequest('POST', '/api/upload/resume', formData, token, true);
  if (result.success) {
    logTest('Upload resume with ATS', 'pass', `Score: ${result.data.data?.atsScore}/100`);
    TEST_RESULTS.passed.push('Upload Resume');
  } else {
    logTest('Upload resume with ATS', 'fail', result.error);
    TEST_RESULTS.failed.push('Upload Resume');
  }

  await sleep(500);

  // Get ATS score
  result = await makeRequest('GET', '/api/upload/ats-score', null, token);
  if (result.success) {
    logTest('Get ATS score', 'pass', `Score: ${result.data.data?.atsScore}/100`);
    TEST_RESULTS.passed.push('Get ATS Score');
  } else {
    logTest('Get ATS score', 'fail', result.error);
    TEST_RESULTS.failed.push('Get ATS Score');
  }

  await sleep(500);

  // Re-analyze resume
  result = await makeRequest('POST', '/api/upload/reanalyze-resume', {}, token);
  if (result.success) {
    logTest('Re-analyze resume', 'pass', `New score: ${result.data.data?.atsScore}/100`);
    TEST_RESULTS.passed.push('Reanalyze Resume');
  } else {
    logTest('Re-analyze resume', 'fail', result.error);
    TEST_RESULTS.failed.push('Reanalyze Resume');
  }

  await sleep(500);

  // List files in resumes folder
  result = await makeRequest('GET', '/api/upload/list/resumes', null, token);
  if (result.success) {
    logTest('List uploaded files', 'pass', `Found ${result.data.files?.length || 0} files`);
    TEST_RESULTS.passed.push('List Files');
  } else {
    logTest('List uploaded files', 'fail', result.error);
    TEST_RESULTS.failed.push('List Files');
  }
}

async function testRoleBasedAccess() {
  logSection('🔒 ROLE-BASED ACCESS CONTROL');

  // Student trying to access HOD endpoint
  let result = await makeRequest('GET', '/api/hod/dashboard', null, testData.tokens.student);
  if (!result.success && result.status === 403) {
    logTest('Student → HOD endpoint (should fail)', 'pass', 'Correctly denied access');
    TEST_RESULTS.passed.push('RBAC: Student→HOD');
  } else {
    logTest('Student → HOD endpoint (should fail)', 'fail', 'Should deny access');
    TEST_RESULTS.failed.push('RBAC: Student→HOD');
  }

  await sleep(500);

  // Student trying to access TPO endpoint
  result = await makeRequest('GET', '/api/tpo/dashboard', null, testData.tokens.student);
  if (!result.success && result.status === 403) {
    logTest('Student → TPO endpoint (should fail)', 'pass', 'Correctly denied access');
    TEST_RESULTS.passed.push('RBAC: Student→TPO');
  } else {
    logTest('Student → TPO endpoint (should fail)', 'fail', 'Should deny access');
    TEST_RESULTS.failed.push('RBAC: Student→TPO');
  }

  await sleep(500);

  // HOD trying to access TPO endpoint
  result = await makeRequest('POST', '/api/tpo/companies', { name: 'Test' }, testData.tokens.hod);
  if (!result.success && result.status === 403) {
    logTest('HOD → TPO endpoint (should fail)', 'pass', 'Correctly denied access');
    TEST_RESULTS.passed.push('RBAC: HOD→TPO');
  } else {
    logTest('HOD → TPO endpoint (should fail)', 'fail', 'Should deny access');
    TEST_RESULTS.failed.push('RBAC: HOD→TPO');
  }
}

async function testEmailAPIs() {
  logSection('📧 EMAIL APIs (Dev Only)');

  // Test email connection
  let result = await makeRequest('GET', '/api/test/email/connection');
  if (result.success || result.status === 404) {
    const status = result.success ? 'pass' : 'skip';
    logTest('Test email connection', status, result.success ? 'Connection OK' : 'Endpoint not available');
    if (result.success) TEST_RESULTS.passed.push('Email Connection');
    else TEST_RESULTS.skipped.push('Email Connection');
  } else {
    logTest('Test email connection', 'fail', result.error);
    TEST_RESULTS.failed.push('Email Connection');
  }
}

async function printSummary() {
  logSection('📊 TEST SUMMARY');

  const total = TEST_RESULTS.passed.length + TEST_RESULTS.failed.length + TEST_RESULTS.skipped.length;
  const passRate = ((TEST_RESULTS.passed.length / (total - TEST_RESULTS.skipped.length)) * 100).toFixed(2);

  log(`\nTotal Tests: ${total}`, 'bright');
  log(`✓ Passed: ${TEST_RESULTS.passed.length}`, 'green');
  log(`✗ Failed: ${TEST_RESULTS.failed.length}`, 'red');
  log(`⊘ Skipped: ${TEST_RESULTS.skipped.length}`, 'yellow');
  log(`Pass Rate: ${passRate}%`, TEST_RESULTS.failed.length === 0 ? 'green' : 'yellow');

  if (TEST_RESULTS.failed.length > 0) {
    log('\n❌ Failed Tests:', 'red');
    TEST_RESULTS.failed.forEach(test => log(`   • ${test}`, 'red'));
  }

  if (TEST_RESULTS.skipped.length > 0) {
    log('\n⊘ Skipped Tests:', 'yellow');
    TEST_RESULTS.skipped.forEach(test => log(`   • ${test}`, 'yellow'));
  }

  log('\n' + '═'.repeat(70));
  
  if (TEST_RESULTS.failed.length === 0) {
    log('🎉 All tests passed successfully!', 'green');
  } else {
    log('⚠️  Some tests failed. Please check the details above.', 'yellow');
  }
}

// Main execution
async function runAllTests() {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'bright');
  log('║          COLLEGE PLACEMENT MANAGER - API TEST SUITE          ║', 'bright');
  log('╚═══════════════════════════════════════════════════════════════╝', 'bright');
  
  log(`\n🌐 Base URL: ${BASE_URL}`, 'blue');
  log(`⏰ Started at: ${new Date().toLocaleString()}`, 'gray');

  try {
    // Check server health first
    const isHealthy = await testHealthCheck();
    if (!isHealthy) {
      log('\n❌ Server is not running. Please start the server first.', 'red');
      log('   Run: npm run dev', 'yellow');
      return;
    }

    // Run all test suites
    await testAuthenticationAPIs();
    await sleep(1000);
    
    await testStudentAPIs();
    await sleep(1000);
    
    await testHODAPIs();
    await sleep(1000);
    
    await testTPOAPIs();
    await sleep(1000);
    
    await testDriveAPIs();
    await sleep(1000);
    
    await testFileUploadAPIs();
    await sleep(1000);
    
    await testRoleBasedAccess();
    await sleep(1000);
    
    await testEmailAPIs();
    
    // Print summary
    await printSummary();

    log(`\n⏰ Completed at: ${new Date().toLocaleString()}`, 'gray');
    log('═'.repeat(70) + '\n');

  } catch (error) {
    log('\n❌ Fatal error during testing:', 'red');
    log(error.message, 'red');
    console.error(error);
  }
}

// Run the tests
runAllTests().catch(console.error);
