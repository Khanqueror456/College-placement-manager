# HOD & TPO Testing Suite

Comprehensive testing suite for Head of Department (HOD) and Training & Placement Officer (TPO) functionalities in the College Placement Management Portal.

## 🚀 Quick Start

1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **Generate test data (optional but recommended):**
   ```bash
   npm run generate-test-data
   ```

3. **Run the comprehensive test suite:**
   ```bash
   npm run test:hod-tpo
   ```

## 📋 Available Test Scripts

### Main Test Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Comprehensive Suite** | `npm run test:hod-tpo` | Full HOD & TPO functionality testing with detailed reporting |
| **Endpoint Testing** | `npm run test:endpoints` | Quick endpoint validation for both HOD and TPO |
| **HOD Only** | `npm run test:hod` | Test only HOD-specific endpoints |
| **TPO Only** | `npm run test:tpo` | Test only TPO-specific endpoints |
| **Generate Test Data** | `npm run generate-test-data` | Create sample users, companies, and drives |

### Manual Scripts

```bash
# Comprehensive testing
node test-hod-tpo.js

# Endpoint testing
node test-endpoints.js [hod|tpo|all]

# Test data generation  
node generate-test-data.js
```

## 🧪 Test Categories

### HOD Functionality Tests

#### 1. Dashboard & Statistics
- ✅ Access HOD dashboard
- ✅ View department statistics
- ✅ Generate placement reports

#### 2. Student Management
- ✅ View pending student approvals
- ✅ Approve student registrations
- ✅ Reject student registrations with reasons
- ✅ Get all department students
- ✅ Search and filter students
- ✅ View individual student details
- ✅ Verify student profiles

#### 3. Access Control
- ✅ Verify HOD-only endpoint access
- ✅ Block unauthorized access to TPO endpoints

### TPO Functionality Tests

#### 1. Dashboard & Overview
- ✅ Access TPO dashboard
- ✅ View system-wide statistics

#### 2. Company Management
- ✅ Add new companies
- ✅ View all registered companies
- ✅ Update company information

#### 3. Placement Drive Management
- ✅ Create new placement drives
- ✅ View all drives with filtering
- ✅ Search drives by company/role
- ✅ Update drive details
- ✅ Close/end placement drives

#### 4. Application Management
- ✅ View applications for specific drives
- ✅ Update individual application status
- ✅ Bulk update application statuses
- ✅ Upload offer letters

#### 5. Communication
- ✅ Send notifications to students
- ✅ Broadcast announcements

#### 6. Access Control
- ✅ Verify TPO-only endpoint access
- ✅ Block unauthorized access to HOD endpoints

### Integration Tests

#### 1. Cross-Role Workflows
- ✅ HOD approval → Student eligibility → Drive application
- ✅ TPO drive creation → Student applications → HOD reports

#### 2. Error Handling
- ✅ Invalid data validation
- ✅ Network error handling
- ✅ Authentication failures

#### 3. Performance Tests
- ✅ Response time measurements
- ✅ Concurrent request handling
- ✅ Rate limiting validation

## 📊 Test Output Examples

### Successful Test Run
```
🧪 [HOD] Testing: Get Pending Student Approvals
✅ PASSED (245ms)

🧪 [TPO] Testing: Create Placement Drive  
✅ PASSED (312ms)

📊 Summary:
   Total Tests: 45
   ✅ Passed: 43
   ❌ Failed: 2
   📈 Success Rate: 95.6%
```

### Detailed Reporting
```
📋 Results by Category:

HOD: 18/20 (90.0%)
   ✅ Get HOD Dashboard (156ms)
   ✅ Get Pending Student Approvals (203ms)
   ❌ Approve Student Registration
      Error: Student not found

TPO: 22/23 (95.7%)
   ✅ Create Placement Drive (289ms)
   ✅ Get All Companies (134ms)
   ❌ Update Drive Status
      Error: Drive already closed
```

## 🔧 Configuration

### Environment Variables

```bash
# .env
API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Test Credentials

The test suite uses these default credentials (created by `generate-test-data.js`):

```javascript
// HOD Credentials
{
  email: 'hod.cs@college.edu',
  password: 'Password123!',
  department: 'Computer Science'
}

// TPO Credentials  
{
  email: 'tpo@college.edu',
  password: 'Password123!',
  department: 'Placement Cell'
}

// Student Credentials (sample)
{
  email: 'alice.johnson@student.edu', 
  password: 'Password123!',
  department: 'Computer Science'
}
```

## 📝 Test Data Structure

### Generated Users
- **5 Students** across different departments (CS, IT, Electronics)
- **3 HODs** for different departments
- **2 TPO Officers**

### Generated Companies
- Google Inc.
- Microsoft Corporation  
- Amazon
- Apple Inc.
- Meta (Facebook)

### Generated Drives
- Software Engineer positions
- Internship programs
- Various eligibility criteria

## 🔍 Troubleshooting

### Common Issues

#### 1. Server Not Running
```
❌ Cannot connect to server at http://localhost:3000/api
Please ensure the server is running with: npm run dev
```
**Solution:** Start the backend server first.

#### 2. Authentication Failures
```
❌ HOD login failed: Invalid credentials
```
**Solution:** Run `npm run generate-test-data` to create test users.

#### 3. Rate Limiting
```
❌ Too many requests from this IP
```
**Solution:** Tests include built-in delays. If issues persist, increase delays in test scripts.

#### 4. Database Connection
```
❌ Database connection failed
```
**Solution:** Ensure PostgreSQL is running and configured correctly.

### Debug Mode

Enable verbose logging by modifying the test scripts:

```javascript
// Add to test-hod-tpo.js
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', method, endpoint, data);
  console.log('Response:', response);
}
```

## 📈 Performance Benchmarks

### Expected Response Times
- Dashboard endpoints: < 500ms
- List endpoints: < 1000ms
- Create/Update operations: < 2000ms
- Bulk operations: < 3000ms

### Concurrent Load
- Tests validate up to 10 concurrent requests
- Rate limiting: 100 requests per 15 minutes per IP

## 🤝 Contributing

### Adding New Tests

1. **For HOD functionality:**
   ```javascript
   // Add to hodFunctionalityTests() in test-hod-tpo.js
   await runTest('New HOD Feature', async () => {
     const response = await makeRequest('GET', '/hod/new-endpoint', null, testData.hodToken);
     assertSuccess(response, 'Should access new feature');
   }, 'HOD');
   ```

2. **For TPO functionality:**
   ```javascript
   // Add to tpoFunctionalityTests() in test-hod-tpo.js  
   await runTest('New TPO Feature', async () => {
     const response = await makeRequest('POST', '/tpo/new-endpoint', data, testData.tpoToken);
     assertStatus(response, 201, 'Should create new resource');
   }, 'TPO');
   ```

### Test Guidelines

1. **Use descriptive test names**
2. **Include both positive and negative test cases**
3. **Add appropriate assertions**
4. **Handle rate limiting with delays**
5. **Clean up test data when possible**

## 📚 Related Documentation

- [Backend API Documentation](./CONTROLLERS_COMPLETE.md)
- [Middleware Documentation](./MIDDLEWARE_README.md)
- [Authentication Guide](./routes/authRoutes.js)
- [Database Schema](./models/)

## 🎯 Future Enhancements

- [ ] Load testing with artillery/k6
- [ ] Integration with CI/CD pipelines
- [ ] Mock database for isolated testing
- [ ] Visual test reporting dashboard
- [ ] API response validation schemas
- [ ] Automated regression testing

---

**Last Updated:** November 2024  
**Version:** 1.0.0  
**Maintained by:** Development Team