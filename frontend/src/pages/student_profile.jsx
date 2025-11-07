import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_AVATAR } from '../assets/defaults';

// --- Placeholder for Student Data ---
const MOCK_STUDENT_PROFILE = {
  profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cfdce567?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Example avatar
  name: 'Jane Doe',
  usn: '1SJ18CS007',
  branch: 'Computer Science Engineering',
  year: '4th Year',
  semester: '8th Semester',
  email: 'jane.doe@example.com',
  skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'SQL', 'Data Structures'],
  experience: [
    { title: 'Software Engineer Intern', company: 'Tech Solutions Inc.', duration: 'May 2023 - Aug 2023', description: 'Developed RESTful APIs, maintained databases, contributed to front-end components.' },
    { title: 'Web Development Freelancer', company: 'Self-Employed', duration: 'Jan 2022 - Present', description: 'Built and maintained websites for small businesses.' },
  ],
  resumeUrl: 'https://www.africau.edu/images/default/sample.pdf', // Example PDF link
};

// --- SVG Icons ---
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25v4.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75v-4.5M16.5 7.5l-4.5-4.5-4.5 4.5M12 3v13.5" />
  </svg>
);

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0112 21c2.305 0 4.49-1.028 5.956-2.757m-4.728-9.349L15 11.25m-4.728-9.349L15 11.25M12 10.5v4.5m7.005-4.5H18m2.004 6.75H18M7.957 4.525A8.967 8.967 0 0112 3.75c1.052 0 2.062.18 3 .512m-7.957 0a8.967 8.967 0 014.357 6.309m-4.357-6.309a8.967 8.967 0 00-4.356 6.309m11.189-9.75L15 11.25M12 6.042V4.5m0 0L8.042 2.25" />
  </svg>
);


const StudentProfile = ({ profile = MOCK_STUDENT_PROFILE, onLogout }) => {

  const handleViewResume = () => {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    } else {
      alert("Resume not available!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200">

      {/* --- Header Bar --- */}
      <header className="
        w-full p-4
        flex justify-between items-center
        bg-slate-700 bg-opacity-20 backdrop-filter backdrop-blur-lg
        border-b border-slate-500 border-opacity-30
        z-10 // Ensure header is on top
      ">
        <h1 className="text-2xl font-bold text-slate-100">Student Profile</h1>
        <div className="buttons flex justify-between items-center gap-4">
          <Link to="/student-dashboard">
            <button
              className="
            flex items-center px-4 py-2 rounded-lg font-semibold
            bg-slate-700 hover:bg-slate-600
            border border-slate-500 hover:border-sky-400
            text-slate-200 hover:text-sky-400
            transition-all duration-300
          "
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Dashboard
            </button>
          </Link>
          <button
            onClick={onLogout}
            className="
            flex items-center px-4 py-2 rounded-lg font-semibold
            bg-slate-700 hover:bg-slate-600
            border border-slate-500 hover:border-sky-400
            text-slate-200 hover:text-sky-400
            transition-all duration-300
          "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- Profile Card (Left/Top Section) --- */}
          <div className="
            lg:col-span-1 p-6 rounded-2xl flex flex-col items-center text-center
            bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg
            border border-slate-500 border-opacity-30 shadow-lg
          ">
            <img
              src={profile.profilePhoto || DEFAULT_AVATAR}
              alt={`${profile.name}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-sky-500 mb-4 shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />

            <h2 className="text-3xl font-bold text-slate-100 mb-2">{profile.name}</h2>
            <p className="text-sky-400 mb-6">{profile.usn}</p>

            <div className="text-left w-full space-y-2 text-slate-300">
              <p className="flex items-center"><BookOpenIcon /> {profile.branch}</p>
              <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3V12m-3-2.25L12 21m-4.5-10.5L12 21M21 3v.25M21 12v.25" /></svg> {profile.year}, {profile.semester}</p>
              <p className="flex items-center text-sky-300"><MailIcon /> {profile.email}</p>
            </div>
          </div>

          {/* --- Details Sections (Right/Bottom Section) --- */}
          <div className="lg:col-span-2 space-y-8">

            {/* Skills Section */}
            <section className="
              p-6 rounded-2xl
              bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg
              border border-slate-500 border-opacity-30 shadow-lg
            ">
              <h3 className="flex items-center text-2xl font-bold text-slate-100 mb-4"><CodeIcon /> Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="
                      px-4 py-2 rounded-full text-sm font-semibold 
                      bg-emerald-500/20 text-emerald-300
                      border border-emerald-400 border-opacity-50
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Experience Section */}
            <section className="
              p-6 rounded-2xl
              bg-slate-700 bg-opacity-25 backdrop-filter backdrop-blur-lg
              border border-slate-500 border-opacity-30 shadow-lg
            ">
              <h3 className="flex items-center text-2xl font-bold text-slate-100 mb-4"><BriefcaseIcon /> Experience</h3>
              <div className="space-y-6">
                {profile.experience.map((job, index) => (
                  <div key={index} className="pb-4 border-b border-slate-600 last:border-b-0">
                    <h4 className="text-xl font-semibold text-slate-100">{job.title}</h4>
                    <p className="text-sky-300 text-sm">{job.company} &bull; {job.duration}</p>
                    <p className="text-slate-300 mt-2 text-sm">{job.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* View Resume Box */}
            <button
              onClick={handleViewResume}
              className="
                w-full p-6 rounded-2xl flex items-center justify-center
                bg-sky-500 hover:bg-sky-400 text-white font-bold text-lg
                transition-all duration-300 shadow-xl hover:shadow-sky-500/50
                focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-75
              "
            >
              View Resume <ExternalLinkIcon />
            </button>

          </div> {/* End details sections */}
        </div> {/* End max-w-4xl grid */}
      </main>
    </div>
  );
};

export default StudentProfile;