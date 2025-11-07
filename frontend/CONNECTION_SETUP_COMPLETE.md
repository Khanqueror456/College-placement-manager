# 🚀 Frontend-Backend Connection Setup Complete!

Your frontend is now successfully connected to your backend running on **localhost:3000**.

## ✅ What Was Done

### 1. **API Service Layer Created**
- `src/services/api.js` - Core axios configuration with interceptors
- `src/services/authService.js` - Authentication functions
- `src/services/studentService.js` - Student-related API calls
- `src/services/hodService.js` - HOD-related API calls
- `src/services/tpoService.js` - TPO-related API calls

### 2. **Login Page Updated**
- Connected to backend authentication API
- Added form state management
- Implemented login and registration functionality
- Added error/success message handling
- Role-based navigation after login

### 3. **Vite Configuration**
- Added proxy for `/api` routes → `http://localhost:3000`
- Added proxy for `/auth` routes → `http://localhost:3000`
- Enabled CORS with credentials

### 4. **Dependencies**
- Installed `axios` for HTTP requests

### 5. **Test Page Created**
- `src/pages/ApiTest.jsx` - Component to test backend connectivity
- Access at: `http://localhost:5173/api-test`

## 🎯 How to Use

### Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend will run on: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Test the Connection

1. **Option 1: Use the Test Page**
   - Navigate to: `http://localhost:5173/api-test`
   - Click "Test Connection" button
   - Should show "Connected Successfully!"

2. **Option 2: Try Login**
   - Navigate to: `http://localhost:5173/login`
   - Select a role (Student/HOD/Placement Officer)
   - Try to login or register
   - Check browser console for API requests

### Using the API Services

**Example: Login**
```javascript
import { login } from '../services/authService';

const handleLogin = async () => {
  try {
    const response = await login('user@example.com', 'password');
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

**Example: Get Student Profile**
```javascript
import { getStudentProfile } from '../services/studentService';

const fetchProfile = async () => {
  try {
    const data = await getStudentProfile();
    console.log('Profile:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📁 New Files Structure

```
frontend/
├── src/
│   ├── services/          # NEW - API service layer
│   │   ├── api.js         # Axios instance & interceptors
│   │   ├── authService.js # Authentication APIs
│   │   ├── studentService.js
│   │   ├── hodService.js
│   │   └── tpoService.js
│   └── pages/
│       ├── ApiTest.jsx    # NEW - Connection test page
│       └── login.jsx      # UPDATED - Connected to backend
├── vite.config.js         # UPDATED - Added proxy
└── FRONTEND_BACKEND_CONNECTION.md  # Full documentation
```

## 🔑 Key Features

### Automatic Token Management
- JWT tokens automatically saved to localStorage on login
- Tokens automatically attached to all API requests
- Auto-logout on 401 (Unauthorized) responses

### Error Handling
- Global error interceptor
- User-friendly error messages
- Network error detection

### CORS Handling
- Vite proxy eliminates CORS issues during development
- Credentials automatically included

## 🛠️ Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Student
- `GET /api/student/profile` - Get profile
- `PUT /api/student/profile` - Update profile
- `GET /api/student/drives` - Available drives
- `POST /api/student/drives/:id/register` - Register for drive

### HOD
- `GET /api/hod/dashboard` - Dashboard
- `GET /api/hod/pending-approvals` - Pending students
- `PUT /api/hod/approve/:id` - Approve student
- `GET /api/hod/stats` - Statistics

### TPO
- `GET /api/tpo/dashboard` - Dashboard
- `GET /api/tpo/drives` - All drives
- `POST /api/tpo/drives` - Create drive
- `GET /api/tpo/stats` - Statistics

## 🔍 Debugging

### Check Backend Health
Direct URL: `http://localhost:3000/health`

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development",
  "database": "PostgreSQL"
}
```

### Check Frontend Proxy
Via frontend: `http://localhost:5173/api/health` (proxy will forward)

### Browser Console
Open DevTools (F12) → Network tab to see:
- API request URLs
- Request/response data
- Status codes
- Errors

## ⚠️ Troubleshooting

**Problem: CORS errors**
- Solution: Use the proxy (requests to `/api/*` not `http://localhost:3000/api/*`)

**Problem: 404 Not Found**
- Check backend is running on port 3000
- Verify endpoint exists in backend

**Problem: 401 Unauthorized**
- Token may be expired or invalid
- Try logging in again

**Problem: Network Error**
- Backend may not be running
- Check firewall settings
- Verify ports 3000 and 5173 are available

## 📚 Documentation

For detailed documentation, see:
- `FRONTEND_BACKEND_CONNECTION.md` - Complete setup guide
- Backend API routes in `backend/routes/`
- Service function definitions in `frontend/src/services/`

## 🎉 Next Steps

1. ✅ Connection is ready!
2. Test the login/registration flow
3. Implement dashboard components
4. Add protected routes
5. Create role-based access control
6. Build out the remaining UI features

## 💡 Quick Tips

- Always import from `services/` not directly from `api.js`
- Use try-catch blocks when calling API functions
- Check localStorage for stored tokens: `localStorage.getItem('token')`
- Use React DevTools to inspect component state
- Monitor Network tab for API call debugging

---

**Ready to test?** Start both servers and visit `http://localhost:5173/api-test` 🚀
