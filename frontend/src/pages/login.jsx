import React, { useState } from 'react';

// --- SVG Icon for Back Button ---
// Using a simple inline SVG to avoid dependencies
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);


// --- 1. Role Card Component ---
// This is the card for the selection screen
const RoleCard = ({ emoji, title, description, onSelect }) => {
  return (
    // We use a button for accessibility, as it triggers an action
    <button
      onClick={onSelect}
      className="
        block w-full p-8 rounded-2xl text-left
        
        /* --- Glass-Morphism --- */
        bg-slate-700 bg-opacity-25 /* Surface: Slate Dark (#1e293b) */
        backdrop-filter backdrop-blur-lg
        border border-slate-500 border-opacity-30 /* Borders: Slate (#475569) */
        shadow-lg
        
        /* --- Hover Glow Effect --- */
        transition-all duration-300 ease-in-out
        hover:scale-105
        hover:shadow-2xl
        hover:shadow-sky-500/40 /* Accent: Sky Blue (#38bdf8) for the glow */
        hover:border-slate-400 
      "
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-6xl mb-4">{emoji}</span>
        <h3 className="text-2xl font-bold text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-300 text-sm">
          {description}
        </p>
      </div>
    </button>
  );
};


// --- 2. Role Selection Screen ---
// This component shows the 3 role cards
const RoleSelectionScreen = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-slate-100">
        Choose Your Role
      </h2>
      
      {/* Grid for Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <RoleCard
          emoji="🎓"
          title="Student"
          description="Access your dashboard, view grades, and browse placement opportunities."
          onSelect={() => onSelectRole('Student')}
        />
        
        <RoleCard
          emoji="🧑‍🏫"
          title="HOD"
          description="Manage department staff, approve requests, and oversee academic progress."
          onSelect={() => onSelectRole('HOD')}
        />
        
        <RoleCard
          emoji="📊"
          title="Placement Officer"
          description="Coordinate with companies, manage student applications, and track statistics."
          onSelect={() => onSelectRole('Placement Officer')}
        />
        
      </div>
    </div>
  );
};


// --- 3. Login Screen ---
// This component shows the login form, customized by role
const LoginScreen = ({ role, onBack }) => {
  return (
    // Relative container for the back button
    <div className="w-full max-w-md relative">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="
          absolute -top-4 -left-4 md:-top-5 md:-left-5 z-10
          p-2.5 rounded-full
          text-slate-300
          bg-slate-700 bg-opacity-50
          border border-slate-500 border-opacity-30
          hover:bg-opacity-100 hover:text-sky-400 hover:border-sky-400
          transition-all duration-200
        "
        aria-label="Go back to role selection"
      >
        <BackArrowIcon />
      </button>

      {/* Glass-Morphism Login Card */}
      <div className="
        w-full p-8
        bg-slate-700 bg-opacity-20 
        backdrop-filter backdrop-blur-xl 
        rounded-xl
        shadow-2xl shadow-slate-900/50 
        border border-slate-500 border-opacity-30 
        text-slate-200 
      ">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-slate-100">
          {role} Login
        </h2>
        
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="user@example.com"
              className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50
                         bg-slate-800 bg-opacity-30 
                         placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-sky-400 
                         transition duration-300
                         text-slate-100"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-slate-500 border-opacity-50
                         bg-slate-800 bg-opacity-30
                         placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-sky-400 
                         transition duration-300
                         text-slate-100"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-lg font-semibold
                       bg-emerald-500 text-slate-900
                       hover:bg-emerald-400 transition duration-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm">
          Forgot your password? 
          <a href="#" className="font-bold ml-1 text-sky-400 hover:text-sky-300 transition duration-300">Reset</a>
        </p>
      </div>
    </div>
  );
};


// --- 4. Main Login Page Component (Default Export) ---
// This holds the state and controls which screen to show
const LoginPage = () => {
  // State to track which role is selected. `null` means no role selected.
  const [selectedRole, setSelectedRole] = useState(null);

  // Handler for when a role card is clicked
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  // Handler for the "Back" button on the login screen
  const handleBack = () => {
    setSelectedRole(null);
  };

  return (
    // Full-screen container with the main background
    <div className="
      flex items-center justify-center min-h-screen 
      bg-slate-900 /* Background: Dark Slate (#0f172a) */
      p-8
    ">
      {/* This is the main logic:
        - If `selectedRole` is null, show the RoleSelectionScreen.
        - If `selectedRole` is set, show the LoginScreen and pass the role to it.
      */}
      {selectedRole ? (
        <LoginScreen role={selectedRole} onBack={handleBack} />
      ) : (
        <RoleSelectionScreen onSelectRole={handleRoleSelect} />
      )}
    </div>
  );
};

export default LoginPage;