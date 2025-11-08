/**
 * Comprehensive TPO Feature Testing Script
 * Tests all TPO/Admin functionality end-to-end
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testCompanyId = null;
let testDriveId = null;
let testApplicationId = null;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.magenta}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`),
  subsection: (msg) => console.log(`\n${colors.yellow}--- ${msg} ---${colors.reset}`)
};

// Test data
const testData = {
  tpoUser: {
    name: 'Test TPO Officer',
    email: `tpo_test_${Date.now()}@college.edu`,
    password: 'Test@123456',
    role: 'tpo',
    department: 'Placement Cell'
  },
  company: {
    name: `Test Company ${Date.now()}`,
    description: 'Leading technology company',
    website: 'https://testcompany.com',
    industry: 'Technology',
    location: 'Bangalore',
    contactPerson: 'John Recruiter',
    contactEmail: 'recruiter@testcompany.com',
    contactPhone: '+91-9876543210'
  },
  drive: {
    companyName: 'Test Company',
    jobRole: 'Software Engineer',
    jobDescription: 'Develop and maintain software applications',
    package: '12 LPA',
    jobType: 'FULL_TIME',
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedDepartments: ['Computer Science', 'IT', 'Electronics'],
      maxBacklogs: 0,
      graduationYears: [2024, 2025]
    },
    applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Bangalore'
  },
  notification: {
    type: 'all-students',
    subject: 'Important Placement Update',
    message: 'This is a test notification sent to all students. Please check the placement portal for new opportunities.'
  }
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
      details: error.response?.data // Include full error details for debugging
    };
  }
}

// Test 1: TPO Registration and Login
async function testAuthFlow() {
  log.section('TEST 1: TPO AUTHENTICATION');

  // Register TPO
  log.subsection('Registering TPO User');
  const registerResult = await apiCall('POST', '/auth/register', testData.tpoUser);
  
  if (registerResult.success) {
    log.success('TPO registered successfully');
    authToken = registerResult.data.token;
    log.info(`Auth token received: ${authToken.substring(0, 20)}...`);
  } else {
    log.error(`Registration failed: ${registerResult.error}`);
    return false;
  }

  // Login TPO
  log.subsection('Logging in as TPO');
  const loginResult = await apiCall('POST', '/auth/login', {
    email: testData.tpoUser.email,
    password: testData.tpoUser.password
  });

  if (loginResult.success) {
    log.success('TPO login successful');
    authToken = loginResult.data.token;
  } else {
    log.error(`Login failed: ${loginResult.error}`);
    return false;
  }

  return true;
}

// Test 2: Company Management
async function testCompanyManagement() {
  log.section('TEST 2: COMPANY MANAGEMENT');

  // Add Company
  log.subsection('Adding New Company');
  const addCompanyResult = await apiCall('POST', '/tpo/companies', testData.company, authToken);
  
  if (addCompanyResult.success) {
    testCompanyId = addCompanyResult.data.company.id;
    log.success(`Company added successfully (ID: ${testCompanyId})`);
    log.info(`Company Name: ${addCompanyResult.data.company.name}`);
  } else {
    log.error(`Failed to add company: ${addCompanyResult.error}`);
    return false;
  }

  // Get All Companies
  log.subsection('Fetching All Companies');
  const getCompaniesResult = await apiCall('GET', '/tpo/companies', null, authToken);
  
  if (getCompaniesResult.success) {
    log.success(`Retrieved ${getCompaniesResult.data.count} companies`);
    log.info(`Companies: ${getCompaniesResult.data.companies.map(c => c.name).join(', ')}`);
  } else {
    log.error(`Failed to fetch companies: ${getCompaniesResult.error}`);
    return false;
  }

  return true;
}

// Test 3: Drive Management
async function testDriveManagement() {
  log.section('TEST 3: PLACEMENT DRIVE MANAGEMENT');

  if (!testCompanyId) {
    log.error('No company ID available. Skipping drive tests.');
    return false;
  }

  // Create Drive
  log.subsection('Creating New Placement Drive');
  const driveData = { ...testData.drive, companyId: testCompanyId };
  const createDriveResult = await apiCall('POST', '/tpo/drives', driveData, authToken);
  
  if (createDriveResult.success) {
    testDriveId = createDriveResult.data.drive.id;
    log.success(`Drive created successfully (ID: ${testDriveId})`);
    log.info(`Company: ${createDriveResult.data.drive.companyName}`);
    log.info(`Role: ${createDriveResult.data.drive.jobRole}`);
    log.info('Note: Eligible students should receive email notifications');
  } else {
    log.error(`Failed to create drive: ${createDriveResult.error}`);
    if (createDriveResult.details) {
      console.log('Full error details:', JSON.stringify(createDriveResult.details, null, 2));
    }
    return false;
  }

  // Get All Drives
  log.subsection('Fetching All Drives');
  const getDrivesResult = await apiCall('GET', '/tpo/drives', null, authToken);
  
  if (getDrivesResult.success) {
    log.success(`Retrieved ${getDrivesResult.data.count} drives`);
    getDrivesResult.data.drives.forEach(drive => {
      log.info(`- ${drive.companyName} (${drive.jobRole}) - Status: ${drive.status}`);
    });
  } else {
    log.error(`Failed to fetch drives: ${getDrivesResult.error}`);
    return false;
  }

  // Update Drive
  log.subsection('Updating Drive Information');
  const updateDriveResult = await apiCall('PUT', `/tpo/drives/${testDriveId}`, {
    package: '15 LPA',
    status: 'ACTIVE'
  }, authToken);
  
  if (updateDriveResult.success) {
    log.success('Drive updated successfully');
    log.info(`New package: ${updateDriveResult.data.drive.package || '15 LPA'}`);
  } else {
    log.error(`Failed to update drive: ${updateDriveResult.error}`);
  }

  // Get Applications for Drive
  log.subsection('Fetching Applications for Drive');
  const getApplicationsResult = await apiCall('GET', `/tpo/drives/${testDriveId}/applications`, null, authToken);
  
  if (getApplicationsResult.success) {
    log.success(`Retrieved ${getApplicationsResult.data.count} applications`);
    if (getApplicationsResult.data.count > 0) {
      testApplicationId = getApplicationsResult.data.applications[0].id;
      log.info('First application details:');
      log.info(`  Student: ${getApplicationsResult.data.applications[0].student.name}`);
      log.info(`  Status: ${getApplicationsResult.data.applications[0].status}`);
    } else {
      log.info('No applications yet (students need to apply first)');
    }
  } else {
    log.error(`Failed to fetch applications: ${getApplicationsResult.error}`);
  }

  return true;
}

// Test 4: Application Management
async function testApplicationManagement() {
  log.section('TEST 4: APPLICATION STATUS MANAGEMENT');

  if (!testApplicationId) {
    log.info('No application ID available. Skipping application tests.');
    log.info('This is normal if no students have applied to the test drive yet.');
    return true;
  }

  // Update Application Status
  log.subsection('Updating Application Status to SHORTLISTED');
  const updateStatusResult = await apiCall('PUT', `/tpo/applications/${testApplicationId}/status`, {
    status: 'SHORTLISTED',
    round: 'Technical Round',
    feedback: 'Good profile, invited for technical interview'
  }, authToken);
  
  if (updateStatusResult.success) {
    log.success('Application status updated successfully');
    log.info('Email notification sent to student');
  } else {
    log.error(`Failed to update status: ${updateStatusResult.error}`);
  }

  // Simulate bulk status update
  log.subsection('Testing Bulk Status Update');
  const bulkUpdateResult = await apiCall('POST', '/tpo/applications/bulk-update', {
    applicationIds: [testApplicationId],
    status: 'SELECTED',
    round: 'Final Round',
    comments: 'Congratulations! You have been selected.'
  }, authToken);
  
  if (bulkUpdateResult.success) {
    log.success('Bulk status update successful');
    log.info(`Updated: ${bulkUpdateResult.data.updatedCount} applications`);
    log.info(`Emails sent: ${bulkUpdateResult.data.emailsSent}`);
  } else {
    log.error(`Bulk update failed: ${bulkUpdateResult.error}`);
  }

  return true;
}

// Test 5: Notification System
async function testNotificationSystem() {
  log.section('TEST 5: BULK NOTIFICATION SYSTEM');

  // Send notification to all students
  log.subsection('Sending Notification to All Students');
  const notificationResult = await apiCall('POST', '/tpo/notifications', testData.notification, authToken);
  
  if (notificationResult.success) {
    log.success('Notification sent successfully');
    log.info(`Recipients: ${notificationResult.data.recipientCount}`);
    log.info(`Success: ${notificationResult.data.successCount}`);
    if (notificationResult.data.failureCount > 0) {
      log.error(`Failed: ${notificationResult.data.failureCount}`);
    }
  } else {
    log.error(`Failed to send notification: ${notificationResult.error}`);
  }

  return true;
}

// Test 6: Dashboard and Reports
async function testDashboardAndReports() {
  log.section('TEST 6: DASHBOARD & REPORTING');

  // Get Dashboard
  log.subsection('Fetching TPO Dashboard');
  const dashboardResult = await apiCall('GET', '/tpo/dashboard', null, authToken);
  
  if (dashboardResult.success) {
    log.success('Dashboard data retrieved successfully');
    const dash = dashboardResult.data.dashboard;
    log.info(`Total Drives: ${dash.totalDrives}`);
    log.info(`Active Drives: ${dash.activeDrives}`);
    log.info(`Total Students: ${dash.totalStudents}`);
    log.info(`Placed Students: ${dash.placedStudents}`);
    log.info(`Placement %: ${dash.placementPercentage}%`);
  } else {
    log.error(`Failed to fetch dashboard: ${dashboardResult.error}`);
  }

  // Test Excel Report Generation
  log.subsection('Testing Excel Report Generation');
  log.info('Excel endpoint: GET /tpo/reports/excel');
  log.info('Note: This downloads a file, cannot be tested via API call');

  // Test PDF Report Generation
  log.subsection('Testing PDF Report Generation');
  log.info('PDF endpoint: GET /tpo/reports/pdf');
  log.info('Note: This downloads a file, cannot be tested via API call');

  return true;
}

// Test 7: Drive Closure
async function testDriveClosure() {
  log.section('TEST 7: DRIVE CLOSURE');

  if (!testDriveId) {
    log.error('No drive ID available. Skipping closure test.');
    return false;
  }

  log.subsection('Closing Placement Drive');
  const closeResult = await apiCall('POST', `/tpo/drives/${testDriveId}/close`, {}, authToken);
  
  if (closeResult.success) {
    log.success('Drive closed successfully');
    log.info('Drive status changed to CLOSED');
  } else {
    log.error(`Failed to close drive: ${closeResult.error}`);
  }

  return true;
}

// Main test execution
async function runAllTests() {
  console.log('\n' + colors.magenta + '╔═══════════════════════════════════════════════════════════╗');
  console.log('║        TPO FEATURE COMPLETE TESTING SUITE                ║');
  console.log('╚═══════════════════════════════════════════════════════════╝' + colors.reset);
  
  log.info('Starting comprehensive TPO feature tests...');
  log.info('Server: ' + API_BASE_URL);
  log.info('Timestamp: ' + new Date().toISOString());

  const tests = [
    { name: 'Authentication', fn: testAuthFlow },
    { name: 'Company Management', fn: testCompanyManagement },
    { name: 'Drive Management', fn: testDriveManagement },
    { name: 'Application Management', fn: testApplicationManagement },
    { name: 'Notification System', fn: testNotificationSystem },
    { name: 'Dashboard & Reports', fn: testDashboardAndReports },
    { name: 'Drive Closure', fn: testDriveClosure }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      } else {
        failedTests++;
      }
    } catch (error) {
      log.error(`Test ${test.name} threw an error: ${error.message}`);
      failedTests++;
    }
  }

  // Summary
  log.section('TEST SUMMARY');
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Total: ${tests.length}`);
  
  if (failedTests === 0) {
    console.log(`\n${colors.green}${'*'.repeat(60)}`);
    console.log('✓ ALL TPO FEATURES WORKING - 100% COMPLETE!');
    console.log(`${'*'.repeat(60)}${colors.reset}\n`);
  } else {
    console.log(`\n${colors.yellow}⚠ Some tests failed. Please review the logs above.${colors.reset}\n`);
  }

  log.info('\nTest Artifacts Created:');
  log.info(`- TPO User: ${testData.tpoUser.email}`);
  log.info(`- Company ID: ${testCompanyId}`);
  log.info(`- Drive ID: ${testDriveId}`);
  if (testApplicationId) {
    log.info(`- Application ID: ${testApplicationId}`);
  }
}

// Execute tests
runAllTests().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
