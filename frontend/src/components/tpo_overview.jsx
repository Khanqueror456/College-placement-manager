import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Target,
  Users,
  Briefcase,
  Send,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Reusable Stat Card Component ---
/*
  This card is used for the top-level statistics.
  It supports a main value, a title, an icon, and a color theme.
  It also has a slot for a 'widget' (like the radial progress or text)
*/
const StatCard = ({ title, value, icon: Icon, color, children }) => {
  const S_COLORS = {
    green: 'border-emerald-500/50 text-emerald-400',
    blue: 'border-sky-500/50 text-sky-400',
    yellow: 'border-yellow-500/50 text-yellow-400',
    red: 'border-red-500/50 text-red-400',
  };

  return (
    <div
      className={`
        bg-slate-800 p-5 rounded-2xl 
        border-t-4 ${S_COLORS[color] || 'border-slate-700 text-slate-300'}
        shadow-lg flex justify-between items-start
      `}
    >
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-slate-100">{value}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
};

// --- Custom Radial Progress for Placement % Card ---
const RadialProgress = ({ percentage, color }) => {
  const S_COLORS = {
    green: 'text-emerald-400',
    blue: 'text-sky-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };
  const radius = 28;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 64 64"
        className="-rotate-90"
      >
        <circle
          className="text-slate-700"
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius + stroke / 2}
          cy={radius + stroke / 2}
        />
        <circle
          className={S_COLORS[color] || 'text-slate-400'}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius + stroke / 2}
          cy={radius + stroke / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Target className={`w-6 h-6 ${S_COLORS[color] || 'text-slate-400'}`} />
      </div>
    </div>
  );
};

// --- Icon wrapper for other Stat Cards ---
const StatIcon = ({ icon: Icon, color }) => {
  const S_COLORS = {
    green: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-sky-500/10 text-sky-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    red: 'bg-red-500/10 text-red-400',
  };
  return (
    <div
      className={`
        w-16 h-16 flex items-center justify-center 
        rounded-full ${S_COLORS[color] || 'bg-slate-700 text-slate-400'}
      `}
    >
      <Icon className="w-8 h-8" />
    </div>
  );
};

// --- Monthly Applications vs. Placements Chart (Chart.js) ---
const MonthlyChart = () => {
  const data = {
    labels: ['August', 'September', 'October', 'November'],
    datasets: [
      {
        label: 'Applications',
        data: [30, 45, 60, 55],
        borderColor: '#0EA5E9', // sky-500
        backgroundColor: '#0EA5E9',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#0EA5E9',
        pointHoverBorderColor: '#0f172a', // slate-900
      },
      {
        label: 'Placements',
        data: [12, 15, 19, 18],
        borderColor: '#10B981', // emerald-500
        backgroundColor: '#10B981',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#10B981',
        pointHoverBorderColor: '#0f172a', // slate-900
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8', // slate-400
          font: {
            family: 'Inter, sans-serif',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
        titleColor: '#f1f5f9', // slate-100
        bodyColor: '#cbd5e1', // slate-300
        titleFont: { family: 'Inter, sans-serif', weight: 'bold' },
        bodyFont: { family: 'Inter, sans-serif' },
        padding: 12,
        cornerRadius: 8,
        borderColor: '#334155', // slate-700
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#334155', // slate-700
          drawBorder: false,
        },
        ticks: {
          color: '#64748B', // slate-500
          font: { family: 'Inter, sans-serif' },
        },
      },
      y: {
        grid: {
          color: '#334155', // slate-700
          drawBorder: false,
        },
        ticks: {
          color: '#64748B', // slate-500
          font: { family: 'Inter, sans-serif' },
        },
      },
    },
  };

  return (
    <div
      className="
        bg-slate-800 p-6 rounded-2xl 
        border border-slate-700 shadow-lg h-96
      "
    >
      <h3 className="text-xl font-bold text-slate-100 mb-4">
        Monthly Applications vs. Placements
      </h3>
      <div className="h-[85%]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

// --- Student Registration Status Chart (Chart.js) ---
const StudentStatusChart = () => {
  const data = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        data: [270, 30],
        backgroundColor: [
          '#10B981', // emerald-500
          '#F59E0B', // yellow-500
        ],
        borderColor: '#1e293b', // slate-800
        borderWidth: 4,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%', // Makes it a doughnut
    plugins: {
      legend: {
        display: false, // We use a custom legend below
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
        titleColor: '#f1f5f9', // slate-100
        bodyColor: '#cbd5e1', // slate-300
        titleFont: { family: 'Inter, sans-serif', weight: 'bold' },
        bodyFont: { family: 'Inter, sans-serif' },
        padding: 12,
        cornerRadius: 8,
        borderColor: '#334155', // slate-700
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return ` ${context.label}: ${context.formattedValue}`;
          },
        },
      },
    },
  };

  return (
    <div
      className="
        bg-slate-800 p-6 rounded-2xl 
        border border-slate-700 shadow-lg h-96
      "
    >
      <h3 className="text-xl font-bold text-slate-100 mb-4">
        Student Registration Status
      </h3>
      <div className="relative w-full h-5/6">
        {/* Center Text */}
        <div
          className="
            absolute inset-0 flex flex-col 
            items-center justify-center z-0
          "
        >
          <p className="text-5xl font-extrabold text-slate-100">300</p>
          <p className="text-sm font-medium text-slate-400">Total Students</p>
        </div>
        {/* Chart */}
        <div className="relative z-10 w-full h-full">
          <Doughnut data={data} options={options} />
        </div>
      </div>
      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-slate-300">Approved Students</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-slate-300">Pending Approvals</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const TpoOverview = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 p-8 font-['Inter',_sans-serif]">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-8">
          TPO Dashboard Overview
        </h1>

        {/* --- Stats Card Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          <StatCard title="Placement %" value="63.16%" color="green">
            <RadialProgress percentage={63.16} color="green" />
          </StatCard>

          <StatCard title="Placed Students" value="180 / 300" color="blue">
            <StatIcon icon={Users} color="blue" />
          </StatCard>

          <StatCard title="Active Drives" value="8 / 25" color="blue">
            <StatIcon icon={Briefcase} color="blue" />
          </StatCard>

          <StatCard title="Total Applications" value="450" color="yellow">
            <StatIcon icon={Send} color="yellow" />
          </StatCard>

          <StatCard title="Pending Approvals" value="15" color="red">
            <StatIcon icon={Clock} color="red" />
          </StatCard>
        </div>

        {/* --- Charts Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlyChart />
          </div>
          <div className="lg:col-span-1">
            <StudentStatusChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpoOverview;