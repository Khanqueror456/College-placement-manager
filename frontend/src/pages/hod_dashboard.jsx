import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

// --- Mock Data for Pending Students ---
const MOCK_STUDENTS = [
  { id: '101', name: 'Alice Smith', email: 'alice.smith@example.com', status: 'pending' },
  { id: '102', name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'pending' },
  { id: '103', name: 'Charlie Brown', email: 'charlie.brown@example.com', status: 'approved' },
  { id: '104', name: 'David Lee', email: 'david.lee@example.com', status: 'pending' },
  { id: '105', name: 'Eve Davis', email: 'eve.davis@example.com', status: 'denied' },
];

// --- HOD Dashboard Component ---
const HodDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const handleUpdateStatus = (studentId, newStatus) => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
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
              onClick={onLogout}
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

          <button
            onClick={onLogout}
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
                  />
                ))}
              </div>
            )}
          </section>

          {/* --- Processed Students Section --- */}
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

        </div>
      </main>
    </div>
  );
};

// --- Student Card for Approval ---
const StudentCard = ({ student, onApprove, onDeny }) => {
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
      </div>
      <div className="flex gap-4">
        <button
          onClick={onApprove}
          className="
            flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-semibold
            bg-emerald-500 text-slate-900
            hover:bg-emerald-400 transition-all duration-300
          "
        >
          <CheckIcon />
          Approve
        </button>
        <button
          onClick={onDeny}
          className="
            flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-semibold
            bg-slate-600 text-slate-200
            hover:bg-red-500 hover:text-white transition-all duration-300
          "
        >
          <XIcon />
          Deny
        </button>
      </div>
    </div>
  );
};

export default HodDashboard;