import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login';
import StudentProfile from './pages/student_profile';
import EditStudentProfile from './pages/EditStudentProfile';
import StudentDrives from './pages/StudentDrives';
import StudentDriveStatus from './pages/StudentDriveStatus';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/homepage';
import AboutPage from './pages/About';
import ContactPage from './components/Contact';
import NotFound from './pages/NotFound';
import HodDashboard from './pages/hod_dashboard';
import HodStatistics from './components/hod_stats';
import HodPlacementReport from "./components/hod_reports"
import StudentOverview from "./components/student_dashboard"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/hod-dashboard" element={<HodDashboard/>}/>
        <Route path="/hod-stats" element={<HodStatistics/>}/>
        <Route path="/hod-report" element={<HodPlacementReport/>}/>
        <Route path="/student-profile" element={<StudentProfile/>}/>
        <Route path="/student-dashboard" element={<StudentOverview/>}/>
        
        
       {/* This is the "catch-all" route for 404s */}
       <Route path="*" element={<NotFound />} />
      </Routes>
        
    </>
  )
}

export default App
