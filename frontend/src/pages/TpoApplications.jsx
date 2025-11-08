import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Search, Filter, Download } from 'lucide-react';
import api from '../services/api';

const TpoApplications = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    if (selectedDrive) {
      fetchApplications();
    }
  }, [selectedDrive]);

  const fetchDrives = async () => {
    try {
      const response = await api.get('/tpo/drives');
      setDrives(response.data.drives || []);
      if (response.data.drives && response.data.drives.length > 0) {
        setSelectedDrive(response.data.drives[0].id);
      }
    } catch (err) {
      setError('Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tpo/drives/${selectedDrive}/applications`);
      setApplications(response.data.applications || []);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setError('');
      setSuccess('');
      await api.put(`/tpo/applications/${applicationId}/status`, { status: newStatus });
      setSuccess('Status updated successfully!');
      fetchApplications();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
      case 'APPLIED':
        return 'bg-blue-500 bg-opacity-20 text-blue-300';
      case 'SHORTLISTED':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-300';
      case 'SELECTED':
        return 'bg-emerald-500 bg-opacity-20 text-emerald-300';
      case 'REJECTED':
        return 'bg-red-500 bg-opacity-20 text-red-300';
      default:
        return 'bg-slate-500 bg-opacity-20 text-slate-300';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status?.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <FileText className="w-8 h-8 text-sky-400" />
              <h1 className="text-2xl font-bold text-white">View Applications</h1>
            </div>
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

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Select Drive</label>
            <select
              value={selectedDrive}
              onChange={(e) => setSelectedDrive(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
            >
              {drives.map((drive) => (
                <option key={drive.id} value={drive.id}>
                  {drive.companyName} - {drive.jobRole}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white py-12">Loading applications...</div>
        ) : !selectedDrive ? (
          <div className="text-center text-slate-400 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No drives available</p>
            <p className="text-sm">Create a drive first to view applications</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No applications found</p>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'ALL' ? 'Try adjusting your filters' : 'No students have applied yet'}
            </p>
          </div>
        ) : (
          <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700 bg-opacity-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-slate-700 hover:bg-opacity-30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white font-medium">{application.student?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-400 text-sm">{application.student?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white">{application.student?.cgpa || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-400 text-sm">{application.student?.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                          {application.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={application.status || 'PENDING'}
                          onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                          className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="SELECTED">Selected</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-700 bg-opacity-30 border-t border-slate-700">
              <p className="text-slate-400 text-sm">
                Showing {filteredApplications.length} of {applications.length} applications
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TpoApplications;
