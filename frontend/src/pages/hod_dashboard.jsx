import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPendingApprovals, approveStudent, rejectStudent, getStudentResume } from '../services/hodService';
import { useAuth } from '../context/AuthContext';

// --- SVG Icons ---
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 mr-1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 mr-1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

// --- HOD Dashboard Component ---
const HodDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      setLoading(true);
      const response = await getPendingApprovals();
      // Format the data to match component expectations
      const formattedStudents = response.students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        phone: student.phone,
        resumePath: student.resumePath,
        resumeUploadedAt: student.resumeUploadedAt,
        status: 'pending'
      }));
      setStudents(formattedStudents);
      setError(null);
    } catch (err) {
      console.error('Error fetching pending students:', err);
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateStatus = async (studentId, newStatus) => {
    try {
      setActionLoading(studentId);
      
      if (newStatus === 'approved') {
        await approveStudent(studentId);
      } else if (newStatus === 'denied') {
        await rejectStudent(studentId, 'Registration rejected by HOD');
      }

      // Update local state
      setStudents(currentStudents =>
        currentStudents.filter(student => student.id !== studentId)
      );
      
      setActionLoading(null);
    } catch (err) {
      console.error('Error updating student status:', err);
      alert('Failed to update student status. Please try again.');
      setActionLoading(null);
    }
  };

  const pendingStudents = students.filter(s => s.status === 'pending');
  const otherStudents = students.filter(s => s.status !== 'pending');

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-900 text-slate-200">

      {/* --- Header Bar --- */}
      <header className="
        w-full p-4
        flex justify-between items-center
        bg-slate-700 bg-opacity-20 backdrop-filter backdrop-blur-lg
        border-b border-slate-500 border-opacity-30
      ">
        <h1 className="text-2xl font-bold text-slate-100">HOD Dashboard</h1>
        <div className="buttons flex justify-center items-center gap-4">

          <Link to="/hod-stats">
            <button
              className="
            flex items-center px-4 py-2 rounded-lg font-semibold
            bg-slate-700 hover:bg-slate-600
            border border-slate-500 hover:border-sky-400
            text-slate-200 hover:text-sky-400
            transition-all duration-300
          "
            >
              <LogoutIcon />
              Stats
            </button>
          </Link>

          <Link to="/hod-report">
            <button
              className="
            flex items-center px-4 py-2 rounded-lg font-semibold
            bg-slate-700 hover:bg-slate-600
            border border-slate-500 hover:border-sky-400
            text-slate-200 hover:text-sky-400
            transition-all duration-300
          "
            >
              <LogoutIcon />
              Reports
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="
            flex items-center px-4 py-2 rounded-lg font-semibold
            bg-slate-700 hover:bg-slate-600
            border border-slate-500 hover:border-sky-400
            text-slate-200 hover:text-sky-400
            transition-all duration-300
          "
          >
            <LogoutIcon />
            Logout
          </button>


        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading pending approvals...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* --- Pending Approvals Section --- */}
              <section className="mb-12">
                <h2 className="text-3xl font-extrabold text-slate-100 mb-6">
                  Pending Approvals
                  <span className="
                    ml-3 px-3 py-1 rounded-full text-base font-bold
                    bg-sky-500 text-white
                  ">
                    {pendingStudents.length}
                  </span>
                </h2>

                {pendingStudents.length === 0 ? (
                  <p className="text-slate-400">No pending student signups.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingStudents.map(student => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onApprove={() => handleUpdateStatus(student.id, 'approved')}
                        onDeny={() => handleUpdateStatus(student.id, 'denied')}
                        isLoading={actionLoading === student.id}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* --- Processed Students Section --- */}
              {otherStudents.length > 0 && (
                <section>
                  <h2 className="text-3xl font-extrabold text-slate-100 mb-6">
                    Processed Students
                  </h2>
                  <div className="
                    rounded-xl border border-slate-500 border-opacity-30
                    bg-slate-700 bg-opacity-20 backdrop-filter backdrop-blur-lg
                  ">
                    <ul className="divide-y divide-slate-500 divide-opacity-30">
                      {otherStudents.map(student => (
                        <li key={student.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-slate-100">{student.name}</p>
                            <p className="text-sm text-slate-400">{student.email}</p>
                          </div>
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-bold
                            ${student.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                          `}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

// --- Student Card for Approval ---
const StudentCard = ({ student, onApprove, onDeny, isLoading }) => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  const handleViewResume = async () => {
    if (!student.resumePath) {
      alert('No resume uploaded');
      return;
    }

    try {
      setLoadingResume(true);
      const response = await getStudentResume(student.id);
      const fullUrl = `http://localhost:3000${response.resume.url}`;
      window.open(fullUrl, '_blank');
    } catch (error) {
      console.error('Error viewing resume:', error);
      alert('Failed to load resume');
    } finally {
      setLoadingResume(false);
    }
  };

  return (
    <div className="
      p-6 rounded-2xl
      bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg
      border border-slate-500 border-opacity-30 shadow-lg
      flex flex-col
    ">
      <div className="flex-grow mb-6">
        <h3 className="text-xl font-bold text-slate-100 mb-1">{student.name}</h3>
        <p className="text-sm text-sky-300">{student.email}</p>
        {student.rollNumber && (
          <p className="text-xs text-slate-400 mt-1">Roll: {student.rollNumber}</p>
        )}
        {student.department && (
          <p className="text-xs text-slate-400">Dept: {student.department}</p>
        )}
        {student.resumePath && (
          <button
            onClick={handleViewResume}
            disabled={loadingResume}
            className="
              mt-3 flex items-center text-xs text-sky-400 hover:text-sky-300
              transition-colors duration-200
            "
          >
            <FileTextIcon />
            {loadingResume ? 'Loading...' : 'View Resume'}
          </button>
        )}
        {!student.resumePath && (
          <p className="text-xs text-slate-500 mt-2 italic">No resume uploaded</p>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onApprove}
          disabled={isLoading}
          className="
            flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-semibold
            bg-emerald-500 text-slate-900
            hover:bg-emerald-400 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <CheckIcon />
          {isLoading ? 'Processing...' : 'Approve'}
        </button>
        <button
          onClick={onDeny}
          disabled={isLoading}
          className="
            flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-semibold
            bg-slate-600 text-slate-200
            hover:bg-red-500 hover:text-white transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <XIcon />
          {isLoading ? 'Processing...' : 'Deny'}
        </button>
      </div>
    </div>
  );
};

export default HodDashboard;