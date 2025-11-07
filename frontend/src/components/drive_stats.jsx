import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { Users, Star } from 'lucide-react'; // Icons for stat cards

// --- Register Chart.js components ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Mock Data ---
const MOCK_DATA = {
  success: true,
  stats: {
    driveId: "drive_1",
    totalApplications: 45,
    statusBreakdown: {
      applied: 20,
      shortlisted: 15,
      selected: 5,
      rejected: 5,
    },
    departmentWise: {
      "Computer Science": 25,
      IT: 15,
      ECE: 5,
    },
    roundWise: {
      "Resume Screening": 45,
      "Online Test": 30,
      "Technical Interview": 15,
      "Final Round": 8,
    },
    averageCGPA: 8.2,
    cgpaDistribution: {
      "7.0-7.5": 10,
      "7.5-8.0": 15,
      "8.0-8.5": 12,
      "8.5+": 8,
    },
  },
};

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, colorClass }) => {
  const Icon = icon;
  const colorMap = {
    emerald: { main: '#10b981', light: '#34d399' },
    sky: { main: '#38bdf8', light: '#7dd3fc' },
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

// --- Main Drive Stats Component ---
const TpoDriveStats = () => {
  const stats = MOCK_DATA.stats;

  // --- Chart.js Options (Dark Theme) ---
  const globalChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: { size: 14 },
          padding: 20,
        },
      },
      title: {
        display: true,
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
  };

  // --- Chart 1: Status Breakdown (Doughnut) ---
  const statusData = {
    labels: Object.keys(stats.statusBreakdown),
    datasets: [
      {
        data: Object.values(stats.statusBreakdown),
        backgroundColor: [
          '#38bdf8', // Accent
          '#facc15', // Yellow
          '#10b981', // Secondary
          '#ef4444', // Red
        ],
        borderColor: '#0f172a', // Background
        borderWidth: 4,
      },
    ],
  };
  const statusOptions = {
    ...globalChartOptions,
    plugins: {
      ...globalChartOptions.plugins,
      title: { ...globalChartOptions.plugins.title, text: 'Application Status' },
    },
  };

  // --- Chart 2: Department Wise (Pie) ---
  const deptData = {
    labels: Object.keys(stats.departmentWise),
    datasets: [
      {
        data: Object.values(stats.departmentWise),
        backgroundColor: [
          '#38bdf8', // Accent
          '#10b981', // Secondary
          '#facc15', // Yellow
        ],
        borderColor: '#0f172a',
        borderWidth: 4,
      },
    ],
  };
  const deptOptions = {
    ...globalChartOptions,
    plugins: {
      ...globalChartOptions.plugins,
      title: {
        ...globalChartOptions.plugins.title,
        text: 'Applicants by Department',
      },
    },
  };

  // --- Chart 3: Round Wise (Horizontal Bar) ---
  const roundData = {
    labels: Object.keys(stats.roundWise),
    datasets: [
      {
        label: 'Candidates',
        data: Object.values(stats.roundWise),
        backgroundColor: '#10b981cc', // Secondary with transparency
        borderColor: '#10b981',
        borderWidth: 2,
      },
    ],
  };
  const roundOptions = {
    ...globalChartOptions,
    indexAxis: 'y',
    plugins: {
      ...globalChartOptions.plugins,
      legend: { display: false },
      title: {
        ...globalChartOptions.plugins.title,
        text: 'Candidate Funnel by Round',
      },
    },
    scales: {
      x: { ...globalChartOptions.scales.x },
      y: {
        ...globalChartOptions.scales.y,
        grid: { color: 'transparent' },
      },
    },
  };

  // --- Chart 4: CGPA Distribution (Vertical Bar) ---
  const cgpaData = {
    labels: Object.keys(stats.cgpaDistribution),
    datasets: [
      {
        label: 'Students',
        data: Object.values(stats.cgpaDistribution),
        backgroundColor: '#38bdf8cc', // Accent
        borderColor: '#38bdf8',
        borderWidth: 2,
      },
    ],
  };
  const cgpaOptions = {
    ...globalChartOptions,
    plugins: {
      ...globalChartOptions.plugins,
      legend: { display: false },
      title: {
        ...globalChartOptions.plugins.title,
        text: 'Applicants by CGPA',
      },
    },
  };

  return (
    <div
      className="p-8 w-full min-h-screen"
      style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}
    >
      <h1
        className="text-3xl font-extrabold mb-2"
        style={{ color: '#e2e8f0' }}
      >
        Drive Statistics
      </h1>
      <p className="text-lg mb-8" style={{ color: '#38bdf8' }}>
        Drive ID: {stats.driveId}
      </p>

      {/* --- KPI Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={Users}
          colorClass="sky"
        />
        <StatCard
          title="Average Applicant CGPA"
          value={stats.averageCGPA}
          icon={Star}
          colorClass="emerald"
        />
      </div>

      {/* --- Charts Grid (2x2) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Breakdown */}
        <div
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Doughnut data={statusData} options={statusOptions} />
          </div>
        </div>

        {/* Department Wise */}
        <div
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Pie data={deptData} options={deptOptions} />
          </div>
        </div>

        {/* Round Wise */}
        <div
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Bar data={roundData} options={roundOptions} />
          </div>
        </div>

        {/* CGPA Distribution */}
        <div
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Bar data={cgpaData} options={cgpaOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpoDriveStats;
