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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <StudentDriveStatus />
        
    </>
  )
}

export default App
