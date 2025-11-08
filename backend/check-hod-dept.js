import sequelize from './config/database.js';

async function checkDepartments() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database\n');
    
    // Check HOD details
    const [hodResults] = await sequelize.query(`
      SELECT id, name, email, role, department 
      FROM users 
      WHERE email = 'testhod@example.com'
    `);
    
    console.log('HOD Details:');
    console.log(hodResults[0]);
    console.log();
    
    // Check student details
    const [studentResults] = await sequelize.query(`
      SELECT id, name, email, role, department, profile_status 
      FROM users 
      WHERE email = 'student@student.com'
    `);
    
    console.log('Student Details:');
    console.log(studentResults[0]);
    console.log();
    
    // Check if they match
    if (hodResults[0] && studentResults[0]) {
      console.log('Department Match:');
      console.log(`HOD department: "${hodResults[0].department}"`);
      console.log(`Student department: "${studentResults[0].department}"`);
      console.log(`Match: ${hodResults[0].department === studentResults[0].department}`);
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDepartments();
