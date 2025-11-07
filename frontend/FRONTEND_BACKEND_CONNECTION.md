# Frontend-Backend Connection Setup

This document explains how the frontend connects to the backend API running on localhost:3000.

## Configuration Overview

### Backend (Port 3000)
- **Base URL**: `http://localhost:3000`
- **API Routes**: `/api/*`
- **Auth Routes**: `/auth/*`

### Frontend (Port 5173)
- **Development Server**: `http://localhost:5173`
- **Proxy Configuration**: Vite proxy forwards `/api` and `/auth` requests to backend

## Files Created/Modified

### 1. API Configuration (`src/services/api.js`)
- Creates axios instance with base configuration
- Handles authentication tokens automatically
- Implements request/response interceptors
- Global error handling

### 2. Authentication Service (`src/services/authService.js`)
- `register(userData)` - Register new user
- `login(email, password)` - User login
- `logout()` - User logout
- `getCurrentUser()` - Get authenticated user info
- `changePassword()` - Change user password
- `forgotPassword()` - Request password reset
- `resetPassword()` - Reset password with token
- `isAuthenticated()` - Check if user is logged in
- `getStoredUser()` - Get user data from localStorage

### 3. Student Service (`src/services/studentService.js`)
- Student profile management
- Dashboard data
- Drive registration
- Resume upload

### 4. HOD Service (`src/services/hodService.js`)
- Department dashboard
- Student approvals/rejections
- Department statistics
- Placement reports

### 5. TPO Service (`src/services/tpoService.js`)
- Placement drive management
- Registration tracking
- Placement statistics
- Student status updates

### 6. Login Page (`src/pages/login.jsx`)
- Connected to backend API
- Handles login and registration
- Form validation
- Error/success messages
- Auto-redirect after login based on role

### 7. Vite Configuration (`vite.config.js`)
- Proxy setup for `/api` and `/auth` routes
- CORS handling
- Port configuration

## How It Works

### Request Flow
1. Frontend makes API call using service functions
2. Vite proxy intercepts requests to `/api/*` and `/auth/*`
3. Proxy forwards to `http://localhost:3000`
4. Backend processes request
5. Response returns through proxy to frontend

### Authentication Flow
1. User submits login form
2. `authService.login()` sends POST to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token saved to localStorage
5. Subsequent requests include token in Authorization header
6. Middleware validates token on protected routes

## Running the Application

### Start Backend (Port 3000)
```bash
cd backend
npm install
npm start
```

### Start Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
Open browser to `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_placement_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend
No environment variables needed - proxy handles routing.

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Student
- `GET /api/student/profile` - Get profile
- `PUT /api/student/profile` - Update profile
- `GET /api/student/dashboard` - Dashboard data
- `GET /api/student/drives` - Available drives
- `POST /api/student/drives/:id/register` - Register for drive
- `GET /api/student/registrations` - My registrations

### HOD
- `GET /api/hod/dashboard` - Dashboard data
- `GET /api/hod/pending-approvals` - Pending students
- `PUT /api/hod/approve/:id` - Approve student
- `PUT /api/hod/reject/:id` - Reject student
- `GET /api/hod/stats` - Department statistics
- `GET /api/hod/students` - All students
- `GET /api/hod/reports` - Placement reports

### TPO
- `GET /api/tpo/dashboard` - Dashboard data
- `GET /api/tpo/drives` - All drives
- `POST /api/tpo/drives` - Create drive
- `PUT /api/tpo/drives/:id` - Update drive
- `DELETE /api/tpo/drives/:id` - Delete drive
- `GET /api/tpo/drives/:id/registrations` - Drive registrations
- `GET /api/tpo/stats` - Placement statistics
- `GET /api/tpo/students` - All students

## Usage Examples

### Login Example
```javascript
import { login } from '../services/authService';

const handleLogin = async (email, password) => {
  try {
    const response = await login(email, password);
    console.log('User:', response.user);
    // Redirect based on role
    if (response.user.role === 'STUDENT') {
      navigate('/student/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Get Student Profile Example
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

### Create Drive Example
```javascript
import { createDrive } from '../services/tpoService';

const handleCreateDrive = async (driveData) => {
  try {
    const response = await createDrive({
      company_name: 'Tech Corp',
      position: 'Software Engineer',
      package: 1200000,
      deadline: '2024-12-31'
    });
    console.log('Drive created:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Testing the Connection

1. Start both backend and frontend servers
2. Open browser console (F12)
3. Navigate to login page
4. Submit login form
5. Check Network tab for API requests to localhost:3000
6. Check Console for any errors

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:5173`
- Check `backend/config/config.js` CORS settings

### 404 Not Found
- Verify backend is running on port 3000
- Check Vite proxy configuration
- Ensure API endpoints match backend routes

### Authentication Errors
- Check JWT secret matches in backend
- Verify token is saved to localStorage
- Check Authorization header in Network tab

### Network Errors
- Ensure both servers are running
- Check firewall settings
- Verify port 3000 is not blocked

## Next Steps

1. Implement protected routes in frontend
2. Add role-based access control
3. Create dashboard components
4. Add form validation
5. Implement error boundaries
6. Add loading states
7. Create notification system
