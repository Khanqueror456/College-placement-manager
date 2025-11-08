import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import { DEFAULT_AVATAR } from '../assets/defaults';
import { toast } from 'sonner';

const StudentProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  // Form data for editing
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cgpa: '',
    student_id: '',
    batch_year: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await studentService.getProfile();
      console.log('📝 Fetched profile:', response.profile);
      setProfile(response.profile);
      setFormData({
        name: response.profile.name || '',
        phone: response.profile.phone || '',
        cgpa: response.profile.cgpa || '',
        student_id: response.profile.student_id || '',
        batch_year: response.profile.batch_year || ''
      });
      console.log('✅ Form data set:', {
        name: response.profile.name,
        phone: response.profile.phone,
        cgpa: response.profile.cgpa,
        student_id: response.profile.student_id,
        batch_year: response.profile.batch_year
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      await studentService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Show analyzing toast
      toast.loading('🤖 Analyzing resume with AI...', { id: 'upload-toast' });

      const response = await studentService.uploadResume(file);
      console.log('📤 Upload response:', response);
      
      // Dismiss loading toast
      toast.dismiss('upload-toast');
      
      // Show ATS score feedback if available
      if (response.atsScore) {
        const scoreColor = response.atsScore >= 80 ? '🟢' : response.atsScore >= 60 ? '🟡' : '🔴';
        
        // Show main success toast
        toast.success(`${scoreColor} Resume uploaded! ATS Score: ${response.atsScore}/100`, {
          description: `Rating: ${response.atsAnalysis?.rating || 'N/A'}`,
          duration: 6000,
        });
        
        // Show strengths if available
        if (response.atsAnalysis?.strengths?.length > 0) {
          setTimeout(() => {
            toast.info('💪 Key Strengths Identified', {
              description: response.atsAnalysis.strengths.slice(0, 3).join(' • '),
              duration: 5000,
            });
          }, 500);
        }
        
        // Show recommendations if available
        if (response.atsAnalysis?.recommendations?.length > 0) {
          setTimeout(() => {
            toast.info('💡 Recommendations', {
              description: response.atsAnalysis.recommendations.slice(0, 2).join(' • '),
              duration: 5000,
            });
          }, 1000);
        }
        
        setSuccess(`Resume uploaded with ATS Score: ${response.atsScore}/100`);
      } else {
        toast.success('Resume uploaded successfully!', {
          description: 'ATS analysis pending...',
        });
        setSuccess('Resume uploaded successfully! (ATS analysis pending...)');
      }
      
      await fetchProfile();
    } catch (err) {
      console.error('❌ Upload error:', err);
      toast.dismiss('upload-toast');
      const errorMsg = err.response?.data?.message || err.message || 'Failed to upload resume';
      toast.error('Upload Failed', { description: errorMsg });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;

    try {
      setError('');
      setSuccess('');
      await studentService.deleteResume();
      setSuccess('Resume deleted successfully');
      await fetchProfile();
    } catch (err) {
      setError(err.message || 'Failed to delete resume');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-200 text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-400">My Profile</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/student-dashboard"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-200"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-300">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
              <img
                src={DEFAULT_AVATAR}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-sky-500"
              />
              <h2 className="text-2xl font-bold mb-2">{profile?.name}</h2>
              <p className="text-sky-400 mb-1">{profile?.student_id || 'No ID'}</p>
              <p className="text-slate-400">{profile?.department}</p>
              <p className="text-sm text-slate-400 mt-2">{profile?.email}</p>
              
              <div className="mt-6 space-y-2">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <p className="text-sm text-slate-400">CGPA</p>
                  <p className="text-2xl font-bold text-emerald-400">{profile?.cgpa || 'N/A'}</p>
                </div>
                <div className="bg-slate-700 p-3 rounded-lg">
                  <p className="text-sm text-slate-400">Status</p>
                  <p className={`text-sm font-semibold ${
                    profile?.profile_status === 'APPROVED' ? 'text-green-400' :
                    profile?.profile_status === 'REJECTED' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {profile?.profile_status === 'APPROVED' ? 'Approved' :
                     profile?.profile_status === 'REJECTED' ? 'Rejected' :
                     profile?.profile_status === 'PENDING' ? 'Pending Approval' :
                     'Incomplete'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Actions */}
            <div className="flex justify-end gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition duration-200"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Personal Information</h3>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-400 focus:outline-none"
                    />
                  ) : (
                    <p className="p-3 bg-slate-700 rounded-lg">{profile?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-400 focus:outline-none"
                    />
                  ) : (
                    <p className="p-3 bg-slate-700 rounded-lg">{profile?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Student ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-400 focus:outline-none"
                    />
                  ) : (
                    <p className="p-3 bg-slate-700 rounded-lg">{profile?.student_id || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Batch Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="batch_year"
                      value={formData.batch_year}
                      onChange={handleChange}
                      placeholder="e.g., 2024"
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-400 focus:outline-none"
                    />
                  ) : (
                    <p className="p-3 bg-slate-700 rounded-lg">{profile?.batch_year || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">CGPA</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-sky-400 focus:outline-none"
                    />
                  ) : (
                    <p className="p-3 bg-slate-700 rounded-lg">{profile?.cgpa || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Resume</h3>
              {profile?.resume_url ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">📄</span>
                      <div>
                        <p className="font-medium">Resume uploaded</p>
                        <p className="text-sm text-slate-400">Last updated: {new Date(profile.resume_uploaded_at || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={profile.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition duration-200"
                      >
                        View
                      </a>
                      <button
                        onClick={handleDeleteResume}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* ATS Score Display */}
                  {profile.ats_score && (
                    <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">ATS Resume Score</p>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-sky-400">{profile.ats_score}</span>
                            <span className="text-slate-400">/100</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                              profile.ats_score >= 80 ? 'bg-green-500/20 text-green-400' :
                              profile.ats_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {profile.ats_score >= 80 ? 'Excellent' :
                               profile.ats_score >= 60 ? 'Good' :
                               profile.ats_score >= 40 ? 'Average' : 'Needs Improvement'}
                            </span>
                          </div>
                        </div>
                        <div className="text-4xl">
                          {profile.ats_score >= 80 ? '🌟' :
                           profile.ats_score >= 60 ? '✨' :
                           profile.ats_score >= 40 ? '💡' : '📝'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              profile.ats_score >= 80 ? 'bg-green-500' :
                              profile.ats_score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${profile.ats_score}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        💡 Upload a new resume to get an updated ATS analysis with recommendations
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition duration-200"
                  >
                    Upload Resume
                  </label>
                  <p className="text-sm text-slate-400 mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfilePage;
