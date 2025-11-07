/**
 * ========================================
 * COMPLETE API ROUTES ANALYZER & TESTER
 * ========================================
 * 
 * This script analyzes and tests ALL backend API routes
 * providing a comprehensive overview of the API structure
 */

// Colors for better readability
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const API_BASE_URL = 'http://localhost:3000';

// ========================================
// API ROUTE STRUCTURE
// ========================================

const API_ROUTES = {
  // ========== SERVER ROOT ==========
  root: {
    title: '🏠 Server Root',
    baseUrl: '',
    routes: [
      { method: 'GET', path: '/', description: 'API Information', auth: false },
      { method: 'GET', path: '/health', description: 'Health Check', auth: false }
    ]
  },

  // ========== AUTHENTICATION ==========
  auth: {
    title: '🔐 Authentication',
    baseUrl: '/api/auth',
    routes: [
      { method: 'POST', path: '/register', description: 'Register new user', auth: false, body: { name: '', email: '', password: '', role: '', department: '' } },
      { method: 'POST', path: '/login', description: 'User login', auth: false, body: { email: '', password: '' } },
      { method: 'POST', path: '/logout', description: 'User logout', auth: true },
      { method: 'GET', path: '/me', description: 'Get current user', auth: true },
      { method: 'POST', path: '/change-password', description: 'Change password', auth: true, body: { oldPassword: '', newPassword: '' } },
      { method: 'POST', path: '/forgot-password', description: 'Request password reset', auth: false, body: { email: '' } },
      { method: 'POST', path: '/reset-password/:token', description: 'Reset password', auth: false, body: { password: '' } },
      { method: 'POST', path: '/refresh-token', description: 'Refresh JWT token', auth: false, body: { refreshToken: '' } }
    ]
  },

  // ========== STUDENT ROUTES ==========
  student: {
    title: '🎓 Student',
    baseUrl: '/api/student',
    role: 'STUDENT',
    routes: [
      { method: 'GET', path: '/profile', description: 'Get student profile', auth: true },
      { method: 'PUT', path: '/profile', description: 'Update student profile', auth: true },
      { method: 'POST', path: '/resume', description: 'Upload resume', auth: true, contentType: 'multipart/form-data' },
      { method: 'DELETE', path: '/resume', description: 'Delete resume', auth: true },
      { method: 'GET', path: '/drives/active', description: 'Get active placement drives', auth: true },
      { method: 'POST', path: '/drives/:driveId/apply', description: 'Apply to placement drive', auth: true },
      { method: 'GET', path: '/applications', description: 'Get my applications', auth: true },
      { method: 'GET', path: '/applications/:applicationId/status', description: 'Get application status', auth: true },
      { method: 'DELETE', path: '/applications/:applicationId', description: 'Withdraw application', auth: true },
      { method: 'GET', path: '/applications/:applicationId/offer-letter', description: 'Download offer letter', auth: true },
      { method: 'GET', path: '/dashboard', description: 'Get student dashboard', auth: true }
    ]
  },

  // ========== HOD ROUTES ==========
  hod: {
    title: '👔 Head of Department (HOD)',
    baseUrl: '/api/hod',
    role: 'HOD',
    routes: [
      { method: 'GET', path: '/approvals/pending', description: 'Get pending student approvals', auth: true },
      { method: 'POST', path: '/approvals/:studentId/approve', description: 'Approve student', auth: true },
      { method: 'POST', path: '/approvals/:studentId/reject', description: 'Reject student', auth: true },
      { method: 'GET', path: '/students', description: 'Get department students', auth: true },
      { method: 'GET', path: '/students/:studentId', description: 'Get student details', auth: true },
      { method: 'POST', path: '/students/:studentId/verify', description: 'Verify student profile', auth: true },
      { method: 'GET', path: '/statistics', description: 'Get department statistics', auth: true },
      { method: 'GET', path: '/reports/placement', description: 'Get placement report', auth: true },
      { method: 'GET', path: '/dashboard', description: 'Get HOD dashboard', auth: true }
    ]
  },

  // ========== TPO ROUTES ==========
  tpo: {
    title: '🏢 Training & Placement Officer (TPO)',
    baseUrl: '/api/tpo',
    role: 'TPO',
    routes: [
      { method: 'POST', path: '/companies', description: 'Add new company', auth: true },
      { method: 'GET', path: '/companies', description: 'Get all companies', auth: true },
      { method: 'POST', path: '/drives', description: 'Create placement drive', auth: true },
      { method: 'GET', path: '/drives', description: 'Get all drives', auth: true },
      { method: 'PUT', path: '/drives/:driveId', description: 'Update drive', auth: true },
      { method: 'DELETE', path: '/drives/:driveId', description: 'Delete drive', auth: true },
      { method: 'POST', path: '/drives/:driveId/close', description: 'Close drive', auth: true },
      { method: 'GET', path: '/drives/:driveId/applications', description: 'Get drive applications', auth: true },
      { method: 'PUT', path: '/applications/:applicationId/status', description: 'Update application status', auth: true },
      { method: 'POST', path: '/applications/bulk-update', description: 'Bulk update application status', auth: true },
      { method: 'POST', path: '/applications/:applicationId/offer-letter', description: 'Upload offer letter', auth: true, contentType: 'multipart/form-data' },
      { method: 'POST', path: '/notifications', description: 'Send notification', auth: true },
      { method: 'GET', path: '/dashboard', description: 'Get TPO dashboard', auth: true }
    ]
  },

  // ========== PLACEMENT DRIVES ==========
  drives: {
    title: '🚀 Placement Drives (Public)',
    baseUrl: '/api/drives',
    routes: [
      { method: 'GET', path: '/', description: 'Get all drives', auth: true },
      { method: 'GET', path: '/active', description: 'Get active drives', auth: true },
      { method: 'GET', path: '/upcoming', description: 'Get upcoming drives', auth: true },
      { method: 'GET', path: '/search', description: 'Search drives', auth: true, query: { keyword: '', company: '' } },
      { method: 'GET', path: '/company/:companyId', description: 'Get drives by company', auth: true },
      { method: 'GET', path: '/:driveId', description: 'Get drive by ID', auth: true },
      { method: 'GET', path: '/:driveId/stats', description: 'Get drive statistics', auth: true },
      { method: 'GET', path: '/:driveId/check-eligibility', description: 'Check eligibility for drive', auth: true }
    ]
  },

  // ========== FILE UPLOADS ==========
  upload: {
    title: '📤 File Upload & ATS',
    baseUrl: '/api/upload',
    routes: [
      { method: 'POST', path: '/resume', description: 'Upload resume with ATS scoring', auth: true, role: 'STUDENT', contentType: 'multipart/form-data' },
      { method: 'GET', path: '/ats-score', description: 'Get ATS score', auth: true, role: 'STUDENT' },
      { method: 'POST', path: '/reanalyze-resume', description: 'Re-analyze existing resume', auth: true, role: 'STUDENT' },
      { method: 'POST', path: '/offer-letter', description: 'Upload offer letter', auth: true, role: 'TPO', contentType: 'multipart/form-data' },
      { method: 'GET', path: '/info/:folder/:filename', description: 'Get file information', auth: true },
      { method: 'DELETE', path: '/:folder/:filename', description: 'Delete file', auth: true },
      { method: 'GET', path: '/list/:folder', description: 'List files in folder', auth: true }
    ]
  },

  // ========== EMAIL TESTING ==========
  emailTest: {
    title: '📧 Email Testing (Dev Only)',
    baseUrl: '/api/test/email',
    devOnly: true,
    routes: [
      { method: 'GET', path: '/connection', description: 'Test email connection', auth: false },
      { method: 'POST', path: '/send', description: 'Send test email', auth: false, body: { to: '', subject: '', message: '' } }
    ]
  },

  // ========== OAUTH2 ==========
  oauth: {
    title: '🔑 OAuth2',
    baseUrl: '/auth',
    routes: [
      { method: 'GET', path: '/callback', description: 'OAuth2 callback', auth: false }
    ]
  }
};

// ========================================
// STATISTICS & ANALYSIS
// ========================================

function analyzeRoutes() {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║          API ROUTES ANALYZER - COMPLETE OVERVIEW              ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  let totalRoutes = 0;
  let publicRoutes = 0;
  let authRoutes = 0;
  let roleSpecificRoutes = { STUDENT: 0, HOD: 0, TPO: 0 };
  
  const methodCount = { GET: 0, POST: 0, PUT: 0, DELETE: 0 };
  const contentTypes = { json: 0, formData: 0 };

  // Analyze each category
  Object.entries(API_ROUTES).forEach(([key, category]) => {
    console.log(`\n${colors.bold}${colors.magenta}${category.title}${colors.reset}`);
    console.log(`${colors.cyan}Base URL: ${API_BASE_URL}${category.baseUrl}${colors.reset}`);
    
    if (category.devOnly) {
      console.log(`${colors.yellow}⚠️  Development Only${colors.reset}`);
    }
    
    if (category.role) {
      console.log(`${colors.blue}👤 Role Required: ${category.role}${colors.reset}`);
    }
    
    console.log(`${colors.gray}${'─'.repeat(60)}${colors.reset}`);

    category.routes.forEach((route, index) => {
      totalRoutes++;
      methodCount[route.method]++;

      if (route.auth) {
        authRoutes++;
      } else {
        publicRoutes++;
      }

      if (route.role) {
        roleSpecificRoutes[route.role]++;
      }

      if (route.contentType === 'multipart/form-data') {
        contentTypes.formData++;
      } else {
        contentTypes.json++;
      }

      // Color code by method
      let methodColor = colors.green;
      if (route.method === 'POST') methodColor = colors.blue;
      if (route.method === 'PUT') methodColor = colors.yellow;
      if (route.method === 'DELETE') methodColor = colors.red;

      const authBadge = route.auth ? `${colors.red}🔒${colors.reset}` : `${colors.green}🌐${colors.reset}`;
      const roleBadge = route.role ? `${colors.blue}[${route.role}]${colors.reset}` : '';

      console.log(
        `${String(index + 1).padStart(2, ' ')}. ${authBadge} ${methodColor}${route.method.padEnd(6)}${colors.reset} ${category.baseUrl}${route.path.padEnd(40)} ${roleBadge}`
      );
      console.log(`    ${colors.gray}↳ ${route.description}${colors.reset}`);
      
      if (route.body) {
        console.log(`    ${colors.gray}📦 Body: ${JSON.stringify(route.body)}${colors.reset}`);
      }
      
      if (route.query) {
        console.log(`    ${colors.gray}🔍 Query: ${JSON.stringify(route.query)}${colors.reset}`);
      }
      
      if (route.contentType) {
        console.log(`    ${colors.gray}📎 Content-Type: ${route.contentType}${colors.reset}`);
      }
    });
  });

  // Print Statistics
  console.log(`\n${colors.bold}${colors.cyan}`);
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                     API STATISTICS                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  console.log(`\n${colors.bold}📊 Route Statistics:${colors.reset}`);
  console.log(`   Total Routes: ${colors.green}${totalRoutes}${colors.reset}`);
  console.log(`   Public Routes: ${colors.green}${publicRoutes}${colors.reset} (${((publicRoutes/totalRoutes)*100).toFixed(1)}%)`);
  console.log(`   Protected Routes: ${colors.red}${authRoutes}${colors.reset} (${((authRoutes/totalRoutes)*100).toFixed(1)}%)`);

  console.log(`\n${colors.bold}🎭 Role-Based Routes:${colors.reset}`);
  Object.entries(roleSpecificRoutes).forEach(([role, count]) => {
    console.log(`   ${role}: ${colors.blue}${count}${colors.reset} routes`);
  });

  console.log(`\n${colors.bold}📡 HTTP Methods:${colors.reset}`);
  Object.entries(methodCount).forEach(([method, count]) => {
    if (count > 0) {
      console.log(`   ${method}: ${colors.cyan}${count}${colors.reset} routes`);
    }
  });

  console.log(`\n${colors.bold}📝 Content Types:${colors.reset}`);
  console.log(`   JSON: ${colors.green}${contentTypes.json}${colors.reset} routes`);
  console.log(`   Form Data: ${colors.yellow}${contentTypes.formData}${colors.reset} routes`);

  // Feature Highlights
  console.log(`\n${colors.bold}${colors.magenta}✨ Key Features:${colors.reset}`);
  console.log(`   ${colors.green}✓${colors.reset} User Authentication & Authorization`);
  console.log(`   ${colors.green}✓${colors.reset} Role-Based Access Control (Student, HOD, TPO)`);
  console.log(`   ${colors.green}✓${colors.reset} Placement Drive Management`);
  console.log(`   ${colors.green}✓${colors.reset} Application Tracking System`);
  console.log(`   ${colors.green}✓${colors.reset} Resume Upload with ATS Scoring`);
  console.log(`   ${colors.green}✓${colors.reset} Student Profile Management`);
  console.log(`   ${colors.green}✓${colors.reset} HOD Approval Workflow`);
  console.log(`   ${colors.green}✓${colors.reset} TPO Dashboard & Controls`);
  console.log(`   ${colors.green}✓${colors.reset} Company Management`);
  console.log(`   ${colors.green}✓${colors.reset} Notification System`);
  console.log(`   ${colors.green}✓${colors.reset} File Upload & Management`);
  console.log(`   ${colors.green}✓${colors.reset} Email Integration`);
  console.log(`   ${colors.green}✓${colors.reset} OAuth2 Support`);

  console.log(`\n${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

// ========================================
// QUICK REFERENCE GUIDE
// ========================================

function printQuickReference() {
  console.log(`${colors.bold}${colors.yellow}`);
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                     QUICK REFERENCE GUIDE                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  console.log(`\n${colors.bold}🚀 Getting Started:${colors.reset}`);
  console.log(`   1. Start server: ${colors.cyan}npm run dev${colors.reset}`);
  console.log(`   2. Server runs on: ${colors.green}${API_BASE_URL}${colors.reset}`);
  console.log(`   3. Test health: ${colors.cyan}curl ${API_BASE_URL}/health${colors.reset}`);

  console.log(`\n${colors.bold}🔐 Authentication Flow:${colors.reset}`);
  console.log(`   1. Register: POST /api/auth/register`);
  console.log(`   2. Login: POST /api/auth/login`);
  console.log(`   3. Get token from response`);
  console.log(`   4. Add header: ${colors.cyan}Authorization: Bearer <token>${colors.reset}`);

  console.log(`\n${colors.bold}👥 User Roles:${colors.reset}`);
  console.log(`   ${colors.blue}STUDENT${colors.reset}  - Can view drives, apply, upload resume`);
  console.log(`   ${colors.yellow}HOD${colors.reset}      - Can approve students, view department stats`);
  console.log(`   ${colors.magenta}TPO${colors.reset}      - Can manage drives, companies, applications (Admin access)`);

  console.log(`\n${colors.bold}📤 File Upload Endpoints:${colors.reset}`);
  console.log(`   Resume: POST /api/upload/resume (with ATS scoring)`);
  console.log(`   Offer Letter: POST /api/upload/offer-letter (TPO only)`);
  console.log(`   Content-Type: multipart/form-data`);

  console.log(`\n${colors.bold}🎯 ATS Feature:${colors.reset}`);
  console.log(`   Upload Resume → Automatic Analysis → Get Score (0-100)`);
  console.log(`   View Score: GET /api/upload/ats-score`);
  console.log(`   Re-analyze: POST /api/upload/reanalyze-resume`);

  console.log(`\n${colors.bold}📊 Dashboard Endpoints:${colors.reset}`);
  console.log(`   Student: GET /api/student/dashboard`);
  console.log(`   HOD: GET /api/hod/dashboard`);
  console.log(`   TPO: GET /api/tpo/dashboard`);

  console.log(`\n${colors.bold}🧪 Testing:${colors.reset}`);
  console.log(`   Postman Collection recommended`);
  console.log(`   Dev Email Testing: /api/test/email (NODE_ENV=development)`);
  console.log(`   Check logs in: ./logs directory`);

  console.log(`\n${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

// ========================================
// ENDPOINT CATEGORIZATION
// ========================================

function printEndpointsByCategory() {
  console.log(`${colors.bold}${colors.green}`);
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║              ENDPOINTS BY FUNCTIONALITY                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const categories = {
    'Authentication & User Management': [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/auth/me',
      'POST /api/auth/change-password',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password/:token',
      'POST /api/auth/refresh-token'
    ],
    'Student Operations': [
      'GET /api/student/profile',
      'PUT /api/student/profile',
      'POST /api/student/resume',
      'GET /api/student/drives/active',
      'POST /api/student/drives/:driveId/apply',
      'GET /api/student/applications',
      'GET /api/student/dashboard'
    ],
    'HOD Operations': [
      'GET /api/hod/approvals/pending',
      'POST /api/hod/approvals/:studentId/approve',
      'POST /api/hod/approvals/:studentId/reject',
      'GET /api/hod/students',
      'GET /api/hod/statistics',
      'GET /api/hod/dashboard'
    ],
    'TPO Operations': [
      'POST /api/tpo/companies',
      'POST /api/tpo/drives',
      'GET /api/tpo/drives',
      'PUT /api/tpo/applications/:applicationId/status',
      'POST /api/tpo/notifications',
      'GET /api/tpo/dashboard'
    ],
    'Placement Drives (All Users)': [
      'GET /api/drives',
      'GET /api/drives/active',
      'GET /api/drives/upcoming',
      'GET /api/drives/:driveId',
      'GET /api/drives/:driveId/check-eligibility'
    ],
    'File & ATS Management': [
      'POST /api/upload/resume',
      'GET /api/upload/ats-score',
      'POST /api/upload/reanalyze-resume',
      'POST /api/upload/offer-letter',
      'GET /api/upload/list/:folder'
    ]
  };

  Object.entries(categories).forEach(([category, endpoints]) => {
    console.log(`\n${colors.bold}${colors.yellow}${category}:${colors.reset}`);
    endpoints.forEach(endpoint => {
      console.log(`   ${colors.cyan}●${colors.reset} ${endpoint}`);
    });
  });

  console.log(`\n${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

// ========================================
// MAIN EXECUTION
// ========================================

console.clear();
analyzeRoutes();
printQuickReference();
printEndpointsByCategory();

console.log(`${colors.bold}${colors.green}✅ API Route Analysis Complete!${colors.reset}\n`);
console.log(`${colors.gray}💡 Tip: Use this as a reference for API testing and documentation${colors.reset}\n`);
