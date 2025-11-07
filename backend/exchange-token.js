/**
 * OAuth2 Token Exchange Script
 * Exchanges authorization code for tokens
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/auth/callback';

async function exchangeCodeForTokens(authorizationCode) {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('❌ Missing credentials! Please set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in your .env file');
      process.exit(1);
    }

    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    console.log('🔄 Exchanging authorization code for tokens...');
    
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    
    console.log('\n✅ Tokens received successfully!');
    console.log('\n📝 Update your .env file with these values:');
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GMAIL_ACCESS_TOKEN=${tokens.access_token}`);
    
    return tokens;
  } catch (error) {
    console.error('❌ Error exchanging code for tokens:', error.message);
    return null;
  }
}

// Get authorization code from command line argument
const authCode = process.argv[2];

if (!authCode) {
  console.log('❌ Please provide the authorization code as an argument:');
  console.log('node exchange-token.js YOUR_AUTHORIZATION_CODE');
  process.exit(1);
}

exchangeCodeForTokens(authCode);