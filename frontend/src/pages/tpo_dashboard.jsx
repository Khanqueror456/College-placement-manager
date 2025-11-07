import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Briefcase,
  Users,
  CheckSquare,
  Target,
  Clock,
  Send,
  Building,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MOCK_DATA = {
  success: true,
  dashboard: {
    totalDrives: 25,
    activeDrives: 8,
    closedDrives: 17,
    totalApplications: 450,
    totalStudents: 300,
    approvedStudents: 285,
    pendingApprovals: 15,
    placedStudents: 180,
    placementPercentage: 63.16,
    totalCompanies: 35,
    recentDrives: [
      {
        id: "drive_1",
        companyName: "Google",
        jobRole: "SDE",
        applicationsCount: 45,
        status: "active",
      },
      {
        id: "drive_2",
        companyName: "Microsoft",
        jobRole: "Cloud Engineer",
        applicationsCount: 52,
        status: "active",
      },
    ],
    recentApplications: [
      {
        studentName: "John Doe",
        companyName: "Microsoft",
        status: "shortlisted",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        studentName: "Jane Smith",
        companyName: "Google",
        status: "applied",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ],
    monthlyStats: {
      labels: ["August", "September", "October", "November"],
      applications: [30, 45, 60, 55],
      placements: [10, 15, 20, 18],
    },
  },
};

// --- Stat Card ---
const StatCard = ({ title, value, icon, colorClass }) => {
  const Icon = icon;
  const colorMap = {
    emerald: { main: '#10b981', light: '#34d399' },
    sky: { main: '#38bdf8', light: '#7dd3fc' },
    yellow: { main: '#facc15', light: '#fde047' },
    red: { main: '#ef4444', light: '#f87171' },
  };
  const colors = colorMap[colorClass] || colorMap.sky;

  return (
    <div
      className="p-6 rounded-2xl relative overflow-hidden shadow-lg border"
      style={{
        backgroundColor: '#1e293b',
        borderColor: '#475569',
      }}
    >
      <div
        className="absolute top-0 left-0 h-1.5 w-full"
        style={{ backgroundColor: colors.main }}
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

// --- Main Component ---
const TpoOverview = () => {
  const dash = MOCK_DATA.dashboard;

  // Chart Options
  const globalChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#e2e8f0', font: { size: 14 }, padding: 20 },
      },
      title: {
        display: true,
        text: titleText,
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
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#475569' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#475569' },
      },
    },
  });

  // Line Chart Data
  const lineData = {
    labels: dash.monthlyStats.labels,
    datasets: [
      {
        label: 'Applications',
        data: dash.monthlyStats.applications,
        borderColor: '#38bdf8',
        backgroundColor: '#38bdf833',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Placements',
        data: dash.monthlyStats.placements,
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Doughnut Chart Data
  const studentData = {
    labels: ['Approved Students', 'Pending Approvals'],
    datasets: [
      {
        data: [dash.approvedStudents, dash.pendingApprovals],
        backgroundColor: ['#10b981', '#facc15'],
        borderColor: '#0f172a',
        borderWidth: 4,
      },
    ],
  };

  const studentOptions = {
    ...globalChartOptions('Stuuuuuuudent Registration Status'),
    scales: { x: { display: false }, y: { display: false } },
    cutout: '70%',
  };

  return (
    <div
      className="p-8 w-full min-h-screen"
      style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}
    >
      <h1
        className="text-3xl font-extrabold mb-8"
        style={{ color: '#e2e8f0' }}
      >
        TPO Dashboard Overview
      </h1>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Placement %"
          value={`${dash.placementPercentage}%`}
          icon={Target}
          colorClass="emerald"
        />
        <StatCard
          title="Placed Students"
          value={`${dash.placedStudents} / ${dash.totalStudents}`}
          icon={Users}
          colorClass="sky"
        />
        <StatCard
          title="Active Drives"
          value={`${dash.activeDrives} / ${dash.totalDrives}`}
          icon={Briefcase}
          colorClass="sky"
        />
        <StatCard
          title="Total Applications"
          value={dash.totalApplications}
          icon={Send}
          colorClass="yellow"
        />
        <StatCard
          title="Pending Approvals"
          value={dash.pendingApprovals}
          icon={Clock}
          colorClass="red"
        />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Line Chart */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Line
              data={lineData}
              options={globalChartOptions('Monthly Applications vs. Placements')}
            />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div
          className="lg:col-span-1 p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full relative">
            <Doughnut data={studentData} options={studentOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span
                className="text-4xl font-extrabold"
                style={{ color: '#10b981' }}
              >
                {dash.totalStudents}
              </span>
              <span
                className="text-sm"
                style={{ color: '#94a3b8' }}
              >
                Total Students
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Activity Sections --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Drives */}
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
            Recent Drives
          </h3>
          <div className="space-y-4">
            {dash.recentDrives.map((drive) => (
              <div
                key={drive.id}
                className="flex items-center p-4 rounded-lg"
                style={{
                  backgroundColor: 'rgba(100, 116, 139, 0.1)',
                }}
              >
                <div
                  className="p-3 rounded-full mr-4"
                  style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)' }}
                >
                  <Building className="w-5 h-5" style={{ color: '#38bdf8' }} />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold" style={{ color: '#e2e8f0' }}>
                    {drive.companyName}
                  </p>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>
                    {drive.jobRole}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: '#e2e8f0' }}>
                    {drive.applicationsCount}
                  </p>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>
                    Applications
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
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
            Recent Applications
          </h3>
          <div className="space-y-4">
            {dash.recentApplications.map((app, index) => (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg"
                style={{
                  backgroundColor: 'rgba(100, 116, 139, 0.1)',
                }}
              >
                <div
                  className="p-3 rounded-full mr-4"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                >
                  <Users className="w-5 h-5" style={{ color: '#10b981' }} />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold" style={{ color: '#e2e8f0' }}>
                    {app.studentName}
                  </p>
                  <p className="text-sm" style={{ color: '#94a3b8' }}>
                    to {app.companyName} ({app.status})
                  </p>
                </div>
                <p
                  className="text-xs self-start"
                  style={{ color: '#94a3b8' }}
                >
                  {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpoOverview;
