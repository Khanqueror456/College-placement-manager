import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  User, 
  UserCheck, 
  Briefcase, 
  Linkedin, 
  Github, 
  Send, 
  MoveRight 
} from 'lucide-react';

// --- Glass Navbar Component ---
const GlassNavBar = ({ onLogin, onSignup }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="
      sticky top-4 left-4 right-4 z-50
      max-w-6xl mx-auto
      bg-slate-800/20 backdrop-filter backdrop-blur-lg
      border border-slate-500/30
      rounded-2xl shadow-lg
      py-3 px-6
    ">
      <div className="flex items-center justify-between">
        {/* Logo/Brand Name */}
        <a href="#" className="text-2xl font-bold text-sky-400">
          Career<span className="text-emerald-400">Hub</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-slate-300 font-medium hover:text-sky-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={onSignup}
            className="
              px-5 py-2.5 rounded-lg font-semibold
              bg-emerald-500 text-slate-900
              hover:bg-emerald-400 transition-colors
              shadow-lg hover:shadow-emerald-500/40
            "
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="block text-slate-300 font-medium hover:text-sky-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-500/30">
            <button 
              onClick={() => { onLogin(); setIsOpen(false); }}
              className="w-full text-left px-5 py-2.5 rounded-lg font-semibold text-sky-400 bg-slate-700/50 hover:bg-slate-700"
            >
              Login
            </button>
            <button 
              onClick={() => { onSignup(); setIsOpen(false); }}
              className="w-full px-5 py-2.5 rounded-lg font-semibold bg-emerald-500 text-slate-900 hover:bg-emerald-400"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

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

// --- Footer ---
const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-500/30 mt-24">
    <div className="max-w-6xl mx-auto py-12 px-8 flex flex-col md:flex-row items-center justify-between">
      <div>
        <a href="#" className="text-2xl font-bold text-sky-400">
          Career<span className="text-emerald-400">Hub</span>
        </a>
        <p className="text-slate-400 text-sm mt-2">
          © 2025 CareerHub. All rights reserved.
        </p>
      </div>
      <div className="flex gap-6 mt-6 md:mt-0">
        <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors"><Linkedin size={24} /></a>
        <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors"><Github size={24} /></a>
      </div>
    </div>
  </footer>
);


// --- Main HomePage Component ---
const HomePage = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="bg-slate-900 text-slate-200 scroll-smooth">
      <GlassNavBar onLogin={onLoginClick} onSignup={onSignupClick} />
      <main>
        <HeroSection onSignup={onSignupClick} />
        <FeaturesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;