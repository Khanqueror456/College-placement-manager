/**
 * Automated API Test Script
 * Tests all endpoints of the College Placement Management Portal
 * 
 * Usage: node test-api.js
 */

const BASE_URL = 'http://localhost:3000/api';

// Store tokens and IDs
const testData = {
  studentToken: '',
  hodToken: '',
  tpoToken: '',
  driveId: '',
  applicationId: '',
  studentId: '',
  companyId: ''
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: []
};

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

// Helper function to make HTTP requests
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

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data: responseData
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test runner
async function runTest(name, testFn) {
  results.total++;
  console.log(`\n${colors.blue}🧪 Testing: ${name}${colors.reset}`);
  
  try {
    await testFn();
    results.passed++;
    results.tests.push({ name, status: 'PASSED' });
    console.log(`${colors.green}✅ PASSED${colors.reset}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAILED', error: error.message });
    console.log(`${colors.red}❌ FAILED: ${error.message}${colors.reset}`);
  }
}

// Assertion helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// ==================== TEST SUITES ====================

// 1. AUTHENTICATION TESTS
async function authenticationTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}📋 AUTHENTICATION TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 1.1: Register Student
  await runTest('Register Student', async () => {
    const response = await makeRequest('POST', '/auth/register', {
      name: 'Test Student',
      email: 'student@test.com',
      password: 'Password123!',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2024001',
      phone: '9876543210'
    });

    assert(response.status === 201, `Expected 201, got ${response.status}`);
    assert(response.data.token, 'Token not received');
    testData.studentToken = response.data.token;
    if (response.data.user && response.data.user.id) {
      testData.studentId = response.data.user.id;
    }
  });

  // Test 1.2: Register HOD
  await runTest('Register HOD', async () => {
    const response = await makeRequest('POST', '/auth/register', {
      name: 'Dr. Smith',
      email: 'hod@test.com',
      password: 'Password123!',
      role: 'hod',
      department: 'Computer Science',
      phone: '9876543211'
    });

    assert(response.status === 201, `Expected 201, got ${response.status}`);
    assert(response.data.token, 'Token not received');
    testData.hodToken = response.data.token;
  });

  // Test 1.3: Register TPO
  await runTest('Register TPO', async () => {
    const response = await makeRequest('POST', '/auth/register', {
      name: 'TPO Admin',
      email: 'tpo@test.com',
      password: 'Password123!',
      role: 'tpo',
      department: 'Placement Cell',
      phone: '9876543212'
    });

    assert(response.status === 201, `Expected 201, got ${response.status}`);
    assert(response.data.token, 'Token not received');
    testData.tpoToken = response.data.token;
  });

  // Test 1.4: Login Student
  await runTest('Login Student', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'student@test.com',
      password: 'Password123!'
    });

    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.token, 'Token not received');
    testData.studentToken = response.data.token;
  });

  // Test 1.5: Login HOD
  await runTest('Login HOD', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'hod@test.com',
      password: 'Password123!'
    });

    assert(response.status === 200, `Expected 200, got ${response.status}`);
    testData.hodToken = response.data.token;
  });

  // Test 1.6: Login TPO
  await runTest('Login TPO', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'tpo@test.com',
      password: 'Password123!'
    });

    assert(response.status === 200, `Expected 200, got ${response.status}`);
    testData.tpoToken = response.data.token;
  });

  // Test 1.7: Get Current User
  await runTest('Get Current User (Student)', async () => {
    const response = await makeRequest('GET', '/auth/me', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.user, 'User data not received');
  });

  // Test 1.8: Invalid Login
  await runTest('Invalid Login (Should Fail)', async () => {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'wrong@test.com',
      password: 'WrongPass123!'
    });

    assert(response.status === 401, `Expected 401, got ${response.status}`);
  });
}

// 2. TPO OPERATIONS TESTS
async function tpoOperationsTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}👨‍💼 TPO OPERATIONS TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 2.1: Add Company
  await runTest('Add Company', async () => {
    const response = await makeRequest('POST', '/tpo/companies', {
      name: 'Google',
      website: 'https://google.com',
      industry: 'Technology',
      description: 'Search engine giant',
      contactEmail: 'hr@google.com',
      contactPhone: '1234567890'
    }, testData.tpoToken);

    assert(response.status === 201, `Expected 201, got ${response.status}`);
    if (response.data.company && response.data.company.id) {
      testData.companyId = response.data.company.id;
    }
  });

  // Test 2.2: Get All Companies
  await runTest('Get All Companies', async () => {
    const response = await makeRequest('GET', '/tpo/companies', null, testData.tpoToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.companies), 'Companies array not received');
  });

  // Test 2.3: Create Placement Drive
  await runTest('Create Placement Drive', async () => {
    const response = await makeRequest('POST', '/tpo/drives', {
      companyName: 'Google',
      jobRole: 'Software Engineer',
      jobDescription: 'Full-time SDE position',
      package: '25 LPA',
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science', 'IT'],
        maxBacklogs: 0
      },
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      driveDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Bangalore',
      jobType: 'Full-Time'
    }, testData.tpoToken);

    assert(response.status === 201, `Expected 201, got ${response.status}`);
    if (response.data.drive && response.data.drive.id) {
      testData.driveId = response.data.drive.id;
    }
  });

  // Test 2.4: Get All Drives (TPO)
  await runTest('Get All Drives (TPO)', async () => {
    const response = await makeRequest('GET', '/tpo/drives', null, testData.tpoToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.drives), 'Drives array not received');
  });

  // Test 2.5: Update Drive
  await runTest('Update Drive', async () => {
    const response = await makeRequest('PUT', `/tpo/drives/${testData.driveId || 'drive123'}`, {
      package: '30 LPA',
      status: 'active'
    }, testData.tpoToken);

    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 2.6: Get TPO Dashboard
  await runTest('Get TPO Dashboard', async () => {
    const response = await makeRequest('GET', '/tpo/dashboard', null, testData.tpoToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.dashboard, 'Dashboard data not received');
  });
}

// 3. STUDENT OPERATIONS TESTS
async function studentOperationsTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}👨‍🎓 STUDENT OPERATIONS TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 3.1: Get Student Profile
  await runTest('Get Student Profile', async () => {
    const response = await makeRequest('GET', '/student/profile', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.profile, 'Profile data not received');
  });

  // Test 3.2: Update Student Profile
  await runTest('Update Student Profile', async () => {
    const response = await makeRequest('PUT', '/student/profile', {
      phone: '9999888877',
      cgpa: 8.5,
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL']
    }, testData.studentToken);

    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 3.3: Get Active Drives
  await runTest('Get Active Drives (Student)', async () => {
    const response = await makeRequest('GET', '/student/drives', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.drives), 'Drives array not received');
  });

  // Test 3.4: Apply to Drive
  await runTest('Apply to Drive', async () => {
    const driveId = testData.driveId || 'drive_1';
    const response = await makeRequest('POST', `/student/drives/${driveId}/apply`, {
      coverLetter: 'I am very interested in this position and believe I would be a great fit.'
    }, testData.studentToken);

    assert([200, 201].includes(response.status), `Expected 200/201, got ${response.status}`);
    if (response.data.application && response.data.application.id) {
      testData.applicationId = response.data.application.id;
    }
  });

  // Test 3.5: Get My Applications
  await runTest('Get My Applications', async () => {
    const response = await makeRequest('GET', '/student/applications', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.applications), 'Applications array not received');
  });

  // Test 3.6: Get Application Status
  await runTest('Get Application Status', async () => {
    const appId = testData.applicationId || 'app_1';
    const response = await makeRequest('GET', `/student/applications/${appId}`, null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 3.7: Get Student Dashboard
  await runTest('Get Student Dashboard', async () => {
    const response = await makeRequest('GET', '/student/dashboard', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.dashboard, 'Dashboard data not received');
  });
}

// 4. HOD OPERATIONS TESTS
async function hodOperationsTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}👨‍🏫 HOD OPERATIONS TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 4.1: Get Pending Approvals
  await runTest('Get Pending Approvals', async () => {
    const response = await makeRequest('GET', '/hod/approvals/pending', null, testData.hodToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.students), 'Students array not received');
  });

  // Test 4.2: Approve Student
  await runTest('Approve Student', async () => {
    const studentId = testData.studentId || 'student_1';
    const response = await makeRequest('PUT', `/hod/approvals/${studentId}/approve`, null, testData.hodToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 4.3: Get Department Students
  await runTest('Get Department Students', async () => {
    const response = await makeRequest('GET', '/hod/students', null, testData.hodToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.students), 'Students array not received');
  });

  // Test 4.4: Get Department Statistics
  await runTest('Get Department Statistics', async () => {
    const response = await makeRequest('GET', '/hod/statistics', null, testData.hodToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.statistics, 'Statistics not received');
  });

  // Test 4.5: Get HOD Dashboard
  await runTest('Get HOD Dashboard', async () => {
    const response = await makeRequest('GET', '/hod/dashboard', null, testData.hodToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.dashboard, 'Dashboard data not received');
  });
}

// 5. DRIVE OPERATIONS TESTS
async function driveOperationsTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}🎯 DRIVE OPERATIONS TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 5.1: Get All Drives
  await runTest('Get All Drives', async () => {
    const response = await makeRequest('GET', '/drives', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(Array.isArray(response.data.drives), 'Drives array not received');
  });

  // Test 5.2: Get Active Drives
  await runTest('Get Active Drives', async () => {
    const response = await makeRequest('GET', '/drives/active', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 5.3: Get Drive by ID
  await runTest('Get Drive by ID', async () => {
    const driveId = testData.driveId || 'drive_1';
    const response = await makeRequest('GET', `/drives/${driveId}`, null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(response.data.drive, 'Drive data not received');
  });

  // Test 5.4: Get Drive Statistics
  await runTest('Get Drive Statistics', async () => {
    const driveId = testData.driveId || 'drive_1';
    const response = await makeRequest('GET', `/drives/${driveId}/stats`, null, testData.tpoToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 5.5: Get Upcoming Drives
  await runTest('Get Upcoming Drives', async () => {
    const response = await makeRequest('GET', '/drives/upcoming', null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 5.6: Check Eligibility
  await runTest('Check Drive Eligibility', async () => {
    const driveId = testData.driveId || 'drive_1';
    const response = await makeRequest('GET', `/drives/${driveId}/eligibility`, null, testData.studentToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });
}

// 6. ADVANCED TPO OPERATIONS
async function advancedTpoOperationsTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}⚡ ADVANCED TPO OPERATIONS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 6.1: Get Applications for Drive
  await runTest('Get Applications for Drive', async () => {
    const driveId = testData.driveId || 'drive_1';
    const response = await makeRequest('GET', `/tpo/drives/${driveId}/applications`, null, testData.tpoToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 6.2: Update Application Status
  await runTest('Update Application Status', async () => {
    const appId = testData.applicationId || 'app_1';
    const response = await makeRequest('PUT', `/tpo/applications/${appId}/status`, {
      status: 'shortlisted',
      round: 'Technical Interview',
      feedback: 'Good performance in screening'
    }, testData.tpoToken);

    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 6.3: Bulk Update Status
  await runTest('Bulk Update Application Status', async () => {
    const response = await makeRequest('PUT', '/tpo/applications/bulk-update', {
      applicationIds: [testData.applicationId || 'app_1', 'app_2'],
      status: 'shortlisted',
      round: 'Technical Interview'
    }, testData.tpoToken);

    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });

  // Test 6.4: Close Drive
  await runTest('Close Drive', async () => {
    const driveId = testData.driveId || 'drive_1';
    const response = await makeRequest('PUT', `/tpo/drives/${driveId}/close`, null, testData.tpoToken);
    assert(response.status === 200, `Expected 200, got ${response.status}`);
  });
}

// 7. ERROR HANDLING TESTS
async function errorHandlingTests() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}⚠️  ERROR HANDLING TESTS${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);

  // Test 7.1: Unauthorized Access
  await runTest('Unauthorized Access (No Token)', async () => {
    const response = await makeRequest('GET', '/student/profile', null, null);
    assert(response.status === 401, `Expected 401, got ${response.status}`);
  });

  // Test 7.2: Invalid Token
  await runTest('Invalid Token', async () => {
    const response = await makeRequest('GET', '/student/profile', null, 'invalid_token_123');
    assert(response.status === 401, `Expected 401, got ${response.status}`);
  });

  // Test 7.3: Wrong Role Access (Student accessing TPO route)
  await runTest('Wrong Role Access', async () => {
    const response = await makeRequest('POST', '/tpo/companies', {
      name: 'Test Corp'
    }, testData.studentToken);
    assert(response.status === 403, `Expected 403, got ${response.status}`);
  });

  // Test 7.4: Invalid Data Format
  await runTest('Invalid Data Format', async () => {
    const response = await makeRequest('PUT', '/student/profile', {
      cgpa: 'invalid_cgpa'
    }, testData.studentToken);
    assert([400, 500].includes(response.status), `Expected 400/500, got ${response.status}`);
  });

  // Test 7.5: Non-existent Resource
  await runTest('Non-existent Resource', async () => {
    const response = await makeRequest('GET', '/drives/nonexistent_id_999', null, testData.studentToken);
    assert([404, 200].includes(response.status), `Expected 404/200, got ${response.status}`);
  });
}

// Print summary
function printSummary() {
  console.log(`\n${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.yellow}📊 TEST SUMMARY${colors.reset}`);
  console.log(`${colors.yellow}========================================${colors.reset}`);
  
  console.log(`\nTotal Tests: ${results.total}`);
  console.log(`${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
  
  if (results.failed > 0) {
    console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
    results.tests
      .filter(t => t.status === 'FAILED')
      .forEach(t => {
        console.log(`  ${colors.red}❌ ${t.name}${colors.reset}`);
        console.log(`     Error: ${t.error}`);
      });
  }

  console.log(`\n${colors.blue}Test Data Collected:${colors.reset}`);
  console.log(`  Student Token: ${testData.studentToken ? '✓' : '✗'}`);
  console.log(`  HOD Token: ${testData.hodToken ? '✓' : '✗'}`);
  console.log(`  TPO Token: ${testData.tpoToken ? '✓' : '✗'}`);
  console.log(`  Drive ID: ${testData.driveId || 'N/A'}`);
  console.log(`  Application ID: ${testData.applicationId || 'N/A'}`);
  console.log(`  Student ID: ${testData.studentId || 'N/A'}`);
  console.log(`  Company ID: ${testData.companyId || 'N/A'}`);
  
  console.log(`\n${colors.yellow}========================================${colors.reset}\n`);
}

// Main test runner
async function runAllTests() {
  console.log(`${colors.blue}
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     COLLEGE PLACEMENT MANAGEMENT PORTAL                   ║
║            API AUTOMATED TEST SUITE                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  ${colors.reset}`);

  console.log(`\n${colors.blue}📍 Testing API at: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.blue}⏰ Started at: ${new Date().toLocaleString()}${colors.reset}\n`);

  try {
    await authenticationTests();
    await tpoOperationsTests();
    await studentOperationsTests();
    await hodOperationsTests();
    await driveOperationsTests();
    await advancedTpoOperationsTests();
    await errorHandlingTests();
  } catch (error) {
    console.error(`${colors.red}Fatal error during tests: ${error.message}${colors.reset}`);
  }

  printSummary();
  
  console.log(`${colors.blue}⏰ Completed at: ${new Date().toLocaleString()}${colors.reset}\n`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
