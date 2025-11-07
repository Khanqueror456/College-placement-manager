import React from "react";
import { Home, SearchX, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex flex-col w-full">
      <Navbar className="w-full" />

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Background Glow */}
        <div
          className="absolute inset-0 -z-10 
          bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] 
          from-sky-800/20 via-slate-900/50 to-transparent"
        />

        {/* 404 Text and Icon */}
        <SearchX className="w-20 h-20 text-sky-400 mb-8 animate-pulse" />
        <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter text-slate-100 mb-4">
          404
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-8">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold 
              bg-slate-800/40 border border-slate-600/50 
              hover:bg-slate-700/50 transition-all shadow-md"
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold 
              bg-sky-500 text-white hover:bg-sky-400 
              shadow-lg hover:shadow-sky-500/40 transition-all"
          >
            <Home size={18} /> Home
          </Link>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
