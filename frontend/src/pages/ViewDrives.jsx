import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';

const ViewDrivesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applyingTo, setApplyingTo] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await studentService.getActiveDrives();
      setDrives(response.drives || []);
    } catch (err) {
      setError(err.message || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (drive) => {
    setSelectedDrive(drive);
    setShowApplyModal(true);
    setCoverLetter('');
  };

  const handleApply = async () => {
    if (!selectedDrive) return;

    try {
      setError('');
      setSuccess('');
      setApplyingTo(selectedDrive.id);

      await studentService.applyToDrive(selectedDrive.id, coverLetter);
      setSuccess(`Successfully applied to ${selectedDrive.companyName || selectedDrive.company_name}!`);
      setShowApplyModal(false);
      setCoverLetter('');
      setSelectedDrive(null);
      
      // Refresh drives list
      await fetchDrives();
    } catch (err) {
      setError(err.message || 'Failed to apply to drive');
    } finally {
      setApplyingTo(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-200 text-xl">Loading drives...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-400">Placement Drives</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/student-dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/student-profile"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-200"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-300">
            {success}
          </div>
        )}

        {/* Drives Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {drives.length} Active {drives.length === 1 ? 'Drive' : 'Drives'} Available
          </h2>
        </div>

        {/* Drives Grid */}
        {drives.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-400">No active placement drives at the moment</p>
            <p className="text-slate-500 mt-2">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-500 transition duration-300"
              >
                {/* Company Logo/Icon */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center text-2xl font-bold">
                    {(drive.companyName || drive.company_name || 'C')[0]}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold">{drive.companyName || drive.company_name}</h3>
                    <p className="text-sm text-slate-400">{drive.jobRole || drive.job_role}</p>
                  </div>
                </div>

                {/* Package */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-emerald-500 bg-opacity-20 border border-emerald-500 rounded-full text-emerald-400 font-semibold">
                    {drive.package}
                  </span>
                </div>

                {/* Eligibility Criteria */}
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min CGPA:</span>
                    <span className="font-semibold">{drive.minCGPA || drive.min_cgpa || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Backlogs:</span>
                    <span className="font-semibold">{drive.maxBacklogs || drive.max_backlogs || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Departments:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(drive.allowedDepartments || drive.allowed_departments || []).map((dept, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-slate-700 rounded"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                  <p className="text-xs text-slate-400">Application Deadline</p>
                  <p className="font-semibold">{formatDate(drive.applicationDeadline || drive.application_deadline)}</p>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApplyClick(drive)}
                  disabled={applyingTo === drive.id}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyingTo === drive.id ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Apply Modal */}
      {showApplyModal && selectedDrive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-lg w-full border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Apply to {selectedDrive.companyName}</h2>
            
            <div className="mb-4">
              <p className="text-slate-400 mb-2">{selectedDrive.jobRole}</p>
              <p className="text-emerald-400 font-semibold">{selectedDrive.package}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="6"
                placeholder="Tell us why you're interested in this position..."
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-400 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApply}
                disabled={applyingTo}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
              >
                {applyingTo ? 'Applying...' : 'Submit Application'}
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setSelectedDrive(null);
                  setCoverLetter('');
                }}
                disabled={applyingTo}
                className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDrivesPage;
