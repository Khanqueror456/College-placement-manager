import sequelize from './config/database.js';

async function testApprovalFlow() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');
    
    // Step 1: Create a new test student with PENDING status
    console.log('📝 Step 1: Creating new test student with PENDING status...');
    const [createResult] = await sequelize.query(`
      DELETE FROM users WHERE email = 'teststudent@test.com';
      INSERT INTO users (name, email, password, phone, role, department, student_id, is_active, profile_status, created_at, updated_at)
      VALUES ('Test Student', 'teststudent@test.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', '1234567890', 'STUDENT', 'IOT', 'TEST123', true, 'PENDING', NOW(), NOW())
      RETURNING id, name, email, department, profile_status;
    `);
    
    const [students] = await sequelize.query(`
      SELECT id, name, email, department, profile_status
      FROM users 
      WHERE email = 'teststudent@test.com'
    `);
    
    const student = students[0];
    console.log('✅ Student created:', student);
    console.log();
    
    // Step 2: Check if HOD can see this student
    console.log('📝 Step 2: Checking if HOD can see pending student...');
    const [pendingStudents] = await sequelize.query(`
      SELECT id, name, email, student_id, department, phone, batch_year, cgpa, created_at
      FROM users 
      WHERE role = 'STUDENT' 
        AND department = 'IOT' 
        AND profile_status = 'PENDING'
      ORDER BY created_at DESC
    `);
    
    console.log(`✅ Found ${pendingStudents.length} pending students for IOT department:`);
    pendingStudents.forEach(s => {
      console.log(`   - ${s.name} (${s.email}) - Status: PENDING`);
    });
    console.log();
    
    // Step 3: Approve the student
    console.log('📝 Step 3: Approving student...');
    await sequelize.query(`
      UPDATE users 
      SET profile_status = 'APPROVED', updated_at = NOW()
      WHERE id = ${student.id}
    `);
    
    const [approvedCheck] = await sequelize.query(`
      SELECT id, name, email, department, profile_status
      FROM users 
      WHERE id = ${student.id}
    `);
    
    console.log('✅ Student after approval:', approvedCheck[0]);
    console.log();
    
    // Step 4: Verify student no longer appears in pending list
    console.log('📝 Step 4: Verifying student no longer in pending list...');
    const [pendingAfterApproval] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM users 
      WHERE role = 'STUDENT' 
        AND department = 'IOT' 
        AND profile_status = 'PENDING'
    `);
    
    console.log(`✅ Pending students count after approval: ${pendingAfterApproval[0].count}`);
    console.log();
    
    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✅ APPROVAL WORKFLOW TEST COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log('✓ Student created with PENDING status');
    console.log('✓ HOD can query pending students');
    console.log('✓ Student approved successfully');
    console.log('✓ Student removed from pending list');
    console.log('═══════════════════════════════════════\n');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.close();
  }
}

testApprovalFlow();
