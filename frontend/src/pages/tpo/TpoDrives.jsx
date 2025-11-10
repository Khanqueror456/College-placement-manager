import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, ArrowLeft, Calendar, MapPin, DollarSign } from 'lucide-react';
import api from '../../services/api';

const TpoDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    companyName: '',
    jobRole: '',
    jobDescription: '',
    package: '',
    jobType: 'FULL_TIME',
    location: '',
    applicationDeadline: '',
    driveDate: '',
    eligibilityCriteria: {
      minCGPA: 6.0,
      allowedDepartments: [],
      maxBacklogs: 0,
      graduationYears: [2024, 2025]
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDrives();
    fetchCompanies();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await api.get('/tpo/drives');
      setDrives(response.data.drives || []);
    } catch (err) {
      setError('Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/tpo/companies');
      setCompanies(response.data.companies || []);
    } catch (err) {
      console.error('Failed to load companies', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/tpo/drives', formData);
      setSuccess('Drive created successfully!');
      setShowModal(false);
      resetForm();
      fetchDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create drive');
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: '',
      companyName: '',
      jobRole: '',
      jobDescription: '',
      package: '',
      jobType: 'FULL_TIME',
      location: '',
      applicationDeadline: '',
      driveDate: '',
      eligibilityCriteria: {
        minCGPA: 6.0,
        allowedDepartments: [],
        maxBacklogs: 0,
        graduationYears: [2024, 2025]
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('eligibility.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        eligibilityCriteria: {
          ...formData.eligibilityCriteria,
          [key]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    const company = companies.find(c => c.id === parseInt(companyId));
    setFormData({
      ...formData,
      companyId,
      companyName: company?.name || ''
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE':
        return 'bg-emerald-500 bg-opacity-20 text-emerald-300';
      case 'CLOSED':
        return 'bg-slate-500 bg-opacity-20 text-slate-300';
      case 'CANCELLED':
        return 'bg-red-500 bg-opacity-20 text-red-300';
      default:
        return 'bg-blue-500 bg-opacity-20 text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 bg-opacity-50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/tpo-dashboard')}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <Briefcase className="w-8 h-8 text-sky-400" />
              <h1 className="text-2xl font-bold text-white">Manage Placement Drives</h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Drive</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white py-12">Loading...</div>
        ) : drives.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No placement drives yet</p>
            <p className="text-sm">Create your first drive to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-sky-500 transition-all cursor-pointer"
                onClick={() => navigate(`/tpo/drives/${drive.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{drive.companyName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(drive.status)}`}>
                        {drive.status}
                      </span>
                    </div>
                    <p className="text-sky-400 font-semibold mb-3">{drive.jobRole}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <DollarSign className="w-4 h-4" />
                        <span>{drive.package}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{drive.location || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(drive.driveDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">Applications</p>
                    <p className="text-2xl font-bold text-white">{drive.applicationsCount || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Drive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl p-6 max-w-3xl w-full my-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Placement Drive</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Select Company *</label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleCompanyChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="">Choose a company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {companies.length === 0 && (
                  <p className="text-sm text-amber-400 mt-1">
                    No companies found. <button type="button" onClick={() => navigate('/tpo/companies')} className="underline">Add one first</button>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Job Role *</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Package *</label>
                  <input
                    type="text"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 12 LPA"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Job Description *</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Application Deadline *</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Drive Date *</label>
                  <input
                    type="date"
                    name="driveDate"
                    value={formData.driveDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  name="eligibility.minCGPA"
                  value={formData.eligibilityCriteria.minCGPA}
                  onChange={handleChange}
                  placeholder="6.0"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
                >
                  Create Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TpoDrives;
