import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';

const TpoCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/tpo/companies');
      setCompanies(response.data.companies || []);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/tpo/companies', formData);
      setSuccess('Company added successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        website: '',
        industry: '',
        location: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: ''
      });
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add company');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              <Building className="w-8 h-8 text-sky-400" />
              <h1 className="text-2xl font-bold text-white">Manage Companies</h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
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
        ) : companies.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No companies yet</p>
            <p className="text-sm">Add your first company to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-sky-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sky-500 bg-opacity-20 rounded-lg">
                      <Building className="w-6 h-6 text-sky-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{company.name}</h3>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-slate-400 text-sm line-clamp-2">{company.description}</p>
                  {company.industry && (
                    <p className="text-slate-400 text-sm"><span className="text-slate-500">Industry:</span> {company.industry}</p>
                  )}
                  {company.location && (
                    <p className="text-slate-400 text-sm"><span className="text-slate-500">Location:</span> {company.location}</p>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-sm hover:underline">
                      Visit Website →
                    </a>
                  )}
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-slate-500 text-xs">Drives: {company.drivesCount || 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Company</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TpoCompanies;
