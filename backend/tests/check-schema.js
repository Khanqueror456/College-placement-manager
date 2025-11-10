import sequelize from './config/database.js';

async function checkSchema() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to database\n');
    
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name='users' 
      ORDER BY ordinal_position
    `);
    
    console.log('Users table structure:');
    console.table(results);
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();
