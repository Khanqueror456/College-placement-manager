import React, { useState, useEffect } from 'react';
import { Plus, Check, Calendar, MapPin, DollarSign, Building, Loader } from 'lucide-react';
import studentService from '../services/studentService';

// Drive Card Component
const DriveCard = ({ drive, onApply, isApplying }) => {
  const hasApplied = drive.hasApplied || false;
  
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
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
          <Building className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#e2e8f0]">
            {drive.companyName || drive.company_name}
          </h3>
          <p className="text-[#38bdf8] text-sm">{drive.jobRole || drive.job_role}</p>
        </div>
      </div>

      <p className="text-[#94a3b8] text-sm mb-4 flex-grow line-clamp-3">
        {drive.jobDescription || drive.job_description || 'No description available'}
      </p>

      <div className="space-y-2 mb-4 text-sm">
        {drive.package && (
          <div className="flex items-center text-[#94a3b8]">
            <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
            <span>{drive.package}</span>
          </div>
        )}
        {drive.location && (
          <div className="flex items-center text-[#94a3b8]">
            <MapPin className="w-4 h-4 mr-2 text-sky-400" />
            <span>{drive.location}</span>
          </div>
        )}
        {drive.driveDate && (
          <div className="flex items-center text-[#94a3b8]">
            <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
            <span>{new Date(drive.driveDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className="
            px-3 py-1 rounded-full text-xs font-semibold
            bg-[#10b981]/20 text-[#10b981]
            border border-[#10b981]/50
          "
        >
          {drive.jobType || drive.job_type || 'Full-time'}
        </span>

        <button
          onClick={() => onApply(drive.id)}
          disabled={hasApplied || isApplying}
          className={`
            flex items-center justify-center px-4 py-2 rounded-lg font-semibold
            transition-all duration-300
            ${
              hasApplied
                ? 'bg-[#475569]/70 text-[#94a3b8] cursor-not-allowed'
                : isApplying
                ? 'bg-[#475569] text-[#94a3b8] cursor-wait'
                : 'bg-[#10b981] text-[#0f172a] hover:bg-[#34d399]'
            }
          `}
        >
          {isApplying ? (
            <>
              <Loader className="w-5 h-5 mr-1.5 animate-spin" />
              Applying...
            </>
          ) : hasApplied ? (
            <>
              <Check className="w-5 h-5 mr-1.5" strokeWidth={3} />
              Applied
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-1.5" strokeWidth={3} />
              Apply Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main Drives Component
const StudentDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchActiveDrives();
  }, []);

  const fetchActiveDrives = async () => {
    try {
      setLoading(true);
      const response = await studentService.getActiveDrives();
      setDrives(response.drives || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load drives');
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      setApplyingId(driveId);
      setError('');
      setSuccessMessage('');
      
      await studentService.applyToDrive(driveId);
      
      // Update the drive to show it's been applied to
      setDrives((currentDrives) =>
        currentDrives.map((drive) =>
          drive.id === driveId ? { ...drive, hasApplied: true } : drive
        )
      );
      
      setSuccessMessage('Application submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply to drive');
      setTimeout(() => setError(''), 5000);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="p-8 w-full bg-[#0f172a] min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#e2e8f0] mb-6">
        Active Placement Drives
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-200">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="ml-3 text-[#94a3b8]">Loading drives...</span>
        </div>
      ) : drives.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-[#475569] mx-auto mb-4" />
          <p className="text-[#94a3b8] text-lg">
            No active drives available at the moment.
          </p>
          <p className="text-[#64748b] text-sm mt-2">
            Check back later for new opportunities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => (
            <DriveCard 
              key={drive.id} 
              drive={drive} 
              onApply={handleApply}
              isApplying={applyingId === drive.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDrives;
