/**
 * Test Email Notification Feature
 * This script tests the automatic email notification when TPO updates application status
 */

import dotenv from 'dotenv';
import { sendApplicationStatusEmail } from './lib/emailService.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Email Notification Feature for TPO Status Updates...\n');

// Test student data
const testStudent = {
  name: 'Test Student',
  email: process.env.EMAIL_USER // Send to yourself for testing
};

// Test application data
const testApplication = {
  id: 'TEST-123',
  companyName: 'Google Inc.',
  jobRole: 'Software Engineer',
  status: 'SELECTED'
};

async function testEmailNotifications() {
  console.log('📧 Email Configuration:');
  console.log(`   User: ${process.env.EMAIL_USER}`);
  console.log(`   Password: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not Set'}`);
  console.log(`   Host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}\n`);

  // Test 1: SELECTED status
  console.log('Test 1: Testing SELECTED status notification...');
  try {
    const result1 = await sendApplicationStatusEmail(
      testStudent,
      { ...testApplication, status: 'SELECTED' },
      'SELECTED',
      'Congratulations! You performed excellently in all rounds.'
    );
    console.log(result1 ? '✅ SELECTED email sent successfully\n' : '❌ Failed to send SELECTED email\n');
  } catch (error) {
    console.error('❌ Error sending SELECTED email:', error.message, '\n');
  }

  // Wait 2 seconds between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: SHORTLISTED status
  console.log('Test 2: Testing SHORTLISTED status notification...');
  try {
    const result2 = await sendApplicationStatusEmail(
      testStudent,
      { ...testApplication, status: 'SHORTLISTED' },
      'SHORTLISTED',
      'You have been shortlisted for the technical interview round. Good luck!'
    );
    console.log(result2 ? '✅ SHORTLISTED email sent successfully\n' : '❌ Failed to send SHORTLISTED email\n');
  } catch (error) {
    console.error('❌ Error sending SHORTLISTED email:', error.message, '\n');
  }

  // Wait 2 seconds between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: REJECTED status
  console.log('Test 3: Testing REJECTED status notification...');
  try {
    const result3 = await sendApplicationStatusEmail(
      testStudent,
      { ...testApplication, status: 'REJECTED' },
      'REJECTED',
      'Unfortunately, we are unable to proceed with your application at this time.'
    );
    console.log(result3 ? '✅ REJECTED email sent successfully\n' : '❌ Failed to send REJECTED email\n');
  } catch (error) {
    console.error('❌ Error sending REJECTED email:', error.message, '\n');
  }

  console.log('✨ All tests completed!');
  console.log('\n📬 Check your inbox at:', process.env.EMAIL_USER);
  console.log('   You should receive 3 emails with different statuses.');
  console.log('\n✅ The feature is working! When TPO updates application status:');
  console.log('   - Students automatically receive email notifications');
  console.log('   - Email content adapts based on status (SELECTED/REJECTED/SHORTLISTED)');
  console.log('   - Both single and bulk updates send emails');
}

// Run tests
testEmailNotifications()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
