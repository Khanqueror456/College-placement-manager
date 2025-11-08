import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  User, 
  UserCheck, 
  Briefcase, 
  Linkedin, 
  Github, 
  Target, // Icon for Mission
  Rocket, // Icon for Vision
  Users,  // Icon for Team
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


// --- Platform Roles Section (Copied from HomePage FeaturesSection) ---
const PlatformRolesSection = () => (
  <section id="roles" className="py-24">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-extrabold text-center mb-16 text-slate-100">
        A Platform for Everyone
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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


// --- New "About Us" Content Card ---
const ContentCard = ({ icon: Icon, title, children }) => (
  <div className="
    p-8 rounded-2xl
    bg-slate-800/25 backdrop-filter backdrop-blur-lg
    border border-slate-500/30 shadow-lg
  ">
    <div className="flex items-center gap-4 mb-4">
      <Icon className="w-10 h-10 text-sky-400" />
      <h3 className="text-3xl font-bold text-slate-100">{title}</h3>
    </div>
    <p className="text-slate-300 text-lg">
      {children}
    </p>
  </div>
);

// --- New "Team" Card ---
const TeamCard = ({ name, role, imageUrl }) => (
  <div className="
    p-6 rounded-2xl text-center
    bg-slate-800/25 backdrop-filter backdrop-blur-lg
    border border-slate-500/30 shadow-lg
  ">
    <img 
      src={imageUrl} 
      alt={name}
      className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-emerald-400 object-cover"
      // Basic fallback
      onError={(e) => { e.target.src = 'https://placehold.co/128x128/1e293b/94a3b8?text=:)'; }}
    />
    <h4 className="text-xl font-semibold text-slate-100">{name}</h4>
    <p className="text-emerald-400">{role}</p>
  </div>
);

// --- Main AboutPage Component ---
const AboutPage = () => {
  // Placeholder team members
  const team = [
    { name: 'Anuj', role: 'Lead Developer', imageUrl: 'https://placehold.co/128x128/67e8f9/0f172a?text=AJ' },
    { name: 'Harsh', role: 'Project Manager', imageUrl: 'https://placehold.co/128x128/34d399/1e293b?text=HR' },
    { name: 'Saad', role: 'UI/UX Designer', imageUrl: 'https://placehold.co/128x128/fde047/1e293b?text=SK' },
    { name: 'Deepak', role: 'UI/UX Designer', imageUrl: 'https://placehold.co/128x128/fde047/1e293b?text=DP' },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 scroll-smooth min-h-screen">
      <Navbar />
      
      {/* Page Content */}
      <main className="py-20 px-8">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Header Section */}
          <header className="text-center">
            <h1 className="
              text-6xl md:text-7xl font-extrabold text-slate-100 
              tracking-tighter mb-4
            ">
              About <span className="
                bg-clip-text text-transparent 
                bg-gradient-to-r from-sky-400 to-emerald-400
              ">
                CareerHub
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
              We are dedicated to building the bridge between education and professional opportunity, one placement at a time.
            </p>
          </header>

          {/* Mission & Vision Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ContentCard title="Our Mission" icon={Target}>
              To create a unified, transparent, and efficient platform that connects students, faculty, and recruiters, simplifying the entire campus placement process and empowering students to launch their ideal careers.
            </ContentCard>
            <ContentCard title="Our Vision" icon={Rocket}>
              To be the leading career development ecosystem for educational institutions, fostering a future where every student has clear, direct access to opportunities that match their skills and aspirations.
            </ContentCard>
          </section>

          {/* Re-used Platform Roles Section */}
          <PlatformRolesSection />

          {/* Meet the Team Section */}
          <section>
            <h2 className="text-4xl font-extrabold text-center mb-16 text-slate-100">
              Meet the Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member) => (
                <TeamCard 
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                />
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;