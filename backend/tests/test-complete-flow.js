import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function createTestDrive() {
  try {
    console.log('\n🧪 CREATING TEST DRIVE FOR STUDENT\n');
    
    // 1. Login as TPO
    console.log('1️⃣  Logging in as TPO...');
    const tpoLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test@example.com'
    });
    const tpoToken = tpoLogin.data.token;
    console.log('✅ TPO logged in');

    // 2. Login as Student to get profile
    console.log('\n2️⃣  Checking student profile...');
    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'teststu@example.com',
      password: 'teststu@example.com'
    });
    const studentToken = studentLogin.data.token;
    
    const profile = await axios.get(`${API_BASE_URL}/student/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    const student = profile.data.student || profile.data.user || profile.data;
    console.log('✅ Student Profile:');
    console.log(`   Name: ${student.full_name || student.name || 'N/A'}`);
    console.log(`   Department: ${student.department || 'N/A'}`);
    console.log(`   CGPA: ${student.cgpa || 'N/A'}`);

    // 3. Get or create company
    console.log('\n3️⃣  Getting companies...');
    const companies = await axios.get(`${API_BASE_URL}/tpo/companies`, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });
    
    let companyId;
    if (companies.data.companies && companies.data.companies.length > 0) {
      companyId = companies.data.companies[0].id;
      console.log(`✅ Using company: ${companies.data.companies[0].name} (ID: ${companyId})`);
    }

    // 4. Create drive matching student's profile
    console.log('\n4️⃣  Creating drive for student...');
    const drive = await axios.post(`${API_BASE_URL}/tpo/drives`, {
      companyId: companyId,
      companyName: 'Student Test Company',
      jobRole: 'Software Engineer',
      jobDescription: 'Entry level position for students',
      jobType: 'FULL_TIME',
      package: '8 LPA',
      location: 'Remote',
      driveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eligibilityCriteria: {
        minCGPA: student.cgpa ? student.cgpa - 1 : 6.0,
        allowedDepartments: student.department ? [student.department] : [],
        maxBacklogs: 2
      }
    }, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });
    
    console.log(`✅ Drive created: ${drive.data.drive.job_role || 'Unknown Role'} (ID: ${drive.data.drive.id})`);
    console.log(`   Min CGPA: ${drive.data.drive.min_cgpa || 'N/A'}`);
    console.log(`   Departments: ${drive.data.drive.allowed_departments ? drive.data.drive.allowed_departments.join(', ') : 'Any'}`);
    
    // 5. Verify student can see it
    console.log('\n5️⃣  Verifying student can see the drive...');
    const activeDrives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    const matchingDrive = activeDrives.data.drives.find(d => d.id === drive.data.drive.id);
    if (matchingDrive) {
      console.log('✅ Student can see the drive!');
      console.log(`   Eligible: ${matchingDrive.isEligible ? 'Yes ✅' : 'No ❌'}`);
      
      if (matchingDrive.isEligible) {
        console.log('\n6️⃣  Student applying to drive...');
        const application = await axios.post(
          `${API_BASE_URL}/student/drives/${drive.data.drive.id}/apply`,
          {},
          { headers: { Authorization: `Bearer ${studentToken}` } }
        );
        console.log('✅ Application submitted!');
        console.log(`   Application ID: ${application.data.application.id}`);
        console.log(`   Status: ${application.data.application.status}`);
        
        // 7. Verify it appears in TPO's view
        console.log('\n7️⃣  Checking TPO can see the application...');
        const applications = await axios.get(
          `${API_BASE_URL}/tpo/drives/${drive.data.drive.id}/applications`,
          { headers: { Authorization: `Bearer ${tpoToken}` } }
        );
        console.log(`✅ TPO sees ${applications.data.applications.length} application(s)`);
        
        if (applications.data.applications.length > 0) {
          const app = applications.data.applications[0];
          console.log(`   Student: ${app.Student?.full_name}`);
          console.log(`   Status: ${app.status}`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 SUCCESS! Complete end-to-end flow working!');
        console.log('='.repeat(50));
      } else {
        console.log('❌ Student not eligible even with matched criteria');
      }
    } else {
      console.log('❌ Drive not visible to student');
    }

  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

createTestDrive();
