/**
 * Add Reset Password Fields to Users Table
 * Run this script to add resetPasswordToken and resetPasswordExpire fields
 */

import sequelize from './config/database.js';
import User from './models/users.js';

async function addResetPasswordFields() {
  try {
    console.log('🔄 Checking and adding reset password fields...');
    
    // Force sync the User model (this will add missing columns)
    await User.sync({ alter: true });
    
    console.log('✅ Reset password fields added successfully!');
    console.log('Fields added:');
    console.log('  - resetPasswordToken (STRING)');
    console.log('  - resetPasswordExpire (DATE)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding reset password fields:', error);
    process.exit(1);
  }
}

addResetPasswordFields();
