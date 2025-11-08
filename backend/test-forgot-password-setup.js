/**
 * Test Forgot Password Feature
 * This script tests the database and email setup
 */

import sequelize from './config/database.js';
import User from './models/users.js';
import crypto from 'crypto';

async function testForgotPassword() {
  try {
    console.log('🧪 Testing Forgot Password Setup...\n');
    
    // Test 1: Check database connection
    console.log('1️⃣  Testing database connection...');
    await sequelize.authenticate();
    console.log('   ✅ Database connected\n');
    
    // Test 2: Sync User model
    console.log('2️⃣  Syncing User model...');
    await User.sync({ alter: true });
    console.log('   ✅ User model synced\n');
    
    // Test 3: Check if reset fields exist
    console.log('3️⃣  Checking reset password fields...');
    const tableDescription = await sequelize.getQueryInterface().describeTable('Users');
    
    if (tableDescription.resetPasswordToken) {
      console.log('   ✅ resetPasswordToken field exists');
    } else {
      console.log('   ❌ resetPasswordToken field missing');
    }
    
    if (tableDescription.resetPasswordExpire) {
      console.log('   ✅ resetPasswordExpire field exists');
    } else {
      console.log('   ❌ resetPasswordExpire field missing');
    }
    console.log('');
    
    // Test 4: Test token generation
    console.log('4️⃣  Testing token generation...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('   ✅ Token generated successfully');
    console.log('   Token length:', resetToken.length);
    console.log('   Hashed token length:', hashedToken.length);
    console.log('');
    
    // Test 5: Check email configuration
    console.log('5️⃣  Checking email configuration...');
    if (process.env.EMAIL_USER) {
      console.log('   ✅ EMAIL_USER is set:', process.env.EMAIL_USER);
    } else {
      console.log('   ❌ EMAIL_USER is not set');
    }
    
    if (process.env.EMAIL_PASSWORD) {
      console.log('   ✅ EMAIL_PASSWORD is set: ***hidden***');
    } else {
      console.log('   ❌ EMAIL_PASSWORD is not set');
    }
    console.log('');
    
    console.log('✅ All tests completed!\n');
    
    if (!tableDescription.resetPasswordToken || !tableDescription.resetPasswordExpire) {
      console.log('⚠️  IMPORTANT: Reset password fields are missing!');
      console.log('   Run: node add-reset-fields.js');
      console.log('   Or restart your server to auto-sync\n');
    }
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️  IMPORTANT: Email is not configured!');
      console.log('   Add to your .env file:');
      console.log('   EMAIL_USER=your-email@gmail.com');
      console.log('   EMAIL_PASSWORD=your-app-password\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testForgotPassword();
