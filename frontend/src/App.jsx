import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Auth
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ViewDrives from './pages/student/ViewDrives';
import MyApplications from './pages/student/MyApplications';

// HOD
import HodDashboard from './pages/hod/HodDashboard';
import HodStats from './pages/hod/HodStats';
import HodReport from './pages/hod/HodReport';

// TPO
import TpoDashboard from './pages/tpo/TpoDashboard';
import TpoCompanies from './pages/tpo/TpoCompanies';
import TpoDrives from './pages/tpo/TpoDrives';
import TpoApplications from './pages/tpo/TpoApplications';
import TpoStudents from './pages/tpo/TpoStudents';

// General
import HomePage from './pages/HomePage';
import AboutPage from './pages/About';
import ContactPage from './components/Contact';
import NotFound from './pages/NotFound';
import ApiTest from './pages/ApiTest';

// Context & Components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={4000}
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            color: '#e2e8f0',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        
        {/* TPO Protected Routes */}
        <Route 
          path="/tpo-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['TPO']}>
              <TpoDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/tpo/companies" 
          element={
            <ProtectedRoute allowedRoles={['TPO']}>
              <TpoCompanies/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/tpo/drives" 
          element={
            <ProtectedRoute allowedRoles={['TPO']}>
              <TpoDrives/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/tpo/applications" 
          element={
            <ProtectedRoute allowedRoles={['TPO']}>
              <TpoApplications/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/tpo/students" 
          element={
            <ProtectedRoute allowedRoles={['TPO']}>
              <TpoStudents/>
            </ProtectedRoute>
          }
        />
        
        {/* HOD Protected Routes */}
        <Route 
          path="/hod-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['HOD']}>
              <HodDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/hod-stats" 
          element={
            <ProtectedRoute allowedRoles={['HOD']}>
              <HodStats/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/hod-report" 
          element={
            <ProtectedRoute allowedRoles={['HOD']}>
              <HodReport/>
            </ProtectedRoute>
          }
        />
        
        {/* Student Protected Routes */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/student-profile" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentProfile/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/student-drives" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ViewDrives/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/student-applications" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <MyApplications/>
            </ProtectedRoute>
          }
        />
        
        {/* This is the "catch-all" route for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
