import sequelize from './config/database.js';

async function removeAdminRole() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database\n');
    
    // Check if any ADMIN users exist
    const [adminUsers] = await sequelize.query("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'");
    console.log(`Found ${adminUsers[0].count} ADMIN users`);
    
    if (adminUsers[0].count > 0) {
      console.log('Deleting ADMIN users...');
      await sequelize.query("DELETE FROM users WHERE role = 'ADMIN'");
      console.log('✅ ADMIN users deleted\n');
    }
    
    // Remove ADMIN from enum (can't remove if it's being used, so we delete users first)
    console.log('Note: PostgreSQL enum values cannot be removed once added.');
    console.log('The ADMIN value will remain in the enum but won\'t be used.');
    console.log('✅ ADMIN role will be disabled in the application code.\n');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeAdminRole();
