import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

async function debugResumeUpload() {
  console.log('🔍 Debugging Resume Upload & ATS APIs\n');

  try {
    // Step 1: Create and login a test student
    console.log('1️⃣ Creating test student...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Debug Student',
      email: `debug_student_${Date.now()}@test.com`,
      password: 'Debug@123',
      role: 'student',
      department: 'Computer Science',
      student_id: `DEBUG_${Date.now()}`,
      batch_year: 2024,
      cgpa: 8.0
    });
    console.log('✓ Student created:', registerResponse.data.user.id);

    // Step 2: Login to get token
    console.log('\n2️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: registerResponse.data.user.email,
      password: 'Debug@123'
    });
    const token = loginResponse.data.token;
    console.log('✓ Token received:', token.substring(0, 20) + '...');

    // Step 3: Check if PDF exists
    console.log('\n3️⃣ Checking for test PDF...');
    const testPdfPath = path.join(__dirname, 'uploads', 'documents', 'Sample Resumes.pdf');
    console.log('   Path:', testPdfPath);
    
    if (!fs.existsSync(testPdfPath)) {
      console.log('❌ Test PDF not found!');
      return;
    }
    
    const stats = fs.statSync(testPdfPath);
    console.log('✓ PDF found:', stats.size, 'bytes');

    // Step 4: Upload resume
    console.log('\n4️⃣ Uploading resume with ATS scoring...');
    const formData = new FormData();
    formData.append('resume', fs.createReadStream(testPdfPath));
    
    try {
      const uploadResponse = await axios.post(`${BASE_URL}/api/upload/resume`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Upload successful!');
      console.log('   Response:', JSON.stringify(uploadResponse.data, null, 2));
      
      // Step 5: Get ATS score
      console.log('\n5️⃣ Retrieving ATS score...');
      const scoreResponse = await axios.get(`${BASE_URL}/api/upload/ats-score`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ ATS Score retrieved!');
      console.log('   Score:', scoreResponse.data.atsScore);
      console.log('   Analysis:', JSON.stringify(scoreResponse.data.atsAnalysis, null, 2));
      
      // Step 6: Re-analyze resume
      console.log('\n6️⃣ Re-analyzing resume...');
      const reanalyzeResponse = await axios.post(`${BASE_URL}/api/upload/reanalyze-resume`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Re-analysis successful!');
      console.log('   New Score:', reanalyzeResponse.data.atsScore);
      
    } catch (uploadError) {
      console.log('❌ Upload/API Error:');
      console.log('   Status:', uploadError.response?.status);
      console.log('   Message:', uploadError.response?.data?.message || uploadError.message);
      console.log('   Full error:', JSON.stringify(uploadError.response?.data, null, 2));
      
      // Check if it's a route issue
      console.log('\n🔍 Checking if upload routes are mounted...');
      try {
        const healthCheck = await axios.get(`${BASE_URL}/health`);
        console.log('✓ Server is running');
      } catch (e) {
        console.log('❌ Server not responding');
      }
    }

  } catch (error) {
    console.log('\n❌ Fatal Error:');
    console.log('   Message:', error.message);
    console.log('   Response:', error.response?.data);
    console.error(error);
  }
}

debugResumeUpload();
