import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function testApply() {
  try {
    console.log('\n🧪 TESTING STUDENT APPLY TO DRIVE\n');
    
    // 1. Login as Student
    console.log('1️⃣  Logging in as student...');
    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'teststu@example.com',
      password: 'teststu@example.com'
    });
    const studentToken = studentLogin.data.token;
    console.log('✅ Student logged in');

    // 2. Get active drives
    console.log('\n2️⃣  Fetching active drives...');
    const drives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    console.log(`✅ Found ${drives.data.drives.length} active drives`);
    
    if (drives.data.drives.length === 0) {
      console.log('❌ No active drives found. Please create a drive first using the TPO dashboard.');
      return;
    }

    const drive = drives.data.drives[0];
    console.log(`\n📋 First Drive:`);
    console.log(`   Company: ${drive.Company?.name || drive.company_name}`);
    console.log(`   Role: ${drive.job_role}`);
    console.log(`   Package: ${drive.package}`);
    console.log(`   Eligible: ${drive.isEligible ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Already Applied: ${drive.hasApplied ? 'Yes' : 'No'}`);

    if (drive.hasApplied) {
      console.log('\n✅ Student has already applied to this drive!');
      console.log('   Test Result: Application persistence working! ✨');
      return;
    }

    if (!drive.isEligible) {
      console.log('\n⚠️  Student is not eligible for this drive');
      return;
    }

    // 3. Apply to drive
    console.log(`\n3️⃣  Applying to drive ${drive.id}...`);
    const application = await axios.post(
      `${API_BASE_URL}/student/drives/${drive.id}/apply`,
      {},
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    
    console.log('✅ Application submitted successfully!');
    console.log(`   Application ID: ${application.data.application.id}`);
    console.log(`   Status: ${application.data.application.status}`);

    // 4. Verify application saved
    console.log('\n4️⃣  Verifying application was saved...');
    const updatedDrives = await axios.get(`${API_BASE_URL}/student/drives/active`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    const appliedDrive = updatedDrives.data.drives.find(d => d.id === drive.id);
    if (appliedDrive && appliedDrive.hasApplied) {
      console.log('✅ Application verified - hasApplied flag is TRUE!');
      console.log('\n' + '='.repeat(50));
      console.log('🎉 SUCCESS! Student enrollment works end-to-end');
      console.log('='.repeat(50));
    } else {
      console.log('❌ Application not reflected in drives list');
    }

    // 5. Try applying again
    console.log('\n5️⃣  Testing duplicate application prevention...');
    try {
      await axios.post(
        `${API_BASE_URL}/student/drives/${drive.id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      console.log('❌ ERROR: Should not allow duplicate application');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Correctly blocked duplicate application');
        console.log(`   Message: ${error.response.data.message}`);
      }
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message:`, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testApply();
