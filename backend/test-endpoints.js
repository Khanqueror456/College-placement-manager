/**
 * Quick HOD & TPO Endpoint Testing Script
 * Focused testing for specific HOD and TPO functionalities
 * 
 * Usage: node test-endpoints.js [hod|tpo|all]
 */

import config from './config/config.js';

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const testType = process.argv[2] || 'all';

// Test credentials (update these based on your test data)
const TEST_CREDENTIALS = {
  hod: {
    email: 'hod@test.com',
    password: 'Password123!'
  },
  tpo: {
    email: 'tpo@test.com',
    password: 'Password123!'
  },
  student: {
    email: 'student@test.com', 
    password: 'Password123!'
  }
};

let tokens = {};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
      url
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      url
    };
  }
}

async function login(role) {
  console.log(`${colors.blue}🔐 Logging in as ${role.toUpperCase()}...${colors.reset}`);
  
  const response = await makeRequest('POST', '/auth/login', TEST_CREDENTIALS[role]);
  
  if (response.ok && response.data.token) {
    tokens[role] = response.data.token;
    console.log(`${colors.green}✅ ${role.toUpperCase()} login successful${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}❌ ${role.toUpperCase()} login failed: ${response.data.message || response.error}${colors.reset}`);
    return false;
  }
}

async function testEndpoint(method, endpoint, data, token, description) {
  console.log(`\n${colors.yellow}Testing: ${description}${colors.reset}`);
  console.log(`${method} ${endpoint}`);
  
  const response = await makeRequest(method, endpoint, data, token);
  
  if (response.ok) {
    console.log(`${colors.green}✅ SUCCESS (${response.status})${colors.reset}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
  } else {
    console.log(`${colors.red}❌ FAILED (${response.status})${colors.reset}`);
    console.log(`   Error: ${response.data.message || response.error || 'Unknown error'}`);
  }
  
  return response.ok;
}

async function testHodEndpoints() {
  console.log(`\n${colors.bold}${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}👨‍💼 TESTING HOD ENDPOINTS${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}========================================${colors.reset}`);

  if (!await login('hod')) return;

  const hodTests = [
    {
      method: 'GET',
      endpoint: '/hod/dashboard',
      description: 'Get HOD Dashboard'
    },
    {
      method: 'GET', 
      endpoint: '/hod/approvals/pending',
      description: 'Get Pending Student Approvals'
    },
    {
      method: 'POST',
      endpoint: '/hod/approvals/student_1/approve',
      data: {},
      description: 'Approve Student Registration'
    },
    {
      method: 'POST',
      endpoint: '/hod/approvals/student_2/reject',
      data: { reason: 'Test rejection for incomplete profile' },
      description: 'Reject Student Registration'
    },
    {
      method: 'GET',
      endpoint: '/hod/students',
      description: 'Get All Department Students'
    },
    {
      method: 'GET',
      endpoint: '/hod/students?page=1&limit=5',
      description: 'Get Students with Pagination'
    },
    {
      method: 'GET',
      endpoint: '/hod/students?search=test',
      description: 'Search Students'
    },
    {
      method: 'GET',
      endpoint: '/hod/students/student_1',
      description: 'Get Specific Student Details'
    },
    {
      method: 'POST',
      endpoint: '/hod/students/student_1/verify',
      data: {
        verificationStatus: 'verified',
        comments: 'Profile verified successfully'
      },
      description: 'Verify Student Profile'
    },
    {
      method: 'GET',
      endpoint: '/hod/statistics',
      description: 'Get Department Statistics'
    },
    {
      method: 'GET',
      endpoint: '/hod/reports/placement',
      description: 'Get Placement Report'
    }
  ];

  let passed = 0;
  let total = hodTests.length;

  for (const test of hodTests) {
    if (await testEndpoint(test.method, test.endpoint, test.data, tokens.hod, test.description)) {
      passed++;
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
  }

  console.log(`\n${colors.bold}HOD Tests Summary: ${passed}/${total} passed${colors.reset}`);
}

async function testTpoEndpoints() {
  console.log(`\n${colors.bold}${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}📊 TESTING TPO ENDPOINTS${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}========================================${colors.reset}`);

  if (!await login('tpo')) return;

  const tpoTests = [
    {
      method: 'GET',
      endpoint: '/tpo/dashboard',
      description: 'Get TPO Dashboard'
    },
    {
      method: 'POST',
      endpoint: '/tpo/companies',
      data: {
        name: 'Test Company Ltd',
        website: 'https://testcompany.com',
        industry: 'Technology',
        description: 'Leading tech company',
        hrEmail: 'hr@testcompany.com',
        hrPhone: '1234567890'
      },
      description: 'Add New Company'
    },
    {
      method: 'GET',
      endpoint: '/tpo/companies',
      description: 'Get All Companies'
    },
    {
      method: 'POST',
      endpoint: '/tpo/drives',
      data: {
        companyName: 'Test Company Ltd',
        jobRole: 'Software Engineer',
        jobDescription: 'Full stack development position',
        package: '15 LPA',
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
      },
      description: 'Create Placement Drive'
    },
    {
      method: 'GET',
      endpoint: '/tpo/drives',
      description: 'Get All Placement Drives'
    },
    {
      method: 'GET',
      endpoint: '/tpo/drives?status=active',
      description: 'Get Active Drives Only'
    },
    {
      method: 'GET',
      endpoint: '/tpo/drives?search=Test Company',
      description: 'Search Drives by Company'
    },
    {
      method: 'PUT',
      endpoint: '/tpo/drives/drive_1',
      data: {
        package: '18 LPA',
        jobDescription: 'Updated job description with more benefits'
      },
      description: 'Update Placement Drive'  
    },
    {
      method: 'GET',
      endpoint: '/tpo/drives/drive_1/applications',
      description: 'Get Applications for Drive'
    },
    {
      method: 'PUT',
      endpoint: '/tpo/applications/app_1/status',
      data: {
        status: 'shortlisted',
        comments: 'Selected for next round'
      },
      description: 'Update Application Status'
    },
    {
      method: 'POST',
      endpoint: '/tpo/applications/bulk-update',
      data: {
        applicationIds: ['app_1', 'app_2'],
        status: 'under_review',
        comments: 'Bulk status update'
      },
      description: 'Bulk Update Applications'  
    },
    {
      method: 'POST',
      endpoint: '/tpo/notifications',
      data: {
        title: 'Test Notification',
        message: 'This is a test notification for all students',
        recipients: 'all',
        type: 'general'
      },
      description: 'Send Notification'
    },
    {
      method: 'POST',
      endpoint: '/tpo/drives/drive_1/close',
      data: {
        reason: 'Drive completed successfully'
      },
      description: 'Close Placement Drive'
    }
  ];

  let passed = 0;
  let total = tpoTests.length;

  for (const test of tpoTests) {
    if (await testEndpoint(test.method, test.endpoint, test.data, tokens.tpo, test.description)) {
      passed++;
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
  }

  console.log(`\n${colors.bold}TPO Tests Summary: ${passed}/${total} passed${colors.reset}`);
}

async function testCrossRoleAccess() {
  console.log(`\n${colors.bold}${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}🔒 TESTING CROSS-ROLE ACCESS CONTROL${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}========================================${colors.reset}`);

  // Test HOD trying to access TPO endpoints (should fail)
  console.log(`\n${colors.yellow}Testing HOD access to TPO endpoints (should fail):${colors.reset}`);
  
  const hodToTpoTests = [
    { method: 'GET', endpoint: '/tpo/dashboard', description: 'HOD accessing TPO dashboard' },
    { method: 'GET', endpoint: '/tpo/drives', description: 'HOD accessing drives list' },
    { method: 'POST', endpoint: '/tpo/companies', data: { name: 'Test' }, description: 'HOD creating company' }
  ];

  for (const test of hodToTpoTests) {
    const response = await makeRequest(test.method, test.endpoint, test.data, tokens.hod);
    if (response.status === 403 || response.status === 401) {
      console.log(`${colors.green}✅ ${test.description} - Correctly blocked${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${test.description} - Access allowed (should be blocked)${colors.reset}`);
    }
  }

  // Test TPO trying to access HOD endpoints (should fail)
  console.log(`\n${colors.yellow}Testing TPO access to HOD endpoints (should fail):${colors.reset}`);
  
  const tpoToHodTests = [
    { method: 'GET', endpoint: '/hod/dashboard', description: 'TPO accessing HOD dashboard' },
    { method: 'GET', endpoint: '/hod/approvals/pending', description: 'TPO accessing pending approvals' },
    { method: 'POST', endpoint: '/hod/approvals/student_1/approve', description: 'TPO approving student' }
  ];

  for (const test of tpoToHodTests) {
    const response = await makeRequest(test.method, test.endpoint, test.data, tokens.tpo);
    if (response.status === 403 || response.status === 401) {
      console.log(`${colors.green}✅ ${test.description} - Correctly blocked${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${test.description} - Access allowed (should be blocked)${colors.reset}`);
    }
  }
}

async function runTests() {
  console.log(`${colors.bold}${colors.blue}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}║              HOD & TPO ENDPOINT TESTING TOOL                 ║${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
  
  console.log(`${colors.yellow}Target URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.yellow}Test Type: ${testType}${colors.reset}`);
  console.log(`${colors.yellow}Started: ${new Date().toLocaleString()}${colors.reset}`);

  // Check server connectivity
  const healthResponse = await makeRequest('GET', '/health').catch(() => ({ status: 0 }));
  if (healthResponse.status === 0) {
    console.log(`${colors.red}❌ Cannot connect to server at ${BASE_URL}${colors.reset}`);
    console.log(`${colors.yellow}Please ensure the server is running with: npm run dev${colors.reset}`);
    process.exit(1);
  }

  try {
    if (testType === 'hod' || testType === 'all') {
      await testHodEndpoints();
    }
    
    if (testType === 'tpo' || testType === 'all') {
      await testTpoEndpoints();
    }
    
    if (testType === 'all') {
      await testCrossRoleAccess();
    }

    console.log(`\n${colors.bold}${colors.green}🎉 Testing completed successfully!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}💥 Error during testing: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Usage instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
${colors.bold}HOD & TPO Endpoint Testing Tool${colors.reset}

${colors.yellow}Usage:${colors.reset}
  node test-endpoints.js [type]

${colors.yellow}Types:${colors.reset}
  hod     - Test only HOD endpoints
  tpo     - Test only TPO endpoints  
  all     - Test both HOD and TPO endpoints (default)

${colors.yellow}Examples:${colors.reset}
  node test-endpoints.js hod
  node test-endpoints.js tpo
  node test-endpoints.js all

${colors.yellow}Prerequisites:${colors.reset}
  - Server running on ${BASE_URL}
  - Test user accounts created (hod@test.com, tpo@test.com)
  - Valid credentials in TEST_CREDENTIALS object

${colors.yellow}Environment Variables:${colors.reset}
  API_URL    - Base URL of the API (default: http://localhost:3000/api)
`);
  process.exit(0);
}

runTests();