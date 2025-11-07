import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Briefcase } from 'lucide-react';

// --- Mock Data ---
const MOCK_COMPANIES = [
  { id: crypto.randomUUID(), name: 'TechSolutions Inc.', role: 'Software Engineer', package: '12 LPA', eligibility: '7 CGPA', status: 'Active' },
  { id: crypto.randomUUID(), name: 'DataWeavers', role: 'Data Analyst', package: '9 LPA', eligibility: '6.5 CGPA', status: 'Active' },
  { id: crypto.randomUUID(), name: 'Innovate AI', role: 'ML Engineer', package: '15 LPA', eligibility: '8 CGPA', status: 'Pending' },
  { id: crypto.randomUUID(), name: 'CloudNet', role: 'Cloud Architect', package: '14 LPA', eligibility: '7.5 CGPA', status: 'Closed' },
];

// --- Company Modal Component ---
const CompanyModal = ({ mode, company, onClose, onSave }) => {
  // Initialize form state based on mode (add vs edit)
  const [formData, setFormData] = useState(
    mode === 'edit' && company
      ? company
      : { name: '', role: '', package: '', eligibility: '', status: 'Pending' }
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-filter backdrop-blur-sm">
      <div className="
        bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg
        p-6 border border-slate-500/30
      ">
        {/* --- Modal Header --- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">
            {mode === 'add' ? 'Add New Company' : 'Edit Company'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Modal Form --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Role / Position</label>
            <input
              type="text"
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label htmlFor="package" className="block text-sm font-medium text-slate-300 mb-1">Package (LPA)</label>
            <input
              type="text"
              name="package"
              id="package"
              value={formData.package}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label htmlFor="eligibility" className="block text-sm font-medium text-slate-300 mb-1">Eligibility Criteria</label>
            <input
              type="text"
              name="eligibility"
              id="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-slate-500/50 bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option>Pending</option>
              <option>Active</option>
              <option>Closed</option>
            </select>
          </div>

          {/* --- Modal Footer --- */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5 py-2.5 rounded-lg font-semibold
                bg-slate-600 text-white
                hover:bg-slate-500 transition-colors
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                px-5 py-2.5 rounded-lg font-semibold
                bg-sky-500 text-white
                hover:bg-sky-400 transition-colors
                shadow-lg hover:shadow-sky-500/40
              "
            >
              {mode === 'add' ? 'Add Company' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  const S_STYLES = {
    Active: 'bg-emerald-500/20 text-emerald-300',
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Closed: 'bg-red-500/20 text-red-300',
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-bold
      ${S_STYLES[status] || 'bg-slate-500/20 text-slate-300'}
    `}>
      {status}
    </span>
  );
};

// --- Main TPO Dashboard Component ---
const App = () => {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCompany, setCurrentCompany] = useState(null);

  // --- Event Handlers ---

  const handleOpenModal = (mode, company = null) => {
    setModalMode(mode);
    setCurrentCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCompany(null);
  };

  const handleSaveCompany = (companyData) => {
    if (modalMode === 'add') {
      // Add new company
      setCompanies([
        ...companies,
        { ...companyData, id: crypto.randomUUID() }
      ]);
    } else {
      // Edit existing company
      setCompanies(
        companies.map(c =>
          c.id === companyData.id ? companyData : c
        )
      );
    }
    handleCloseModal();
  };

  const handleDeleteCompany = (id) => {
    // Note: In a real app, you'd show a confirmation dialog here.
    // Since we're avoiding `confirm()`, we delete directly.
    setCompanies(companies.filter(c => c.id !== id));
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">
            TPO Dashboard
          </h1>
          <button
            onClick={() => handleOpenModal('add')}
            className="
              flex items-center gap-2
              px-5 py-2.5 rounded-lg font-semibold
              bg-sky-500 text-white
              hover:bg-sky-400 transition-all
              shadow-xl hover:shadow-sky-500/40
            "
          >
            <Plus size={18} />
            Add New Company
          </button>
        </div>

        {/* --- Companies Table --- */}
        <div className="
          bg-slate-800/25 backdrop-filter backdrop-blur-lg
          rounded-2xl border border-slate-500/30 shadow-lg
          overflow-hidden
        ">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              {/* --- Table Head --- */}
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">Company</th>
                  <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">Role</th>
                  <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">Package</th>
                  <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">Eligibility</th>
                  <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">Status</th>
                  <th className="p-4 font-semibold text-slate-300 uppercase tracking-wider text-sm">Actions</th>
                </tr>
              </thead>
              {/* --- Table Body --- */}
              <tbody>
                {companies.map(company => (
                  <tr key={company.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                    <td className="p-4 text-slate-100 font-medium">{company.name}</td>
                    <td className="p-4 text-slate-300">{company.role}</td>
                    <td className="p-4 text-slate-300">{company.package}</td>
                    <td className="p-4 text-slate-300">{company.eligibility}</td>
                    <td className="p-4">
                      <StatusBadge status={company.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleOpenModal('edit', company)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- Render Modal --- */}
      {isModalOpen && (
        <CompanyModal
          mode={modalMode}
          company={currentCompany}
          onClose={handleCloseModal}
          onSave={handleSaveCompany}
        />
      )}
    </div>
  );
};

export default App;