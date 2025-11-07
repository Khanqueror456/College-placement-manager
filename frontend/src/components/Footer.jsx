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
export default Footer;