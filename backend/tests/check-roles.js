import sequelize from './config/database.js';

async function checkEnums() {
  try {
    await sequelize.authenticate();
    
    const [results] = await sequelize.query(`
      SELECT enumlabel 
      FROM pg_enum e 
      JOIN pg_type t ON e.enumtypid = t.oid 
      WHERE t.typname = 'enum_users_role'
      ORDER BY enumsortorder
    `);
    
    console.log('Available role enum values:');
    results.forEach(r => console.log(`  - ${r.enumlabel}`));
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkEnums();
