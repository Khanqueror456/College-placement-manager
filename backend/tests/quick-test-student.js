import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Test student login
async function testStudentLogin() {
  console.log('Testing student login...\n');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'john@example.com',
      password: 'Password*123'
    });
    
    console.log('✓ Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    // Test getting profile
    const profileResponse = await axios.get(`${BASE_URL}/api/student/profile`, {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });
    
    console.log('\n✓ Profile retrieved successfully!');
    console.log('Profile:', profileResponse.data.profile);
    
  } catch (error) {
    console.log('✗ Error:', error.response?.data || error.message);
  }
}

testStudentLogin();
