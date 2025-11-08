import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function checkDrives() {
  try {
    console.log('\n🔍 CHECKING DRIVES VISIBILITY\n');
    console.log('='.repeat(60));

    // 1. Login as TPO to see all drives
    console.log('\n1️⃣  Logging in as TPO...');
    const tpoLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test@example.com'
    });
    const tpoToken = tpoLogin.data.token;
    console.log('✅ TPO logged in');

    // 2. Get ALL drives from TPO view
    console.log('\n2️⃣  Fetching ALL drives (TPO view)...');
    const allDrives = await axios.get(`${API_BASE_URL}/tpo/drives`, {
      headers: { Authorization: `Bearer ${tpoToken}` }
    });

    console.log(`\n📊 TOTAL DRIVES IN DATABASE: ${allDrives.data.drives?.length || 0}`);
    
    if (allDrives.data.drives) {
      console.log('\n' + '='.repeat(60));
      allDrives.data.drives.forEach((drive, idx) => {
        console.log(`\n📋 DRIVE ${idx + 1}:`);
        console.log(`   ID: ${drive.id}`);
        console.log(`   Company: ${drive.company_name}`);
        console.log(`   Role: ${drive.job_role}`);
        console.log(`   Status: ${drive.status}`);
        console.log(`   Package: ${drive.package}`);
        console.log(`   Min CGPA: ${drive.min_cgpa}`);
        console.log(`   Allowed Departments: ${JSON.stringify(drive.allowed_departments)}`);
        console.log(`   Application Deadline: ${drive.application_deadline}`);
        console.log(`   Drive Date: ${drive.drive_date}`);
        console.log(`   Created: ${drive.createdAt}`);
      });
    }

    // 3. Login as Student
    console.log('\n' + '='.repeat(60));
    console.log('\n3️⃣  Logging in as Student...');
    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'teststu@example.com',
      password: 'teststu@example.com'
    });
    const studentToken = studentLogin.data.token;
    console.log('✅ Student logged in');

    // 4. Get student profile
    console.log('\n4️⃣  Getting student profile...');
    const profile = await axios.get(`${API_BASE_URL}/student/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    console.log('\n📋 STUDENT PROFILE:');
    console.log(`   Name: ${profile.data.name || 'N/A'}`);
    console.log(`   Department: ${profile.data.department || 'N/A'}`);
    console.log(`   CGPA: ${profile.data.cgpa || 'N/A'}`);
    console.log(`   Student ID: ${profile.data.student_id || 'N/A'}`);

    // 5. Get active drives visible to student
    console.log('\n5️⃣  Fetching drives visible to student...');
    const studentDrives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });

    console.log(`\n📊 DRIVES VISIBLE TO STUDENT: ${studentDrives.data.drives?.length || 0}`);
    
    if (studentDrives.data.drives && studentDrives.data.drives.length > 0) {
      console.log('\n' + '='.repeat(60));
      studentDrives.data.drives.forEach((drive, idx) => {
        console.log(`\n✅ VISIBLE DRIVE ${idx + 1}:`);
        console.log(`   ID: ${drive.id}`);
        console.log(`   Company: ${drive.companyName}`);
        console.log(`   Role: ${drive.jobRole}`);
        console.log(`   Package: ${drive.package}`);
        console.log(`   Eligible: ${drive.isEligible}`);
        console.log(`   Applied: ${drive.hasApplied}`);
      });
    } else {
      console.log('\n❌ NO DRIVES VISIBLE TO STUDENT!');
    }

    // 6. Compare
    console.log('\n' + '='.repeat(60));
    console.log('\n🔍 ANALYSIS:');
    console.log(`   Total Drives in DB: ${allDrives.data.drives?.length || 0}`);
    console.log(`   Drives Visible to Student: ${studentDrives.data.drives?.length || 0}`);
    console.log(`   Missing Drives: ${(allDrives.data.drives?.length || 0) - (studentDrives.data.drives?.length || 0)}`);

    if (allDrives.data.drives) {
      const visibleIds = new Set(studentDrives.data.drives?.map(d => d.id) || []);
      const missingDrives = allDrives.data.drives.filter(d => !visibleIds.has(d.id));
      
      if (missingDrives.length > 0) {
        console.log('\n❌ MISSING DRIVES (WHY NOT VISIBLE?):');
        missingDrives.forEach(drive => {
          console.log(`\n   Drive ID ${drive.id} - ${drive.job_role}:`);
          console.log(`      Status: ${drive.status} ${drive.status !== 'ACTIVE' ? '❌ NOT ACTIVE!' : '✅'}`);
          
          const deadline = new Date(drive.application_deadline);
          const now = new Date();
          console.log(`      Deadline: ${drive.application_deadline}`);
          console.log(`      Deadline Passed: ${deadline < now ? '❌ YES!' : '✅ NO'}`);
          console.log(`      Current Time: ${now.toISOString()}`);
        });
      }
    }

    console.log('\n' + '='.repeat(60) + '\n');

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

checkDrives();
