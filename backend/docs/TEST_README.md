# 🧪 API Test Suite

Automated testing script for College Placement Management Portal APIs.

## 📋 **What This Script Tests**

### **1. Authentication APIs (8 tests)**
- ✅ Student registration
- ✅ HOD registration  
- ✅ TPO registration
- ✅ Student login
- ✅ HOD login
- ✅ TPO login
- ✅ Get current user
- ✅ Invalid login handling

### **2. TPO Operations (6 tests)**
- ✅ Add company
- ✅ Get all companies
- ✅ Create placement drive
- ✅ Get all drives
- ✅ Update drive
- ✅ TPO dashboard

### **3. Student Operations (7 tests)**
- ✅ Get student profile
- ✅ Update profile
- ✅ Get active drives
- ✅ Apply to drive
- ✅ Get my applications
- ✅ Get application status
- ✅ Student dashboard

### **4. HOD Operations (5 tests)**
- ✅ Get pending approvals
- ✅ Approve student
- ✅ Get department students
- ✅ Get department statistics
- ✅ HOD dashboard

### **5. Drive Operations (6 tests)**
- ✅ Get all drives
- ✅ Get active drives
- ✅ Get drive by ID
- ✅ Get drive statistics
- ✅ Get upcoming drives
- ✅ Check eligibility

### **6. Advanced TPO Operations (4 tests)**
- ✅ Get applications for drive
- ✅ Update application status
- ✅ Bulk update status
- ✅ Close drive

### **7. Error Handling (5 tests)**
- ✅ Unauthorized access
- ✅ Invalid token
- ✅ Wrong role access
- ✅ Invalid data format
- ✅ Non-existent resource

---

## 🚀 **How to Run**

### **Prerequisites**
1. Make sure your backend server is running on `http://localhost:3000`
2. Database should be connected and running

### **Method 1: Using npm**
```bash
npm test
```

### **Method 2: Direct execution**
```bash
node test-api.js
```

### **Method 3: Using nodemon (auto-restart on changes)**
```bash
npx nodemon test-api.js
```

---

## 📊 **Output**

The script provides:
- ✅ Real-time test execution status
- 🎨 Color-coded results (Green = Pass, Red = Fail)
- 📈 Summary statistics
- 🔑 Collected tokens and IDs for reference
- ⚠️  Detailed error messages for failed tests

### **Sample Output**
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     COLLEGE PLACEMENT MANAGEMENT PORTAL                   ║
║            API AUTOMATED TEST SUITE                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

📍 Testing API at: http://localhost:3000/api
⏰ Started at: 11/7/2025, 6:30:00 PM

========================================
📋 AUTHENTICATION TESTS
========================================

🧪 Testing: Register Student
✅ PASSED

🧪 Testing: Register HOD
✅ PASSED

...

========================================
📊 TEST SUMMARY
========================================

Total Tests: 41
✅ Passed: 38
❌ Failed: 3
Success Rate: 92.68%
```

---

## 🔧 **Configuration**

Edit the `BASE_URL` constant in `test-api.js` if your server runs on a different port:

```javascript
const BASE_URL = 'http://localhost:3000/api';  // Change if needed
```

---

## 📝 **Test Data**

The script automatically collects and stores:
- `studentToken` - JWT token for student user
- `hodToken` - JWT token for HOD user
- `tpoToken` - JWT token for TPO user
- `driveId` - ID of created placement drive
- `applicationId` - ID of student application
- `studentId` - ID of registered student
- `companyId` - ID of added company

---

## ⚠️ **Important Notes**

1. **Routes Must Be Implemented**: This script assumes all API routes are set up in your server
2. **Database Required**: Tests will fail if database is not connected
3. **Clean State**: For best results, run tests on a clean database
4. **Order Matters**: Tests run sequentially as some depend on previous test data
5. **Tokens**: The script stores tokens in memory for subsequent requests

---

## 🐛 **Troubleshooting**

### **Issue: Connection Refused**
```bash
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Solution**: Make sure your backend server is running (`npm start`)

### **Issue: 404 Not Found**
```bash
Expected 200, got 404
```
**Solution**: API routes need to be implemented and connected to controllers

### **Issue: Database Error**
```bash
Database connection failed
```
**Solution**: Check your PostgreSQL connection in `.env` file

### **Issue: All Tests Failing**
```bash
Multiple 500 errors
```
**Solution**: Check server logs for detailed error messages

---

## 📦 **What's Included**

### **test-api.js**
- Main test script
- 41 comprehensive test cases
- Automatic token management
- Colored console output
- Detailed error reporting

### **Features**
- ✅ Automatic test discovery
- ✅ Sequential test execution
- ✅ Token persistence between tests
- ✅ Detailed error messages
- ✅ Summary statistics
- ✅ Exit codes (0 = all pass, 1 = some failed)

---

## 🎯 **Next Steps**

After running tests successfully:

1. **Implement Missing Routes**: Connect controllers to Express routes
2. **Add Database Models**: Create Sequelize models for data persistence
3. **Add More Tests**: Extend the test suite for edge cases
4. **CI/CD Integration**: Use in GitHub Actions or similar
5. **Performance Testing**: Add timing metrics

---

## 📖 **Usage in CI/CD**

Add to your `.github/workflows/test.yml`:

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Start server
        run: npm start &
      - name: Run tests
        run: npm test
```

---

## 🤝 **Contributing**

To add more tests:

1. Create a new test function following the pattern
2. Add assertions using the `assert()` helper
3. Call the function in `runAllTests()`

Example:
```javascript
async function myNewTests() {
  await runTest('My Test Name', async () => {
    const response = await makeRequest('GET', '/endpoint', null, token);
    assert(response.status === 200, 'Expected 200');
  });
}
```

---

## 📄 **License**

Same as main project

---

## 💡 **Tips**

- Run tests frequently during development
- Use `npm run dev` in one terminal and tests in another
- Check individual test results to pinpoint issues
- Save tokens for manual Postman testing
- Monitor server logs while tests run

---

**Happy Testing! 🚀**
