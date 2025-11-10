import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';

const MyApplicationsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await studentService.getMyApplications();
      setApplications(response.applications || []);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    try {
      setError('');
      setSuccess('');
      await studentService.withdrawApplication(applicationId);
      setSuccess('Application withdrawn successfully');
      await fetchApplications();
    } catch (err) {
      setError(err.message || 'Failed to withdraw application');
    }
  };

  const handleDownloadOffer = async (applicationId) => {
    try {
      const response = await studentService.downloadOfferLetter(applicationId);
      window.open(response.offerLetterUrl, '_blank');
    } catch (err) {
      setError(err.message || 'Failed to download offer letter');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      'applied': 'bg-blue-500',
      'shortlisted': 'bg-yellow-500',
      'selected': 'bg-green-500',
      'rejected': 'bg-red-500',
      'withdrawn': 'bg-gray-500'
    };
    return colors[status.toLowerCase()] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'applied': '📝',
      'shortlisted': '⭐',
      'selected': '✅',
      'rejected': '❌',
      'withdrawn': '🚫'
    };
    return icons[status.toLowerCase()] || '📋';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-200 text-xl">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-400">My Applications</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/student-dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/student-drives"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-200"
            >
              View Drives
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-400">Total</p>
            <p className="text-2xl font-bold">{applications.length}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-400">Applied</p>
            <p className="text-2xl font-bold text-blue-400">
              {applications.filter(app => app.status === 'applied').length}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-400">Shortlisted</p>
            <p className="text-2xl font-bold text-yellow-400">
              {applications.filter(app => app.status === 'shortlisted').length}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-400">Selected</p>
            <p className="text-2xl font-bold text-green-400">
              {applications.filter(app => app.status === 'selected').length}
            </p>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-xl text-slate-400 mb-4">No applications yet</p>
            <Link
              to="/student-drives"
              className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg font-semibold transition duration-200"
            >
              Browse Placement Drives
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left: Company & Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center text-2xl font-bold">
                        {application.drive.companyName[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{application.drive.companyName}</h3>
                        <p className="text-slate-400">{application.drive.jobRole}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm mt-3">
                      <div>
                        <span className="text-slate-400">Package: </span>
                        <span className="font-semibold text-emerald-400">{application.drive.package}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Applied: </span>
                        <span className="font-semibold">{formatDate(application.appliedAt)}</span>
                      </div>
                      {application.currentRound && (
                        <div>
                          <span className="text-slate-400">Current Round: </span>
                          <span className="font-semibold text-sky-400">{application.currentRound}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(application.status)} bg-opacity-20 border border-current`}>
                      <span className="text-2xl">{getStatusIcon(application.status)}</span>
                      <span className="font-semibold capitalize">{application.status}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {application.status === 'selected' && (
                        <button
                          onClick={() => handleDownloadOffer(application.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-semibold transition duration-200"
                        >
                          Download Offer
                        </button>
                      )}
                      
                      {(application.status === 'applied' || application.status === 'shortlisted') && (
                        <button
                          onClick={() => handleWithdraw(application.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition duration-200"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recruitment Rounds Progress (if available) */}
                {application.rounds && application.rounds.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3">Recruitment Progress</h4>
                    <div className="flex items-center gap-2">
                      {application.rounds.map((round, index) => (
                        <React.Fragment key={index}>
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              round.status === 'completed' ? 'bg-green-500' :
                              round.status === 'current' ? 'bg-yellow-500' :
                              'bg-slate-600'
                            }`}>
                              {round.status === 'completed' ? '✓' : index + 1}
                            </div>
                            <p className="text-xs mt-1 text-center">{round.name}</p>
                          </div>
                          {index < application.rounds.length - 1 && (
                            <div className={`flex-1 h-1 ${
                              round.status === 'completed' ? 'bg-green-500' : 'bg-slate-600'
                            }`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplicationsPage;
