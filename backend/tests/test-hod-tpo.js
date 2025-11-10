/**
 * HOD & TPO Functionality Test Script
 * Comprehensive testing for Head of Department and Training & Placement Officer functionalities
 * 
 * Usage: node test-hod-tpo.js
 */

const BASE_URL = 'http://localhost:3000/api';

// Store tokens and test data
const testData = {
  studentToken: '',
  hodToken: '',
  tpoToken: '',
  driveId: '',
  applicationId: '',
  studentId: '',
  companyId: '',
  testUsers: []
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: [],
  startTime: Date.now()
};

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper function to make HTTP requests (using Node.js built-in fetch for Node 18+)
async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    let responseData;
    
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = { message: 'No JSON response' };
    }
    
    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
      headers: response.headers
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      networkError: true
    };
  }
}

// Test runner with detailed logging
async function runTest(name, testFn, category = 'General') {
  results.total++;
  console.log(`\n${colors.blue}🧪 [${category}] Testing: ${name}${colors.reset}`);
  
  try {
    const startTime = Date.now();
    await testFn();
    const endTime = Date.now();
    
    results.passed++;
    results.tests.push({ 
      name, 
      category,
      status: 'PASSED', 
      duration: endTime - startTime 
    });
    console.log(`${colors.green}✅ PASSED (${endTime - startTime}ms)${colors.reset}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ 
      name, 
      category,
      status: 'FAILED', 
      error: error.message 
    });
    console.log(`${colors.red}❌ FAILED: ${error.message}${colors.reset}`);
  }
}

// Enhanced assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertStatus(response, expectedStatus, customMessage = '') {
  const message = customMessage || `Expected status ${expectedStatus}, got ${response.status}`;
  if (response.networkError) {
    throw new Error(`Network error: ${response.error}`);
  }
  assert(response.status === expectedStatus, message);
}

function assertSuccess(response, customMessage = '') {
  assertStatus(response, 200, customMessage);
  assert(response.data.success === true, 'Response should indicate success');
}

// Delay helper for rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== AUTHENTICATION SETUP ====================

async function setupAuthentication() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}🔐 AUTHENTICATION SETUP${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Setup test users
  const testUsers = [
    {
      name: 'Test Student 1',
      email: 'student1@test.com',
      password: 'Password123!',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2024001',
      phone: '9876543210'
    },
    {
      name: 'Test Student 2',
      email: 'student2@test.com',
      password: 'Password123!',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2024002',
      phone: '9876543211'
    },
    {
      name: 'Dr. HOD Smith',
      email: 'hod@test.com',
      password: 'Password123!',
      role: 'hod',
      department: 'Computer Science',
      phone: '9876543212'
    },
    {
      name: 'TPO Officer',
      email: 'tpo@test.com',
      password: 'Password123!',
      role: 'tpo',
      department: 'Placement Cell',
      phone: '9876543213'
    }
  ];

  // Register and login users
  for (const user of testUsers) {
    await runTest(`Register ${user.role.toUpperCase()} - ${user.name}`, async () => {
      // Try login first in case user already exists
      let response = await makeRequest('POST', '/auth/login', {
        email: user.email,
        password: user.password
      });

      if (response.status !== 200) {
        // Register if login fails
        response = await makeRequest('POST', '/auth/register', user);
        assertStatus(response, 201, `Failed to register ${user.role}`);
      }

      assert(response.data.token, 'Token not received');
      
      // Store tokens
      if (user.role === 'student' && user.email === 'student1@test.com') {
        testData.studentToken = response.data.token;
        testData.studentId = response.data.user?.id || 'student_1';
      } else if (user.role === 'hod') {
        testData.hodToken = response.data.token;
      } else if (user.role === 'tpo') {
        testData.tpoToken = response.data.token;
      }

      testData.testUsers.push({
        ...user,
        token: response.data.token,
        id: response.data.user?.id
      });
    }, 'Auth');

    await delay(100); // Prevent rate limiting
  }
}

// ==================== HOD FUNCTIONALITY TESTS ====================

async function hodFunctionalityTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}👨‍💼 HOD FUNCTIONALITY TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test HOD Dashboard
  await runTest('HOD Dashboard Access', async () => {
    const response = await makeRequest('GET', '/hod/dashboard', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to access dashboard');
    assert(response.data.dashboard, 'Dashboard data should be present');
  }, 'HOD');

  // Test Get Pending Approvals
  await runTest('Get Pending Student Approvals', async () => {
    const response = await makeRequest('GET', '/hod/approvals/pending', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to get pending approvals');
    assert(typeof response.data.count === 'number', 'Count should be a number');
    assert(Array.isArray(response.data.students), 'Students should be an array');
  }, 'HOD');

  // Test Student Approval
  await runTest('Approve Student Registration', async () => {
    const response = await makeRequest('POST', `/hod/approvals/${testData.studentId}/approve`, {}, testData.hodToken);
    assertSuccess(response, 'HOD should be able to approve student');
    assert(response.data.message.includes('approved'), 'Success message should mention approval');
  }, 'HOD');

  // Test Student Rejection
  await runTest('Reject Student Registration', async () => {
    const response = await makeRequest('POST', '/hod/approvals/student_2/reject', {
      reason: 'Incomplete documentation'
    }, testData.hodToken);
    assertSuccess(response, 'HOD should be able to reject student');
    assert(response.data.message.includes('rejected'), 'Success message should mention rejection');
  }, 'HOD');

  // Test Get Department Students
  await runTest('Get Department Students', async () => {
    const response = await makeRequest('GET', '/hod/students', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to get department students');
    assert(Array.isArray(response.data.students), 'Students should be an array');
  }, 'HOD');

  // Test Get Department Students with Pagination
  await runTest('Get Department Students with Pagination', async () => {
    const response = await makeRequest('GET', '/hod/students?page=1&limit=5', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to get paginated students');
    assert(response.data.students.length <= 5, 'Should respect limit parameter');
  }, 'HOD');

  // Test Get Department Students with Search
  await runTest('Search Department Students', async () => {
    const response = await makeRequest('GET', '/hod/students?search=John', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to search students');
    assert(Array.isArray(response.data.students), 'Students should be an array');
  }, 'HOD');

  // Test Get Student Details
  await runTest('Get Specific Student Details', async () => {
    const response = await makeRequest('GET', `/hod/students/${testData.studentId}`, null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to get student details');
    assert(response.data.student, 'Student data should be present');
  }, 'HOD');

  // Test Verify Student Profile
  await runTest('Verify Student Profile', async () => {
    const response = await makeRequest('POST', `/hod/students/${testData.studentId}/verify`, {
      verificationStatus: 'verified',
      comments: 'Profile verified successfully'
    }, testData.hodToken);
    assertSuccess(response, 'HOD should be able to verify student profile');
  }, 'HOD');

  // Test Get Department Statistics
  await runTest('Get Department Statistics', async () => {
    const response = await makeRequest('GET', '/hod/statistics', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to get department statistics');
    assert(response.data.stats, 'Statistics data should be present');
  }, 'HOD');

  // Test Get Placement Report
  await runTest('Get Placement Report', async () => {
    const response = await makeRequest('GET', '/hod/reports/placement', null, testData.hodToken);
    assertSuccess(response, 'HOD should be able to get placement report');
    assert(response.data.report, 'Report data should be present');
  }, 'HOD');

  // Test HOD Access Control - Student endpoint should fail
  await runTest('HOD Access Control Test (Should Fail for Student Endpoints)', async () => {
    const response = await makeRequest('GET', '/student/profile', null, testData.hodToken);
    assert(response.status === 403 || response.status === 401, 'HOD should not access student-specific endpoints');
  }, 'HOD');
}

// ==================== TPO FUNCTIONALITY TESTS ====================

async function tpoFunctionalityTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}📊 TPO FUNCTIONALITY TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test TPO Dashboard
  await runTest('TPO Dashboard Access', async () => {
    const response = await makeRequest('GET', '/tpo/dashboard', null, testData.tpoToken);
    assertSuccess(response, 'TPO should be able to access dashboard');
    assert(response.data.dashboard, 'Dashboard data should be present');
  }, 'TPO');

  // Test Add Company
  await runTest('Add New Company', async () => {
    const response = await makeRequest('POST', '/tpo/companies', {
      name: 'Google Inc.',
      website: 'https://google.com',
      industry: 'Technology',
      description: 'Global technology company',
      hrEmail: 'hr@google.com',
      hrPhone: '1234567890'
    }, testData.tpoToken);
    
    assertStatus(response, 201, 'Should successfully create company');
    assert(response.data.success, 'Response should indicate success');
    if (response.data.company && response.data.company.id) {
      testData.companyId = response.data.company.id;
    }
  }, 'TPO');

  // Test Get All Companies
  await runTest('Get All Companies', async () => {
    const response = await makeRequest('GET', '/tpo/companies', null, testData.tpoToken);
    assertSuccess(response, 'TPO should be able to get all companies');
    assert(Array.isArray(response.data.companies), 'Companies should be an array');
  }, 'TPO');

  // Test Create Placement Drive
  await runTest('Create Placement Drive', async () => {
    const response = await makeRequest('POST', '/tpo/drives', {
      companyName: 'Google Inc.',
      jobRole: 'Software Engineer',
      jobDescription: 'Full stack development role',
      package: '25 LPA',
      eligibilityCriteria: {
        minCGPA: 7.5,
        allowedDepartments: ['Computer Science', 'Information Technology'],
        maxBacklogs: 0,
        graduationYear: 2024
      },
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Campus',
      jobType: 'Full-time'
    }, testData.tpoToken);
    
    assertStatus(response, 201, 'Should successfully create placement drive');
    assert(response.data.success, 'Response should indicate success');
    if (response.data.drive && response.data.drive.id) {
      testData.driveId = response.data.drive.id;
    }
  }, 'TPO');

  // Test Get All Drives
  await runTest('Get All Placement Drives', async () => {
    const response = await makeRequest('GET', '/tpo/drives', null, testData.tpoToken);
    assertSuccess(response, 'TPO should be able to get all drives');
    assert(Array.isArray(response.data.drives), 'Drives should be an array');
    assert(typeof response.data.total === 'number', 'Total count should be present');
  }, 'TPO');

  // Test Get Drives with Filters
  await runTest('Get Drives with Status Filter', async () => {
    const response = await makeRequest('GET', '/tpo/drives?status=active', null, testData.tpoToken);
    assertSuccess(response, 'TPO should be able to filter drives by status');
    assert(Array.isArray(response.data.drives), 'Drives should be an array');
  }, 'TPO');

  // Test Get Drives with Search
  await runTest('Search Placement Drives', async () => {
    const response = await makeRequest('GET', '/tpo/drives?search=Google', null, testData.tpoToken);
    assertSuccess(response, 'TPO should be able to search drives');
    assert(Array.isArray(response.data.drives), 'Drives should be an array');
  }, 'TPO');

  // Test Update Placement Drive
  await runTest('Update Placement Drive', async () => {
    const response = await makeRequest('PUT', `/tpo/drives/${testData.driveId}`, {
      package: '30 LPA',
      jobDescription: 'Updated job description with more details'
    }, testData.tpoToken);
    
    assertSuccess(response, 'TPO should be able to update drive');
    assert(response.data.message.includes('updated'), 'Success message should mention update');
  }, 'TPO');

  // Test Get Applications for Drive
  await runTest('Get Applications for Drive', async () => {
    const response = await makeRequest('GET', `/tpo/drives/${testData.driveId}/applications`, null, testData.tpoToken);
    assertSuccess(response, 'TPO should be able to get drive applications');
    assert(Array.isArray(response.data.applications), 'Applications should be an array');
  }, 'TPO');

  // Test Update Application Status
  await runTest('Update Application Status', async () => {
    const response = await makeRequest('PUT', '/tpo/applications/app_1/status', {
      status: 'shortlisted',
      comments: 'Good profile, shortlisted for interview'
    }, testData.tpoToken);
    
    assertSuccess(response, 'TPO should be able to update application status');
  }, 'TPO');

  // Test Bulk Update Applications
  await runTest('Bulk Update Application Status', async () => {
    const response = await makeRequest('POST', '/tpo/applications/bulk-update', {
      applicationIds: ['app_1', 'app_2', 'app_3'],
      status: 'under_review',
      comments: 'Applications under review'
    }, testData.tpoToken);
    
    assertSuccess(response, 'TPO should be able to bulk update applications');
  }, 'TPO');

  // Test Send Notification
  await runTest('Send Notification to Students', async () => {
    const response = await makeRequest('POST', '/tpo/notifications', {
      title: 'New Placement Drive',
      message: 'A new placement drive has been added. Check your dashboard.',
      recipients: 'all',
      type: 'drive_announcement'
    }, testData.tpoToken);
    
    assertSuccess(response, 'TPO should be able to send notifications');
  }, 'TPO');

  // Test Close Placement Drive
  await runTest('Close Placement Drive', async () => {
    const response = await makeRequest('POST', `/tpo/drives/${testData.driveId}/close`, {
      reason: 'Drive completed successfully'
    }, testData.tpoToken);
    
    assertSuccess(response, 'TPO should be able to close drive');
  }, 'TPO');

  // Test TPO Access Control
  await runTest('TPO Access Control Test (Should Fail for Student Endpoints)', async () => {
    const response = await makeRequest('GET', '/student/profile', null, testData.tpoToken);
    assert(response.status === 403 || response.status === 401, 'TPO should not access student-specific endpoints');
  }, 'TPO');
}

// ==================== INTEGRATION TESTS ====================

async function integrationTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}🔗 INTEGRATION TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test HOD and TPO collaboration workflow
  await runTest('HOD-TPO Collaboration: Student Approval to Drive Application', async () => {
    // 1. HOD approves a student
    let response = await makeRequest('POST', `/hod/approvals/${testData.studentId}/approve`, {}, testData.hodToken);
    assertSuccess(response, 'HOD should approve student');

    // 2. TPO creates a drive
    response = await makeRequest('POST', '/tpo/drives', {
      companyName: 'Microsoft',
      jobRole: 'Software Developer',
      jobDescription: 'Full stack development',
      package: '22 LPA',
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science'],
        maxBacklogs: 1,
        graduationYear: 2024
      },
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      driveDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Virtual',
      jobType: 'Full-time'
    }, testData.tpoToken);
    
    assertStatus(response, 201, 'TPO should create drive');
    
    // 3. Check if approved student can see the drive (mock check)
    response = await makeRequest('GET', '/tpo/drives', null, testData.tpoToken);
    assertSuccess(response, 'Drive should be accessible');
  }, 'Integration');

  // Test Error Handling
  await runTest('Error Handling: Invalid Drive ID', async () => {
    const response = await makeRequest('GET', '/tpo/drives/invalid_id/applications', null, testData.tpoToken);
    assert(response.status >= 400 && response.status < 500, 'Should return client error for invalid ID');
  }, 'Integration');

  // Test Authorization
  await runTest('Authorization: HOD Cannot Access TPO Endpoints', async () => {
    const response = await makeRequest('POST', '/tpo/drives', {
      companyName: 'Test Company',
      jobRole: 'Test Role'
    }, testData.hodToken);
    
    assert(response.status === 403 || response.status === 401, 'HOD should not access TPO endpoints');
  }, 'Integration');

  await runTest('Authorization: TPO Cannot Access HOD Approval Endpoints', async () => {
    const response = await makeRequest('GET', '/hod/approvals/pending', null, testData.tpoToken);
    assert(response.status === 403 || response.status === 401, 'TPO should not access HOD approval endpoints');
  }, 'Integration');
}

// ==================== PERFORMANCE TESTS ====================

async function performanceTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}⚡ PERFORMANCE TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test Response Time
  await runTest('Response Time Test - HOD Dashboard', async () => {
    const startTime = Date.now();
    const response = await makeRequest('GET', '/hod/dashboard', null, testData.hodToken);
    const endTime = Date.now();
    
    assertSuccess(response, 'HOD dashboard should be accessible');
    const responseTime = endTime - startTime;
    assert(responseTime < 2000, `Response time should be under 2s, got ${responseTime}ms`);
    console.log(`    Response time: ${responseTime}ms`);
  }, 'Performance');

  await runTest('Response Time Test - TPO Drives List', async () => {
    const startTime = Date.now();
    const response = await makeRequest('GET', '/tpo/drives', null, testData.tpoToken);
    const endTime = Date.now();
    
    assertSuccess(response, 'TPO drives should be accessible');
    const responseTime = endTime - startTime;
    assert(responseTime < 2000, `Response time should be under 2s, got ${responseTime}ms`);
    console.log(`    Response time: ${responseTime}ms`);
  }, 'Performance');

  // Test Concurrent Requests
  await runTest('Concurrent Requests Test', async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(makeRequest('GET', '/hod/students', null, testData.hodToken));
      promises.push(makeRequest('GET', '/tpo/drives', null, testData.tpoToken));
    }
    
    const responses = await Promise.all(promises);
    const successCount = responses.filter(r => r.ok).length;
    
    assert(successCount >= 8, `Expected at least 8 successful responses, got ${successCount}`);
  }, 'Performance');
}

// ==================== MAIN TEST RUNNER ====================

async function runAllTests() {
  console.log(`${colors.bold}${colors.cyan}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║          COLLEGE PLACEMENT MANAGEMENT - HOD & TPO TESTS       ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.yellow}Testing against: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.yellow}Started at: ${new Date().toLocaleString()}${colors.reset}`);

  try {
    // Check if server is running
    console.log(`\n${colors.blue}🔍 Checking server connection...${colors.reset}`);
    const healthCheck = await makeRequest('GET', '/health').catch(() => ({ status: 0 }));
    
    if (healthCheck.status === 0) {
      console.log(`${colors.red}❌ Server is not running at ${BASE_URL}${colors.reset}`);
      console.log(`${colors.yellow}Please start the server with: npm run dev${colors.reset}`);
      return;
    }

    // Run test suites
    await setupAuthentication();
    await hodFunctionalityTests();
    await tpoFunctionalityTests();
    await integrationTests();
    await performanceTests();

  } catch (error) {
    console.error(`${colors.red}💥 Unexpected error during testing: ${error.message}${colors.reset}`);
  }

  // Print detailed results
  printTestResults();
}

function printTestResults() {
  const duration = Date.now() - results.startTime;
  const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;

  console.log(`\n${colors.bold}${colors.cyan}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║                        TEST RESULTS                           ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}`);

  console.log(`\n${colors.bold}📊 Summary:${colors.reset}`);
  console.log(`   Total Tests: ${results.total}`);
  console.log(`   ${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`   ${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(`   ${colors.yellow}📈 Success Rate: ${successRate}%${colors.reset}`);
  console.log(`   ⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);

  // Group results by category
  const categories = {};
  results.tests.forEach(test => {
    if (!categories[test.category]) {
      categories[test.category] = { passed: 0, failed: 0, tests: [] };
    }
    categories[test.category].tests.push(test);
    if (test.status === 'PASSED') {
      categories[test.category].passed++;
    } else {
      categories[test.category].failed++;
    }
  });

  console.log(`\n${colors.bold}📋 Results by Category:${colors.reset}`);
  Object.entries(categories).forEach(([category, data]) => {
    const categorySuccess = data.tests.length > 0 ? ((data.passed / data.tests.length) * 100).toFixed(1) : 0;
    console.log(`\n${colors.bold}${category}:${colors.reset} ${data.passed}/${data.tests.length} (${categorySuccess}%)`);
    
    data.tests.forEach(test => {
      const status = test.status === 'PASSED' 
        ? `${colors.green}✅${colors.reset}` 
        : `${colors.red}❌${colors.reset}`;
      const duration = test.duration ? ` (${test.duration}ms)` : '';
      console.log(`   ${status} ${test.name}${duration}`);
      if (test.error) {
        console.log(`      ${colors.red}Error: ${test.error}${colors.reset}`);
      }
    });
  });

  // Print failed tests details
  const failedTests = results.tests.filter(test => test.status === 'FAILED');
  if (failedTests.length > 0) {
    console.log(`\n${colors.bold}${colors.red}❌ Failed Tests Details:${colors.reset}`);
    failedTests.forEach((test, index) => {
      console.log(`\n${index + 1}. ${colors.bold}${test.name}${colors.reset} [${test.category}]`);
      console.log(`   ${colors.red}Error: ${test.error}${colors.reset}`);
    });
  }

  console.log(`\n${colors.bold}🎯 Test Data Generated:${colors.reset}`);
  console.log(`   Student ID: ${testData.studentId}`);
  console.log(`   Drive ID: ${testData.driveId}`);
  console.log(`   Company ID: ${testData.companyId}`);
  console.log(`   Registered Users: ${testData.testUsers.length}`);

  console.log(`\n${colors.cyan}Testing completed at: ${new Date().toLocaleString()}${colors.reset}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}🛑 Testing interrupted by user${colors.reset}`);
  printTestResults();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`${colors.red}💥 Unhandled Rejection at:${colors.reset}`, promise, `${colors.red}reason:${colors.reset}`, reason);
  process.exit(1);
});

// Start testing
runAllTests();