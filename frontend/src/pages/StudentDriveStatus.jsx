import React, { useState } from 'react';
import {
  LogOut,
  CheckCircle2, // For 'Cleared'
  XCircle,       // For 'Failed'
  Clock,         // For 'Pending'
  Loader2,       // For 'Ongoing' (spinner)
} from 'lucide-react';

// --- Placeholder Data ---
const MOCK_ENROLLED_DRIVES = [
  {
    id: 'd1',
    company: 'Tech Solutions Inc.',
    logo: 'https://placehold.co/100x100/1e293b/94a3b8?text=TS',
    role: 'Software Engineer Intern',
    overallStatus: 'Selected', // 'Selected', 'Rejected', 'Pending'
    rounds: [
      { id: 'r1a', name: 'Online Assessment', status: 'Cleared' }, // 'Cleared', 'Failed', 'Pending', 'Ongoing'
      { id: 'r1b', name: 'Technical Interview', status: 'Cleared' },
      { id: 'r1c', name: 'HR Round', status: 'Cleared' },
    ],
  },
  {
    id: 'd2',
    company: 'Data-Analytics Co.',
    logo: 'https://placehold.co/100x100/1e293b/94a3b8?text=DA',
    role: 'Data Analyst Trainee',
    overallStatus: 'Pending',
    rounds: [
      { id: 'r2a', name: 'Aptitude Test', status: 'Cleared' },
      { id: 'r2b', name: 'Group Discussion', status: 'Ongoing' },
      { id: 'r2c', name: 'Personal Interview', status: 'Pending' },
    ],
  },
  {
    id: 'd3',
    company: 'CloudFirst Ltd.',
    logo: 'https://placehold.co/100x100/1e293b/94a3b8?text=CF',
    role: 'Cloud Support Engineer',
    overallStatus: 'Rejected',
    rounds: [
      { id: 'r3a', name: 'Online Quiz', status: 'Cleared' },
      { id: 'r3b', name: 'Technical Round 1', status: 'Failed' },
      { id: 'r3c', name: 'HR Round', status: 'Pending' },
    ],
  },
];

// --- Helper Functions for Styling ---

// Returns icon, color and optional animation for a specific round status
const getRoundStatusInfo = (status) => {
  switch (status) {
    case 'Cleared':
      return { Icon: CheckCircle2, color: 'text-emerald-400', animation: '' }; // Secondary
    case 'Failed':
      return { Icon: XCircle, color: 'text-red-400', animation: '' };
    case 'Ongoing':
      return { Icon: Loader2, color: 'text-sky-400', animation: 'animate-spin' }; // Accent + spinning
    case 'Pending':
    default:
      return { Icon: Clock, color: 'text-yellow-400', animation: '' };
  }
};

// Returns badge classes for the overall status
const getOverallStatusClasses = (status) => {
  switch (status) {
    case 'Selected':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'; // Secondary
    case 'Rejected':
      return 'bg-red-500/20 text-red-300 border-red-400/50';
    case 'Pending':
    default:
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50';
  }
};

// --- Drive Status Card Component ---
const DriveStatusCard = ({ drive }) => {
  const overallStatusClasses = getOverallStatusClasses(drive.overallStatus);

  return (
    <div
      className="
      p-6 rounded-2xl
      bg-slate-800 bg-opacity-25 backdrop-filter backdrop-blur-lg
      border border-slate-500 border-opacity-30
      shadow-lg
    "
    >
      {/* Card Header: Company Info */}
      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-500 border-opacity-30">
        <img
          src={drive.logo}
          alt={`${drive.company} logo`}
          className="w-16 h-16 rounded-lg object-cover border-2 border-slate-500"
        />
        <div>
          <h3 className="text-xl font-bold text-slate-100">{drive.company}</h3>
          <p className="text-sky-300 text-sm">{drive.role}</p>
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-6">
        <span className="text-sm font-medium text-slate-300">Overall Status:</span>
        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold border ${overallStatusClasses}`}>
          {drive.overallStatus}
        </span>
      </div>

      {/* Round-wise Status */}
      <div>
        <h4 className="text-lg font-semibold text-slate-100 mb-4">Round-wise Status</h4>
        <div className="space-y-4">
          {drive.rounds.map((round) => {
            const { Icon, color, animation } = getRoundStatusInfo(round.status);
            return (
              <div key={round.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center">
                  {/* Apply animation class if provided */}
                  <Icon className={`w-5 h-5 mr-3 ${color} ${animation ? animation : ''}`} />
                  <span className="text-slate-100 font-medium">{round.name}</span>
                </div>
                <span className={`text-sm font-semibold ${color}`}>{round.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const StudentDriveStatus = ({ onLogout }) => {
  const [drives] = useState(MOCK_ENROLLED_DRIVES);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200">
      {/* --- Header Bar --- */}
      <header
        className="
        w-full p-4 flex justify-between items-center
        bg-slate-800 bg-opacity-20 backdrop-filter backdrop-blur-lg
        border-b border-slate-500 border-opacity-30
        z-10
      "
      >
        <h1 className="text-2xl font-bold text-slate-100">My Drive Status</h1>
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
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          {drives.length === 0 ? (
            <p className="text-center text-slate-400">You are not yet enrolled in any drives.</p>
          ) : (
            <div className="space-y-8">
              {drives.map((drive) => (
                <DriveStatusCard key={drive.id} drive={drive} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDriveStatus;
