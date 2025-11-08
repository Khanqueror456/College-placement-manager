import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Building, 
  FileText, 
  Bell, 
  LogOut,
  Plus,
  Eye,
  Settings
} from 'lucide-react';
import api from '../services/api';

const TpoDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/tpo/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 bg-opacity-50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-8 h-8 text-sky-400" />
              <h1 className="text-2xl font-bold text-white">TPO Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Drives"
            value={dashboardData?.totalDrives || 0}
            icon={Briefcase}
            color="sky"
          />
          <StatCard
            title="Active Drives"
            value={dashboardData?.activeDrives || 0}
            icon={Eye}
            color="emerald"
          />
          <StatCard
            title="Total Students"
            value={dashboardData?.totalStudents || 0}
            icon={Users}
            color="yellow"
          />
          <StatCard
            title="Placed Students"
            value={dashboardData?.placedStudents || 0}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Manage Companies"
              description="Add, view, and manage company profiles"
              icon={Building}
              onClick={() => navigate('/tpo/companies')}
            />
            <ActionCard
              title="Manage Drives"
              description="Create and manage placement drives"
              icon={Briefcase}
              onClick={() => navigate('/tpo/drives')}
            />
            <ActionCard
              title="View Applications"
              description="Review student applications and update status"
              icon={FileText}
              onClick={() => navigate('/tpo/applications')}
            />
            <ActionCard
              title="Send Notifications"
              description="Send bulk notifications to students"
              icon={Bell}
              onClick={() => navigate('/tpo/notifications')}
            />
            <ActionCard
              title="Reports"
              description="Generate placement reports"
              icon={FileText}
              onClick={() => navigate('/tpo/reports')}
            />
            <ActionCard
              title="Student Management"
              description="View and approve student profiles"
              icon={Users}
              onClick={() => navigate('/tpo/students')}
            />
          </div>
        </div>

        {/* Recent Drives */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Drives</h2>
            <button
              onClick={() => navigate('/tpo/drives')}
              className="text-sky-400 hover:text-sky-300 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          {dashboardData?.recentDrives && dashboardData.recentDrives.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="flex justify-between items-center p-4 bg-slate-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all cursor-pointer"
                  onClick={() => navigate(`/tpo/drives/${drive.id}`)}
                >
                  <div>
                    <h3 className="text-white font-semibold">{drive.companyName}</h3>
                    <p className="text-slate-400 text-sm">{drive.jobRole}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      drive.status === 'ACTIVE' 
                        ? 'bg-emerald-500 bg-opacity-20 text-emerald-300'
                        : 'bg-slate-500 bg-opacity-20 text-slate-300'
                    }`}>
                      {drive.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No recent drives</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    sky: 'from-sky-500 to-blue-500',
    emerald: 'from-emerald-500 to-green-500',
    yellow: 'from-yellow-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500'
  };

  return (
    <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Action Card Component
const ActionCard = ({ title, description, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-sky-500 hover:bg-opacity-70 transition-all text-left group"
    >
      <Icon className="w-8 h-8 text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </button>
  );
};

export default TpoDashboard;
