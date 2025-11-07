import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await studentService.getDashboard();
      setDashboard(response.dashboard);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Chart Data
  const applicationChartData = dashboard ? {
    labels: ['Active', 'Offers', 'Rejected'],
    datasets: [
      {
        data: [
          dashboard.activeApplications,
          dashboard.offers,
          dashboard.rejected
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: { size: 12 },
          padding: 15
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-200 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-sky-400">Student Dashboard</h1>
            <p className="text-sm text-slate-400">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
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
        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Total Applications</p>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-3xl font-bold">{dashboard?.totalApplications || 0}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Active Applications</p>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">{dashboard?.activeApplications || 0}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Offers Received</p>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{dashboard?.offers || 0}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Active Drives</p>
              <span className="text-2xl">🏢</span>
            </div>
            <p className="text-3xl font-bold text-sky-400">{dashboard?.activeDrives || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/student-drives"
              className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 rounded-xl hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="text-lg font-bold">Browse Drives</h3>
                  <p className="text-sm opacity-90">View and apply to placement drives</p>
                </div>
              </div>
            </Link>

            <Link
              to="/student-applications"
              className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 rounded-xl hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="text-lg font-bold">My Applications</h3>
                  <p className="text-sm opacity-90">Track your application status</p>
                </div>
              </div>
            </Link>

            <Link
              to="/student-profile"
              className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl hover:shadow-lg transition duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">👤</span>
                <div>
                  <h3 className="text-lg font-bold">Update Profile</h3>
                  <p className="text-sm opacity-90">Keep your profile up to date</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Status Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Application Status</h3>
            {applicationChartData && dashboard.totalApplications > 0 ? (
              <div style={{ height: '300px' }}>
                <Doughnut data={applicationChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No applications yet</p>
                  <Link
                    to="/student-drives"
                    className="text-sky-400 hover:text-sky-300 underline"
                  >
                    Start applying to drives
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            {dashboard?.recentActivity && dashboard.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-700 bg-opacity-50 rounded-lg"
                  >
                    <span className="text-2xl">
                      {activity.type === 'application' ? '📝' :
                       activity.type === 'status_update' ? '📊' : '🔔'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        {dashboard?.profileComplete && dashboard.profileComplete < 100 && (
          <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
                <p className="opacity-90">
                  Your profile is {dashboard.profileComplete}% complete. Complete it to improve your chances!
                </p>
              </div>
              <Link
                to="/student-profile"
                className="px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-opacity-90 transition duration-200"
              >
                Complete Now
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
