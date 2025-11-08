import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function debugDrives() {
  try {
    console.log('\n🔍 DEBUGGING DRIVE VISIBILITY\n');
    console.log('='.repeat(50));
    
    // Login as student
    console.log('\n1️⃣  Logging in as student...');
    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'teststu@example.com',
      password: 'teststu@example.com'
    });
    const studentToken = studentLogin.data.token;
    console.log('✅ Student logged in');

    // Get student profile
    console.log('\n2️⃣  Getting student profile...');
    const profile = await axios.get(`${API_BASE_URL}/student/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    console.log('📋 Student Details:');
    console.log('   Raw response:', JSON.stringify(profile.data, null, 2));
    
    // Login as TPO
    console.log('\n3️⃣  Logging in as TPO...');
    const tpoLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test@example.com'
    });
    const tpoToken = tpoLogin.data.token;
    console.log('✅ TPO logged in');

    // Get all drives (TPO view)
    console.log('\n4️⃣  Getting all drives (TPO view)...');
    const allDrives = await axios.get(`${API_BASE_URL}/tpo/drives`, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });
    
    console.log(`📊 Total Drives: ${allDrives.data.drives?.length || 0}`);
    
    if (allDrives.data.drives && allDrives.data.drives.length > 0) {
      console.log('\n📋 Drive Details:');
      allDrives.data.drives.forEach((drive, idx) => {
        console.log(`\n   Drive ${idx + 1}:`);
        console.log(`   ID: ${drive.id}`);
        console.log(`   Company: ${drive.company_name}`);
        console.log(`   Role: ${drive.job_role}`);
        console.log(`   Status: ${drive.status}`);
        console.log(`   Min CGPA: ${drive.min_cgpa}`);
        console.log(`   Allowed Departments: ${JSON.stringify(drive.allowed_departments)}`);
        console.log(`   Application Deadline: ${drive.application_deadline}`);
        console.log(`   Drive Date: ${drive.drive_date}`);
      });
    }

    // Get active drives (student view)
    console.log('\n5️⃣  Getting active drives (student view)...');
    const activeDrives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    console.log(`📊 Visible to Student: ${activeDrives.data.drives?.length || 0} drives`);
    
    if (activeDrives.data.drives && activeDrives.data.drives.length > 0) {
      console.log('\n📋 Student Can See:');
      activeDrives.data.drives.forEach((drive, idx) => {
        console.log(`\n   Drive ${idx + 1}:`);
        console.log(`   ID: ${drive.id}`);
        console.log(`   Company: ${drive.companyName}`);
        console.log(`   Role: ${drive.jobRole}`);
        console.log(`   Eligible: ${drive.isEligible ? '✅ Yes' : '❌ No'}`);
        console.log(`   Already Applied: ${drive.hasApplied ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('\n❌ No drives visible to student');
      console.log('\n🔍 POSSIBLE REASONS:');
      console.log('   1. Student CGPA is lower than drive requirements');
      console.log('   2. Student department not in allowed departments');
      console.log('   3. Application deadline has passed');
      console.log('   4. Drive status is not ACTIVE');
      console.log('   5. Student profile is incomplete (missing CGPA or department)');
    }

    console.log('\n' + '='.repeat(50));

  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

debugDrives();
