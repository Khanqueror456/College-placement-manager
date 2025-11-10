/**
 * Test Data Generator
 * Creates mock test data for HOD and TPO functionality testing
 * 
 * Usage: node generate-test-data.js
 */

const BASE_URL = 'http://localhost:3000/api';

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

const testUsers = [
  // Students
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@student.edu',
    password: 'Password123!',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2024001',
    phone: '9876543210',
    cgpa: 8.5
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@student.edu',
    password: 'Password123!',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2024002',
    phone: '9876543211',
    cgpa: 7.8
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@student.edu',
    password: 'Password123!',
    role: 'student',
    department: 'Information Technology',
    rollNumber: 'IT2024001',
    phone: '9876543212',
    cgpa: 9.1
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@student.edu',
    password: 'Password123!',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2024003',
    phone: '9876543213',
    cgpa: 8.0
  },
  {
    name: 'Eva Brown',
    email: 'eva.brown@student.edu',
    password: 'Password123!',
    role: 'student',
    department: 'Electronics',
    rollNumber: 'EC2024001',
    phone: '9876543214',
    cgpa: 8.7
  },
  
  // HODs
  {
    name: 'Dr. John Anderson',
    email: 'hod.cs@college.edu',
    password: 'Password123!',
    role: 'hod',
    department: 'Computer Science',
    phone: '9876543220'
  },
  {
    name: 'Dr. Sarah Miller',
    email: 'hod.it@college.edu',
    password: 'Password123!',
    role: 'hod',
    department: 'Information Technology',
    phone: '9876543221'
  },
  {
    name: 'Dr. Robert Taylor',
    email: 'hod.ec@college.edu',
    password: 'Password123!',
    role: 'hod',
    department: 'Electronics',
    phone: '9876543222'
  },
  
  // TPOs
  {
    name: 'Michael Johnson',
    email: 'tpo@college.edu',
    password: 'Password123!',
    role: 'tpo',
    department: 'Placement Cell',
    phone: '9876543230'
  },
  {
    name: 'Lisa Wang',
    email: 'tpo.assistant@college.edu',
    password: 'Password123!',
    role: 'tpo',
    department: 'Placement Cell',
    phone: '9876543231'
  }
];

const testCompanies = [
  {
    name: 'Google Inc.',
    website: 'https://google.com',
    industry: 'Technology',
    description: 'Global technology company specializing in Internet-related services',
    hrEmail: 'hr@google.com',
    hrPhone: '1234567890'
  },
  {
    name: 'Microsoft Corporation',
    website: 'https://microsoft.com',
    industry: 'Technology',
    description: 'Multinational technology corporation',
    hrEmail: 'recruitment@microsoft.com',
    hrPhone: '1234567891'
  },
  {
    name: 'Amazon',
    website: 'https://amazon.com',
    industry: 'E-commerce/Cloud Computing',
    description: 'American multinational technology company',
    hrEmail: 'hiring@amazon.com',
    hrPhone: '1234567892'
  },
  {
    name: 'Apple Inc.',
    website: 'https://apple.com',
    industry: 'Technology',
    description: 'American multinational technology company',
    hrEmail: 'jobs@apple.com',
    hrPhone: '1234567893'
  },
  {
    name: 'Meta (Facebook)',
    website: 'https://meta.com',
    industry: 'Social Media/Technology',
    description: 'American multinational technology conglomerate',
    hrEmail: 'careers@meta.com',
    hrPhone: '1234567894'
  }
];

async function createTestUser(user) {
  console.log(`Creating user: ${user.name} (${user.role})`);
  
  // Try login first
  let response = await makeRequest('POST', '/auth/login', {
    email: user.email,
    password: user.password
  });
  
  if (response.ok) {
    console.log(`${colors.yellow}  User already exists, skipping registration${colors.reset}`);
    return response.data.token;
  }
  
  // Register if login fails
  response = await makeRequest('POST', '/auth/register', user);
  
  if (response.ok) {
    console.log(`${colors.green}  ✅ User created successfully${colors.reset}`);
    return response.data.token;
  } else {
    console.log(`${colors.red}  ❌ Failed to create user: ${response.data.message || response.error}${colors.reset}`);
    return null;
  }
}

async function createTestCompany(company, tpoToken) {
  console.log(`Creating company: ${company.name}`);
  
  const response = await makeRequest('POST', '/tpo/companies', company, tpoToken);
  
  if (response.ok) {
    console.log(`${colors.green}  ✅ Company created successfully${colors.reset}`);
    return response.data.company;
  } else if (response.status === 409) {
    console.log(`${colors.yellow}  Company already exists, skipping${colors.reset}`);
    return null;
  } else {
    console.log(`${colors.red}  ❌ Failed to create company: ${response.data.message || response.error}${colors.reset}`);
    return null;
  }
}

async function createTestDrive(company, tpoToken) {
  const drives = [
    {
      companyName: company.name,
      jobRole: 'Software Engineer',
      jobDescription: 'Full-stack development role with modern technologies',
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
    },
    {
      companyName: company.name,
      jobRole: 'Software Development Intern',
      jobDescription: '6-month internship program for final year students',
      package: '50k/month',
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science', 'Information Technology', 'Electronics'],
        maxBacklogs: 1,
        graduationYear: 2024
      },
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      driveDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Virtual',
      jobType: 'Internship'
    }
  ];

  for (const drive of drives) {
    console.log(`Creating drive: ${drive.jobRole} at ${drive.companyName}`);
    
    const response = await makeRequest('POST', '/tpo/drives', drive, tpoToken);
    
    if (response.ok) {
      console.log(`${colors.green}  ✅ Drive created successfully${colors.reset}`);
    } else {
      console.log(`${colors.red}  ❌ Failed to create drive: ${response.data.message || response.error}${colors.reset}`);
    }
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function generateTestData() {
  console.log(`${colors.bold}${colors.blue}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}║                    TEST DATA GENERATOR                       ║${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
  
  console.log(`${colors.yellow}Target URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.yellow}Started: ${new Date().toLocaleString()}${colors.reset}\n`);

  try {
    // Check server connectivity
    const healthResponse = await makeRequest('GET', '/health').catch(() => ({ status: 0 }));
    if (healthResponse.status === 0) {
      console.log(`${colors.red}❌ Cannot connect to server at ${BASE_URL}${colors.reset}`);
      console.log(`${colors.yellow}Please ensure the server is running with: npm run dev${colors.reset}`);
      process.exit(1);
    }

    console.log(`${colors.blue}📝 Creating test users...${colors.reset}\n`);
    
    const createdUsers = {};
    
    // Create all test users
    for (const user of testUsers) {
      const token = await createTestUser(user);
      if (token) {
        createdUsers[user.email] = { ...user, token };
      }
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    }

    // Get TPO token for creating companies and drives
    const tpoUser = Object.values(createdUsers).find(user => user.role === 'tpo');
    if (!tpoUser) {
      console.log(`${colors.red}❌ No TPO user found, cannot create companies and drives${colors.reset}`);
      return;
    }

    console.log(`\n${colors.blue}🏢 Creating test companies...${colors.reset}\n`);
    
    const createdCompanies = [];
    
    // Create test companies
    for (const company of testCompanies) {
      const createdCompany = await createTestCompany(company, tpoUser.token);
      if (createdCompany) {
        createdCompanies.push({ ...company, id: createdCompany.id });
      }
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    }

    console.log(`\n${colors.blue}📋 Creating test placement drives...${colors.reset}\n`);
    
    // Create test drives for first 3 companies
    for (let i = 0; i < Math.min(3, createdCompanies.length); i++) {
      await createTestDrive(createdCompanies[i], tpoUser.token);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }

    console.log(`\n${colors.bold}${colors.green}🎉 Test data generation completed!${colors.reset}`);
    
    console.log(`\n${colors.bold}📊 Summary:${colors.reset}`);
    console.log(`   Users created: ${Object.keys(createdUsers).length}`);
    console.log(`   - Students: ${Object.values(createdUsers).filter(u => u.role === 'student').length}`);
    console.log(`   - HODs: ${Object.values(createdUsers).filter(u => u.role === 'hod').length}`);
    console.log(`   - TPOs: ${Object.values(createdUsers).filter(u => u.role === 'tpo').length}`);
    console.log(`   Companies: ${testCompanies.length}`);
    console.log(`   Drives: Up to ${Math.min(3, testCompanies.length) * 2}`);

    console.log(`\n${colors.bold}🔑 Test Credentials:${colors.reset}`);
    console.log(`${colors.yellow}HOD (Computer Science):${colors.reset}`);
    console.log(`   Email: hod.cs@college.edu`);
    console.log(`   Password: Password123!`);
    
    console.log(`${colors.yellow}TPO:${colors.reset}`);
    console.log(`   Email: tpo@college.edu`);
    console.log(`   Password: Password123!`);
    
    console.log(`${colors.yellow}Student (Sample):${colors.reset}`);
    console.log(`   Email: alice.johnson@student.edu`);
    console.log(`   Password: Password123!`);

    console.log(`\n${colors.blue}You can now run the test scripts:${colors.reset}`);
    console.log(`   node test-hod-tpo.js`);
    console.log(`   node test-endpoints.js hod`);
    console.log(`   node test-endpoints.js tpo`);

  } catch (error) {
    console.error(`${colors.red}💥 Error during test data generation: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  }
}

generateTestData();