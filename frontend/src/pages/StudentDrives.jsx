import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';

// Mock data for drives
const MOCK_DRIVES = [
  {
    id: 'd1',
    company: 'Tech Solutions Inc.',
    logo: 'https://placehold.co/100x100/1e293b/94a3b8?text=TS',
    role: 'Software Engineer Intern',
    type: 'Internship',
    description:
      'Work on cutting-edge projects, contributing to both front-end and back-end services.',
    enrolled: true,
  },
  {
    id: 'd2',
    company: 'Data-Analytics Co.',
    logo: 'https://placehold.co/100x100/1e293b/94a3b8?text=DA',
    role: 'Data Analyst Trainee',
    type: 'Full-time',
    description:
      'Analyze large datasets to provide actionable insights for our Fortune 500 clients.',
    enrolled: false,
  },
  {
    id: 'd3',
    company: 'CloudFirst Ltd.',
    logo: 'https://placehold.co/100x100/1e293b/94a3b8?text=CF',
    role: 'Cloud Support Engineer',
    type: 'Full-time',
    description:
      'Join our team to manage and scale our multi-cloud infrastructure using AWS and Azure.',
    enrolled: false,
  },
];

// Drive Card Component
const DriveCard = ({ drive, onEnroll }) => {
  return (
    <div
      className="
        p-6 rounded-2xl
        bg-[#1e293b]/90 backdrop-blur-lg shadow-lg
        border border-[#475569]/50
        flex flex-col transition-all duration-300
        hover:shadow-xl hover:border-[#64748b]
      "
    >
      <div className="flex items-start gap-4 mb-4">
        <img
          src={drive.logo}
          alt={`${drive.company} logo`}
          className="w-16 h-16 rounded-lg object-cover border-2 border-[#475569]"
        />
        <div>
          <h3 className="text-xl font-bold text-[#e2e8f0]">
            {drive.company}
          </h3>
          <p className="text-[#38bdf8] text-sm">{drive.role}</p>
        </div>
      </div>

      <p className="text-[#94a3b8] text-sm mb-6 flex-grow">
        {drive.description}
      </p>

      <div className="flex items-center justify-between">
        <span
          className="
            px-3 py-1 rounded-full text-xs font-semibold
            bg-[#10b981]/20 text-[#10b981]
            border border-[#10b981]/50
          "
        >
          {drive.type}
        </span>

        <button
          onClick={() => onEnroll(drive.id)}
          disabled={drive.enrolled}
          className={`
            flex items-center justify-center px-4 py-2 rounded-lg font-semibold
            transition-all duration-300
            ${
              drive.enrolled
                ? 'bg-[#475569]/70 text-[#94a3b8] cursor-not-allowed'
                : 'bg-[#10b981] text-[#0f172a] hover:bg-[#34d399]'
            }
          `}
        >
          {drive.enrolled ? (
            <>
              <Check className="w-5 h-5 mr-1.5" strokeWidth={3} />
              Enrolled
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-1.5" strokeWidth={3} />
              Enroll
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main Drives Component
const StudentDrives = () => {
  const [drives, setDrives] = useState(MOCK_DRIVES);

  const handleEnroll = (driveId) => {
    setDrives((currentDrives) =>
      currentDrives.map((drive) =>
        drive.id === driveId ? { ...drive, enrolled: true } : drive
      )
    );
  };

  return (
    <div className="p-8 w-full bg-[#0f172a] min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#e2e8f0] mb-6">
        Active Placement Drives
      </h1>

      {drives.length === 0 ? (
        <p className="text-[#94a3b8]">
          No active drives available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => (
            <DriveCard key={drive.id} drive={drive} onEnroll={handleEnroll} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDrives;
