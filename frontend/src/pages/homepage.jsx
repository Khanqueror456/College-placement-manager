import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  UserCheck, 
  Briefcase, 
  Linkedin, 
  Github, 
  Send, 
  MoveRight,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

// --- Hero Section ---
const HeroSection = ({ onSignup }) => (
  <section className="relative min-h-screen flex items-center justify-center text-center p-8 overflow-hidden">
    {/* Background Glow Effect */}
    <div className="absolute inset-0 -z-10 bg-slate-900 
      bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] 
      from-slate-800/40 via-slate-900/10 to-transparent"
    />
    
    <div className="max-w-4xl">
      <h1 className="
        text-6xl md:text-8xl font-extrabold text-slate-100 
        tracking-tighter mb-6
      ">
        Launch Your 
        <span className="
          block mt-4
          bg-clip-text text-transparent 
          bg-gradient-to-r from-sky-400 to-emerald-400
        ">
          Career
        </span>
      </h1>
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
        The unified platform connecting students, faculty, and top recruiters.
        Explore opportunities, track your progress, and secure your future.
      </p>
      <button 
        onClick={onSignup}
        className="
          flex items-center gap-2 mx-auto
          px-8 py-4 rounded-lg font-semibold
          bg-sky-500 text-white
          hover:bg-sky-400 transition-all
          shadow-xl hover:shadow-sky-500/40
          text-lg
        "
      >
        Get Started Today <MoveRight size={20} />
      </button>
    </div>
  </section>
);

// --- Features (About) Section ---
const FeaturesSection = () => (
  <section id="about" className="py-24 px-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-16 text-slate-100">
        A Platform for Everyone
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Re-using the RoleCard style for consistency */}
        <div className="p-8 rounded-2xl bg-slate-800/25 backdrop-filter backdrop-blur-lg border border-slate-500/30 shadow-lg text-center">
          <User className="w-12 h-12 text-sky-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-100 mb-2">For Students</h3>
          <p className="text-slate-300 text-sm">Track drives, manage your profile, and apply with one click. Your entire placement journey, simplified.</p>
        </div>
        <div className="p-8 rounded-2xl bg-slate-800/25 backdrop-filter backdrop-blur-lg border border-slate-500/30 shadow-lg text-center">
          <UserCheck className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-100 mb-2">For HODs</h3>
          <p className="text-slate-300 text-sm">Approve student signups, monitor department statistics, and coordinate with placement officers.</p>
        </div>
        <div className="p-8 rounded-2xl bg-slate-800/25 backdrop-filter backdrop-blur-lg border border-slate-500/30 shadow-lg text-center">
          <Briefcase className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-100 mb-2">For Placement Officers</h3>
          <p className="text-slate-300 text-sm">Manage company drives, communicate with HODs, and view comprehensive student data.</p>
        </div>
      </div>
    </div>
  </section>
);

// --- Stats Section ---
const StatsSection = () => {
  const [stats, setStats] = useState({
    totalDrives: 0,
    activeDrives: 0,
    totalStudents: 0,
    placedStudents: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/tpo/dashboard');
      if (response.data) {
        setStats({
          totalDrives: response.data.totalDrives || 0,
          activeDrives: response.data.activeDrives || 0,
          totalStudents: response.data.totalStudents || 0,
          placedStudents: response.data.placedStudents || 0
        });
      }
    } catch (err) {
      console.log('Could not fetch stats');
    }
  };

  return (
    <section className="py-16 px-8 bg-slate-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-100">
          Placement Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <Briefcase className="w-10 h-10 text-sky-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{stats.totalDrives}</p>
            <p className="text-slate-400 text-sm">Total Drives</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{stats.activeDrives}</p>
            <p className="text-slate-400 text-sm">Active Drives</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <Users className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{stats.totalStudents}</p>
            <p className="text-slate-400 text-sm">Total Students</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <UserCheck className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{stats.placedStudents}</p>
            <p className="text-slate-400 text-sm">Placed Students</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Contact Section ---
const ContactSection = () => (
  <section id="contact" className="py-24 px-8">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-16 text-slate-100">
        Get In Touch
      </h2>
      <div className="
        p-8 rounded-2xl
        bg-slate-800/25 backdrop-filter backdrop-blur-lg
        border border-slate-500/30 shadow-lg
      ">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" name="email" id="email" className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
            <textarea name="message" id="message" rows="5" className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-sky-400"></textarea>
          </div>
          <button 
            type="submit"
            className="
              flex items-center gap-2
              w-full justify-center px-6 py-3 rounded-lg 
              font-semibold bg-emerald-500 text-slate-900
              hover:bg-emerald-400 transition-colors
              shadow-lg hover:shadow-emerald-500/40
            "
          >
            Send Message <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  </section>
);


// --- Main HomePage Component ---
const HomePage = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="bg-slate-900 text-slate-200 scroll-smooth">
      <Navbar onLogin={onLoginClick} onSignup={onSignupClick} />
      <main>
        <HeroSection onSignup={onSignupClick} />
        <StatsSection />
        <FeaturesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;