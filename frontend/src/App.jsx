import './App.css'
import Login from './pages/login';
import StudentProfile from './pages/student_profile';
import StudentDrives from './pages/StudentDrives';
import StudentDriveStatus from './pages/StudentDriveStatus';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import AboutPage from './pages/About';
import ContactPage from './components/Contact';
import NotFound from './pages/NotFound';
import HodDashboard from './pages/hod_dashboard';
import HodStatistics from './components/hod_stats';
import HodPlacementReport from "./components/hod_reports"
import StudentOverview from "./components/student_dashboard"
import TpoDashboard from './pages/tpo_dashboard.jsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import StudentDashboard from "./pages/StudentDashboard.jsx"
import ViewDrives from "./pages/ViewDrives.jsx"
import MyApplications from "./pages/MyApplications.jsx"

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/login" element={<Login/>}/>
        
        {/* TPO Protected Routes */}
        <Route 
          path="/tpo-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['TPO']}>
              <TpoDashboard/>
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
              <HodStatistics/>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/hod-report" 
          element={
            <ProtectedRoute allowedRoles={['HOD']}>
              <HodPlacementReport/>
            </ProtectedRoute>
          }
        />

        {/* Student Protected Routes - NEW INTEGRATED PAGES */}
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
        
        {/* Old Student Routes (keeping for backward compatibility) */}
        <Route path="/student/dashboard" element={<StudentOverview/>}/>
        <Route path="/student/profile" element={<StudentProfile/>}/>
        <Route path="/student/drives" element={<StudentDrives/>}/>
        <Route path="/student/status" element={<StudentDriveStatus/>}/>
        
        {/* This is the "catch-all" route for 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
