import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import EditStudentProfile from "./pages/EditStudentProfile.jsx"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    {/* <EditStudentProfile/> */}
    </BrowserRouter>
    
  </StrictMode>,
)
