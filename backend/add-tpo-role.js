import sequelize from './config/database.js';

async function addTPORole() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database\n');
    
    console.log('Adding TPO to role enum...');
    await sequelize.query(`
      ALTER TYPE enum_users_role ADD VALUE IF NOT EXISTS 'TPO'
    `);
    
    console.log('✅ TPO role added successfully!\n');
    
    // Verify
    const [results] = await sequelize.query(`
      SELECT enumlabel 
      FROM pg_enum e 
      JOIN pg_type t ON e.enumtypid = t.oid 
      WHERE t.typname = 'enum_users_role'
      ORDER BY enumsortorder
    `);
    
    console.log('Current role enum values:');
    results.forEach(r => console.log(`  - ${r.enumlabel}`));
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTPORole();
