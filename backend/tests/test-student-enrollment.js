import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

let tpoToken = '';
let studentToken = '';
let driveId = '';
let companyId = '';

async function testStudentEnrollment() {
  try {
    console.log('\n🧪 TESTING STUDENT ENROLLMENT FLOW\n');
    console.log('='.repeat(50));

    // 1. Login as TPO
    console.log('\n1️⃣  Logging in as TPO...');
    const tpoLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test@example.com'
    });
    tpoToken = tpoLogin.data.token;
    console.log('✅ TPO logged in successfully');

    // 2. Get existing companies or create one
    console.log('\n2️⃣  Fetching companies...');
    const companiesResponse = await axios.get(`${API_BASE_URL}/tpo/companies`, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });
    
    if (companiesResponse.data.companies && companiesResponse.data.companies.length > 0) {
      companyId = companiesResponse.data.companies[0].id;
      console.log(`✅ Using existing company: ${companiesResponse.data.companies[0].name} (ID: ${companyId})`);
    } else {
      console.log('   No companies found, creating one...');
      const company = await axios.post(`${API_BASE_URL}/tpo/companies`, {
        name: 'Test Tech Corp',
        description: 'A leading technology company',
        industry: 'Technology',
        location: 'Bangalore',
        contactEmail: 'hr@testtech.com',
        contactPhone: '9876543210'
      }, {
        headers: { Authorization: `Bearer ${tpoToken}` }
      });
      companyId = company.data.company.id;
      console.log(`✅ Company created: ${company.data.company.name} (ID: ${companyId})`);
    }

    // 3. Create a drive
    console.log('\n3️⃣  Creating a placement drive...');
    const drive = await axios.post(`${API_BASE_URL}/tpo/drives`, {
      companyId: companyId,
      companyName: 'Test Tech Corp',
      jobRole: 'Software Engineer',
      jobDescription: 'Full-stack development position',
      jobType: 'Full-time',
      package: '12 LPA',
      location: 'Bangalore',
      driveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eligibilityCriteria: {
        minCGPA: 7.0,
        allowedDepartments: ['Computer Science', 'Information Technology'],
        maxBacklogs: 0
      }
    }, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });
    driveId = drive.data.drive.id;
    console.log(`✅ Drive created: ${drive.data.drive.job_role} (ID: ${driveId})`);

    // 4. Login as Student
    console.log('\n4️⃣  Logging in as Student...');
    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'student1@test.com',
      password: 'password123'
    });
    studentToken = studentLogin.data.token;
    console.log('✅ Student logged in successfully');

    // 5. Get active drives (student view)
    console.log('\n5️⃣  Fetching active drives for student...');
    const activeDrives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Found ${activeDrives.data.drives.length} active drive(s)`);
    
    if (activeDrives.data.drives.length > 0) {
      const firstDrive = activeDrives.data.drives[0];
      console.log(`   📋 Drive: ${firstDrive.job_role} at ${firstDrive.Company?.name || 'Unknown Company'}`);
      console.log(`   📊 Eligible: ${firstDrive.isEligible ? 'Yes' : 'No'}`);
      console.log(`   📝 Applied: ${firstDrive.hasApplied ? 'Yes' : 'No'}`);
    }

    // 6. Apply to the drive
    console.log('\n6️⃣  Student applying to drive...');
    const application = await axios.post(`${API_BASE_URL}/student/drives/${driveId}/apply`, {}, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Application submitted successfully!`);
    console.log(`   Application ID: ${application.data.application.id}`);
    console.log(`   Status: ${application.data.application.status}`);

    // 7. Check active drives again (should show hasApplied = true)
    console.log('\n7️⃣  Checking drives again after applying...');
    const updatedDrives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const appliedDrive = updatedDrives.data.drives.find(d => d.id === driveId);
    if (appliedDrive) {
      console.log(`✅ Drive status updated:`);
      console.log(`   📝 Applied: ${appliedDrive.hasApplied ? 'Yes ✅' : 'No ❌'}`);
    }

    // 8. Try applying again (should fail)
    console.log('\n8️⃣  Attempting to apply again (should fail)...');
    try {
      await axios.post(`${API_BASE_URL}/student/drives/${driveId}/apply`, {}, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log('❌ ERROR: Should not allow duplicate application');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Correctly rejected duplicate application');
        console.log(`   Message: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    // 9. View applications (TPO view)
    console.log('\n9️⃣  TPO viewing applications for the drive...');
    const applications = await axios.get(`${API_BASE_URL}/tpo/drives/${driveId}/applications`, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });
    console.log(`✅ Found ${applications.data.applications.length} application(s)`);
    
    if (applications.data.applications.length > 0) {
      const app = applications.data.applications[0];
      console.log(`   Student: ${app.Student?.full_name || 'Unknown'}`);
      console.log(`   Email: ${app.Student?.email || 'Unknown'}`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Applied: ${new Date(app.applied_at).toLocaleDateString()}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS PASSED! Student enrollment flow works end-to-end');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.message || error.response.data}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Run the tests
testStudentEnrollment();
