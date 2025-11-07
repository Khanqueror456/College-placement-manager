/**
 * Simple OAuth2 URL Generator
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/auth/callback';
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';

if (!CLIENT_ID) {
  console.error('❌ Missing GMAIL_CLIENT_ID! Please set it in your .env file');
  process.exit(1);
}

// Generate the authorization URL
const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
  `client_id=${CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `scope=${encodeURIComponent(SCOPES)}&` +
  `response_type=code&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log('🔐 Gmail OAuth2 Authorization');
console.log('============================\n');
console.log('1. Open this URL in your browser:');
console.log('\n' + authUrl + '\n');
console.log('2. Sign in with your Gmail account');
console.log('3. Grant permissions to send emails');
console.log('4. Copy the authorization code that appears');
console.log('5. Come back here with the code\n');

export { authUrl };