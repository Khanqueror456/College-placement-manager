import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login';
import HodDashboard from './pages/hod_dashboard';
import StudentProfile from './pages/student_profile';
import EditStudentProfile from './pages/EditStudentProfile';
import StudentDrives from './pages/StudentDrives';
import StudentDriveStatus from './pages/StudentDriveStatus';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/homepage';
import AboutPage from './pages/About';
import ContactPage from './components/Contact';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/hod-dashboard" element={<HodDashboard/>}/>
        <Route path="/student-profile" element={<StudentProfile/>}/>
        
       {/* This is the "catch-all" route for 404s */}
       {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
        
    </>
  )
}

export default App
