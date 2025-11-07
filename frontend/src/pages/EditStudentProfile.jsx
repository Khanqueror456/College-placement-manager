import React from 'react';
import { 
  LogOut, 
  User, 
  BookOpen, 
  CalendarDays, 
  Mail, 
  Code, 
  UploadCloud, 
  FileText,
  X
} from 'lucide-react';

// --- Placeholder Data (would be passed as props) ---
const MOCK_STUDENT_PROFILE = {
  profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cfdce567?q=80&w=2680&auto-format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  name: 'Jane Doe',
  usn: '1SJ18CS007',
  branch: 'Computer Science Engineering',
  year: '4th Year',
  semester: '8th Semester',
  email: 'jane.doe@example.com',
  skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'SQL', 'Data Structures'],
};

const EditStudentProfile = ({ onLogout, onCancel }) => {
  // State to manage form inputs
  const [formData, setFormData] = React.useState({
    ...MOCK_STUDENT_PROFILE,
    skills: MOCK_STUDENT_PROFILE.skills.join(', '), // Convert array to comma-separated string for editing
  });
  
  // State for file upload
  const [resumeFile, setResumeFile] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  // Custom file input logic
  const triggerFileInput = () => {
    document.getElementById('resumeUpload').click();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this formData and resumeFile
    // to your backend API for processing.
    console.log("Form Data Submitted:", {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()), // Convert back to array
    });
    console.log("Résumé File:", resumeFile);
    // After submission, you might want to navigate back
    onCancel(); // Using onCancel to return to the profile view
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200">
      
      {/* --- Header Bar --- */}
      <header className="
        w-full p-4 flex justify-between items-center
        bg-slate-700 bg-opacity-20 backdrop-filter backdrop-blur-lg
        border-b border-slate-500 border-opacity-30 z-10
      ">
        <h1 className="text-2xl font-bold text-slate-100">Edit Profile</h1>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600 border border-slate-500 hover:border-sky-400 text-slate-200 hover:text-sky-400 transition-all duration-300"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-grow p-8">
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto space-y-8">

          {/* --- Personal Details Section --- */}
          <section className="p-6 rounded-2xl bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg border border-slate-500 border-opacity-30 shadow-lg">
            <h3 className="flex items-center text-2xl font-bold text-slate-100 mb-6">
              <User className="w-5 h-5 mr-3 text-sky-400" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50 bg-slate-800 bg-opacity-30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300 text-slate-100"
                />
              </div>
              {/* USN (Read-only) */}
              <div>
                <label htmlFor="usn" className="block text-sm font-medium text-slate-300 mb-1">USN (Read-only)</label>
                <input
                  type="text"
                  name="usn"
                  id="usn"
                  value={formData.usn}
                  readOnly
                  className="w-full p-3 rounded-lg border border-slate-600 border-opacity-50 bg-slate-800 bg-opacity-70 text-slate-400 cursor-not-allowed"
                />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50 bg-slate-800 bg-opacity-30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300 text-slate-100"
                />
              </div>
              {/* Branch */}
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-slate-300 mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  id="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50 bg-slate-800 bg-opacity-30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300 text-slate-100"
                />
              </div>
              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  id="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50 bg-slate-800 bg-opacity-30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300 text-slate-100"
                />
              </div>
              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-slate-300 mb-1">Semester</label>
                <input
                  type="text"
                  name="semester"
                  id="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50 bg-slate-800 bg-opacity-30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300 text-slate-100"
                />
              </div>
            </div>
          </section>

          {/* --- Skills Section --- */}
          <section className="p-6 rounded-2xl bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg border border-slate-500 border-opacity-30 shadow-lg">
            <h3 className="flex items-center text-2xl font-bold text-slate-100 mb-6">
              <Code className="w-5 h-5 mr-3 text-emerald-400" />
              Skills
            </h3>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-1">Skills (comma-separated)</label>
              <textarea
                name="skills"
                id="skills"
                rows="3"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g. React, Node.js, Python"
                className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50 bg-slate-800 bg-opacity-30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition duration-300 text-slate-100"
              />
            </div>
          </section>

          {/* --- Résumé Upload Section --- */}
          <section className="p-6 rounded-2xl bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg border border-slate-500 border-opacity-30 shadow-lg">
            <h3 className="flex items-center text-2xl font-bold text-slate-100 mb-6">
              <UploadCloud className="w-5 h-5 mr-3 text-sky-400" />
              Upload Résumé
            </h3>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-500 rounded-lg cursor-pointer hover:border-sky-400 transition duration-300"
                 onClick={triggerFileInput}
            >
              <input
                type="file"
                id="resumeUpload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              {!resumeFile ? (
                <>
                  <UploadCloud className="w-12 h-12 text-slate-400" />
                  <p className="mt-2 text-slate-300">Click to browse or drag & drop</p>
                  <p className="text-xs text-slate-400">PDF, DOC, or DOCX (Max 5MB)</p>
                </>
              ) : (
                <div className="text-center">
                  <FileText className="w-12 h-12 text-emerald-400" />
                  <p className="mt-2 text-slate-100 font-semibold">{resumeFile.name}</p>
                  <p className="text-xs text-slate-400">{Math.round(resumeFile.size / 1024)} KB</p>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent re-opening file dialog
                      setResumeFile(null);
                    }}
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* --- Action Buttons --- */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-lg font-semibold bg-slate-600 hover:bg-slate-500 text-slate-100 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-all duration-300 shadow-lg hover:shadow-sky-500/50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditStudentProfile;