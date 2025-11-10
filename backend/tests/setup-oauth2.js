/**
 * Gmail OAuth2 Setup Helper
 * This script helps generate OAuth2 credentials for Gmail
 */

import { google } from 'googleapis';
import readline from 'readline';

// OAuth2 configuration
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // For desktop applications

async function generateOAuth2Credentials() {
  console.log('🔐 Gmail OAuth2 Setup Helper');
  console.log('===============================\n');

  // Step 1: Get Client ID and Client Secret from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise((resolve) => {
    rl.question(prompt, resolve);
  });

  try {
    console.log('📋 First, you need to create OAuth2 credentials in Google Cloud Console:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Gmail API');
    console.log('4. Go to Credentials → Create Credentials → OAuth client ID');
    console.log('5. Choose "Desktop application"');
    console.log('6. Copy the Client ID and Client Secret\n');

    const clientId = await question('Enter your Client ID: ');
    const clientSecret = await question('Enter your Client Secret: ');

    // Step 2: Generate authorization URL
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('\n🌐 Authorization URL generated!');
    console.log('Open this URL in your browser:');
    console.log(authUrl);
    console.log('\nAfter authorization, you will get an authorization code.');

    const code = await question('\nEnter the authorization code: ');

    // Step 3: Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('\n✅ OAuth2 tokens generated successfully!');
    console.log('\n📝 Add these to your .env file:');
    console.log(`GMAIL_CLIENT_ID=${clientId}`);
    console.log(`GMAIL_CLIENT_SECRET=${clientSecret}`);
    console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GMAIL_ACCESS_TOKEN=${tokens.access_token}`);

    console.log('\n🔄 Your refresh token will be used to automatically generate new access tokens.');
    console.log('💡 Keep these credentials secure and never commit them to version control!');

  } catch (error) {
    console.error('❌ Error generating OAuth2 credentials:', error.message);
  } finally {
    rl.close();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOAuth2Credentials();
}

export default generateOAuth2Credentials;