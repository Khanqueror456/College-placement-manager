import { useState } from "react";
import { Link } from "react-router-dom";
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
const Navbar = ({ onLogin, onSignup, className = ""  }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`
      sticky top-4 left-4 right-4 z-50
      max-w-6xl mx-auto
      bg-slate-800/20 backdrop-filter backdrop-blur-lg
      border border-slate-500/30
      rounded-2xl shadow-lg
      py-3 px-6 ${className}
    `}>
      <div className="flex items-center justify-between">
        {/* Logo/Brand Name */}
        <a href="/" className="text-2xl font-bold text-sky-400">
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
          <Link to="/login" state={{ mode: 'login' }}><button 
            onClick={onLogin}
            className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Login
          </button></Link>
         <Link to="/login" state={{ mode: 'signup' }}> <button 
            onClick={onSignup} 
            className="
              px-5 py-2.5 rounded-lg font-semibold
              bg-emerald-500 text-slate-900
              hover:bg-emerald-400 transition-colors
              shadow-lg hover:shadow-emerald-500/40
            "
          >
            Sign Up
          </button></Link>
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

export default Navbar;