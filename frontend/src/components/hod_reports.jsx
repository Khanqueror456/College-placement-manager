import React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
  Download, 
  Target, 
  Users, 
  BarChartHorizontal, 
  Award,
  CheckSquare,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns'; // To format the timestamp

// --- Register Chart.js components ---
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Mock Data ---
const MOCK_DATA = {
  success: true,
  report: {
    academicYear: "2024-25",
    department: "Computer Science",
    generatedAt: "2025-11-07T10:30:00.000Z",
    summary: {
      totalStudents: 120,
      placedStudents: 75,
      placementRate: "68.18%",
      averagePackage: "8.5 LPA",
      highestPackage: "25 LPA",
    },
    detailedStats: {
      companiesVisited: 25,
      offersReceived: 85,
      multipleOffers: 10,
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
      {/* Accent bar */}
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

// --- Main HOD Report Component ---
const HodPlacementReport = () => {
  const report = MOCK_DATA.report;
  const summary = report.summary;
  const detailed = report.detailedStats;

  // Calculate unplaced students for the chart
  const unplacedStudents = summary.totalStudents - summary.placedStudents;

  // --- Chart.js Data & Options ---
  const placementData = {
    labels: ['Placed Students', 'Not Placed'],
    datasets: [
      {
        data: [summary.placedStudents, unplacedStudents],
        backgroundColor: [
          '#10b981', // Secondary: Emerald
          '#475569', // Borders: Slate
        ],
        borderColor: '#0f172a', // Background: Dark Slate
        borderWidth: 4,
      },
    ],
  };

  const placementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0', // Text
          font: { size: 14 },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Placement Status',
        color: '#e2e8f0',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#1e293b', // Surface
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 10,
      },
    },
    cutout: '70%',
  };

  return (
    <div
      className="p-8 w-full min-h-screen"
      style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}
    >
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/hod-dashboard">
            <button
              className="flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              style={{
                backgroundColor: '#475569',
                color: '#e2e8f0',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#64748b')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </Link>
          <div>
            <h1
              className="text-3xl font-extrabold"
              style={{ color: '#e2e8f0' }}
            >
              Placement Report
            </h1>
            <p className="text-lg" style={{ color: '#38bdf8' }}>
              {report.department} - {report.academicYear}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: '#94a3b8' }}
            >
              Generated: {format(new Date(report.generatedAt), 'PPpp')}
            </p>
          </div>
        </div>

        <button
          className="flex items-center justify-center px-5 py-2 rounded-lg font-semibold transition-all duration-300"
          style={{
            backgroundColor: '#10b981',
            color: '#0f172a',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#34d399')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
        >
          <Download className="w-5 h-5 mr-2" />
          Download Report
        </button>
      </div>

      {/* --- KPI Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Placement Rate"
          value={summary.placementRate}
          icon={Target}
          colorClass="emerald"
        />
        <StatCard
          title="Placed / Total"
          value={`${summary.placedStudents} / ${summary.totalStudents}`}
          icon={Users}
          colorClass="sky"
        />
        <StatCard
          title="Average Package"
          value={summary.averagePackage}
          icon={BarChartHorizontal}
          colorClass="yellow"
        />
        <StatCard
          title="Highest Package"
          value={summary.highestPackage}
          icon={Award}
          colorClass="sky"
        />
        <StatCard
          title="Offers Received"
          value={detailed.offersReceived}
          icon={CheckSquare}
          colorClass="emerald"
        />
      </div>

      {/* --- Main Chart Area --- */}
      <div
        className="p-6 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: '#1e293b', // Surface
          borderColor: '#475569', // Borders
        }}
      >
        <div className="h-96 w-full max-w-lg mx-auto relative">
          <Doughnut data={placementData} options={placementOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-5xl font-extrabold"
              style={{ color: '#10b981' }}
            >
              {summary.placementRate}
            </span>
            <span
              className="text-sm font-medium mt-1"
              style={{ color: '#94a3b8' }}
            >
              Placement Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodPlacementReport;
