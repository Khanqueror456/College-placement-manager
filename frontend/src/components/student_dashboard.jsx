import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Send,
  Loader2,
  Award,
  Briefcase,
  Edit,
  Send as SendIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- Mock Data ---
const MOCK_DATA = {
  success: true,
  dashboard: {
    totalApplications: 5,
    activeApplications: 3,
    offers: 1,
    rejected: 1,
    activeDrives: 8,
    profileComplete: 85,
    recentActivity: [
      {
        type: "application",
        message: "Applied to Google - Software Engineer",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        type: "status",
        message: "Tech Solutions Inc. moved to Technical Round",
        date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ],
  },
};

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, colorClass }) => {
  const Icon = icon;
  const colorMap = {
    emerald: { main: '#10b981', light: '#34d399' },
    sky: { main: '#38bdf8', light: '#7dd3fc' },
    yellow: { main: '#facc15', light: '#fde047' },
  };
  const colors = colorMap[colorClass] || colorMap.sky;

  return (
    <div
      className="p-6 rounded-2xl relative overflow-hidden shadow-lg border"
      style={{
        backgroundColor: '#1e293b', // Surface
        borderColor: '#475569', // Borders
      }}
    >
      <div
        style={{ backgroundColor: colors.main }}
        className="absolute top-0 left-0 h-1.5 w-full"
      ></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>
            {title}
          </p>
          <p
            className="text-3xl font-extrabold mt-1"
            style={{ color: '#e2e8f0' }}
          >
            {value}
          </p>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${colors.main}33` }}
        >
          <Icon className="w-6 h-6" style={{ color: colors.light }} />
        </div>
      </div>
    </div>
  );
};

// --- Activity Icon ---
const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'application':
      return <SendIcon className="w-5 h-5" style={{ color: '#38bdf8' }} />;
    case 'status':
      return <Award className="w-5 h-5" style={{ color: '#10b981' }} />;
    default:
      return <SendIcon className="w-5 h-5" style={{ color: '#94a3b8' }} />;
  }
};

// --- Main Dashboard ---
const StudentOverview = ({ onGoToProfile }) => {
  const dash = MOCK_DATA.dashboard;

  const createDoughnutOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: { size: 12 },
          boxWidth: 20,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: title,
        color: '#e2e8f0',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 10,
      },
    },
    cutout: '70%',
  });

  // Profile Completion Chart
  const profileData = {
    labels: ['Complete', 'Remaining'],
    datasets: [
      {
        label: 'Profile',
        data: [dash.profileComplete, 100 - dash.profileComplete],
        backgroundColor: ['#10b981', '#475569'],
        borderColor: '#0f172a',
        borderWidth: 4,
      },
    ],
  };

  const profileOptions = {
    ...createDoughnutOptions('Profile Completion'),
    plugins: {
      ...createDoughnutOptions('Profile Completion').plugins,
      legend: { display: false },
    },
  };

  // Application Status Chart
  const appStatusData = {
    labels: ['Active', 'Offers', 'Rejected'],
    datasets: [
      {
        label: 'Applications',
        data: [dash.activeApplications, dash.offers, dash.rejected],
        backgroundColor: ['#38bdf8', '#10b981', '#f43f5e'],
        borderColor: '#0f172a',
        borderWidth: 4,
      },
    ],
  };

  const appStatusOptions = createDoughnutOptions('Application Status');

  return (
    <div
      className="p-8 w-full min-h-screen"
      style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}
    >
      <h1
        className="text-3xl font-extrabold mb-8"
        style={{ color: '#e2e8f0' }}
      >
        Student Dashboard
      </h1>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={dash.totalApplications}
          icon={Send}
          colorClass="sky"
        />
        <StatCard
          title="Active Applications"
          value={dash.activeApplications}
          icon={Loader2}
          colorClass="yellow"
        />
        <StatCard
          title="Offers Received"
          value={dash.offers}
          icon={Award}
          colorClass="emerald"
        />
        <StatCard
          title="Active Drives"
          value={dash.activeDrives}
          icon={Briefcase}
          colorClass="sky"
        />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Profile Completion */}
        <div
          className="lg:col-span-1 p-6 rounded-2xl shadow-lg border flex flex-col justify-between"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-64 w-full relative">
            <Doughnut data={profileData} options={profileOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-4xl font-extrabold"
                style={{ color: '#e2e8f0' }}
              >
                {dash.profileComplete}%
              </span>
            </div>
          </div>
          <button
            onClick={onGoToProfile}
            className="flex items-center justify-center w-full mt-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.5)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Complete Profile
          </button>
        </div>

        {/* Application Status */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-80 w-full">
            <Doughnut data={appStatusData} options={appStatusOptions} />
          </div>
        </div>
      </div>

      {/* --- Recent Activity --- */}
      <div
        className="p-6 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: '#1e293b',
          borderColor: '#475569',
        }}
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: '#e2e8f0' }}
        >
          Recent Activity
        </h3>
        <div className="space-y-4">
          {dash.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderLeftColor: '#475569',
              }}
            >
              <div className="flex items-center">
                <div
                  className="p-2 rounded-full mr-4"
                  style={{ backgroundColor: '#1e293b' }}
                >
                  <ActivityIcon type={activity.type} />
                </div>
                <p
                  className="font-medium"
                  style={{ color: '#e2e8f0' }}
                >
                  {activity.message}
                </p>
              </div>
              <p
                className="text-sm"
                style={{ color: '#94a3b8' }}
              >
                {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
