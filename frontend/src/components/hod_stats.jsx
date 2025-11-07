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
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Users,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';

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
  department: "Computer Science",
  statistics: {
    totalStudents: 120,
    registeredStudents: 118,
    placedStudents: 85,
    placementPercentage: 72.03,
    averagePackage: "8.5 LPA",
    highestPackage: "45 LPA",
    lowestPackage: "3.5 LPA",
    totalOffers: 95,
    pendingApprovals: 2,
    topCompanies: [
      { name: "Google", offers: 5 },
      { name: "Microsoft", offers: 8 },
      { name: "Amazon", offers: 6 },
    ],
    packageDistribution: {
      "0-5 LPA": 25,
      "5-10 LPA": 40,
      "10-20 LPA": 15,
      "20+ LPA": 5,
    },
  },
};

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, colorClass }) => {
  const Icon = icon;
  const colorMap = {
    emerald: { main: '#10b981', light: '#34d399' },
    sky: { main: '#38bdf8', light: '#7dd3fc' },
    yellow: { main: '#facc15', light: '#fde047' },
    red: { main: '#ef4444', light: '#f87171' },
  };

  const colors = colorMap[colorClass] || colorMap.emerald;

  return (
    <div
      className="p-6 rounded-2xl relative overflow-hidden shadow-lg border"
      style={{
        backgroundColor: '#1e293b',
        borderColor: '#475569',
      }}
    >
      {/* Top Accent Bar */}
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

// --- Main Statistics Component ---
const HodStatistics = () => {
  const stats = MOCK_DATA.statistics;

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
        },
      },
      title: {
        display: true,
        text: 'Chart Title',
        color: '#e2e8f0',
        font: { size: 18, weight: 'bold' },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
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

  // --- Doughnut Chart Data ---
  const doughnutData = {
    labels: Object.keys(stats.packageDistribution),
    datasets: [
      {
        label: '# of Students',
        data: Object.values(stats.packageDistribution),
        backgroundColor: [
          '#38bdf8', // Accent: Sky Blue
          '#10b981', // Secondary: Emerald
          '#facc15', // Yellow
          '#ef4444', // Red
        ],
        borderColor: '#0f172a', // Background: Dark Slate
        borderWidth: 4,
      },
    ],
  };

  const doughnutOptions = {
    ...globalChartOptions,
    plugins: {
      ...globalChartOptions.plugins,
      title: {
        ...globalChartOptions.plugins.title,
        text: 'Package Distribution',
      },
    },
    scales: { x: { display: false }, y: { display: false } },
  };

  // --- Bar Chart Data ---
  const barData = {
    labels: stats.topCompanies.map((c) => c.name),
    datasets: [
      {
        label: 'Offers Made',
        data: stats.topCompanies.map((c) => c.offers),
        backgroundColor: '#38bdf8cc',
        borderColor: '#38bdf8',
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    ...globalChartOptions,
    indexAxis: 'y',
    plugins: {
      ...globalChartOptions.plugins,
      legend: { display: false },
      title: {
        ...globalChartOptions.plugins.title,
        text: 'Top Recruiting Companies',
      },
    },
    scales: {
      x: { ...globalChartOptions.scales.x },
      y: {
        ...globalChartOptions.scales.y,
        ticks: { color: '#e2e8f0' },
        grid: { color: 'transparent' },
      },
    },
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
        {MOCK_DATA.department} Department Statistics
      </h1>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Placement Percentage"
          value={`${stats.placementPercentage}%`}
          icon={Target}
          colorClass="emerald"
        />
        <StatCard
          title="Highest Package"
          value={stats.highestPackage}
          icon={TrendingUp}
          colorClass="sky"
        />
        <StatCard
          title="Average Package"
          value={stats.averagePackage}
          icon={DollarSign}
          colorClass="yellow"
        />
        <StatCard
          title="Placed Students"
          value={`${stats.placedStudents} / ${stats.registeredStudents}`}
          icon={Users}
          colorClass="emerald"
        />
        <StatCard
          title="Total Offers"
          value={stats.totalOffers}
          icon={CheckCircle}
          colorClass="sky"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          colorClass="red"
        />
      </div>

      {/* --- Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Doughnut Chart */}
        <div
          className="lg:col-span-2 p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div
          className="lg:col-span-3 p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#475569',
          }}
        >
          <div className="h-96 w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodStatistics;
