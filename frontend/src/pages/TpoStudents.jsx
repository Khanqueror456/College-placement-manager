import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Filter, 
  X, 
  ChevronDown,
  FileText,
  Award,
  Briefcase,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const TpoStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(true);
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [matchType, setMatchType] = useState('any');
  const [department, setDepartment] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [minCGPA, setMinCGPA] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  useEffect(() => {
    fetchAllSkills();
    fetchAllStudents();
  }, []);

  const fetchAllSkills = async () => {
    try {
      const response = await api.get('/tpo/skills/all');
      setAllSkills(response.data.skills || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      toast.error('Failed to load skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tpo/students');
      console.log('Students response:', response.data);
      setStudents(response.data.students || []);
    } catch (err) {
      toast.error('Failed to load students');
      console.error('Failed to fetch students:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterBySkills = async () => {
    if (selectedSkills.length === 0) {
      toast.info('Please select at least one skill to filter');
      return;
    }

    setLoading(true);
    try {
      const params = {
        skills: selectedSkills.join(','),
        matchType,
      };
      
      if (department) params.department = department;
      if (batchYear) params.batchYear = batchYear;
      if (minCGPA) params.minCGPA = minCGPA;

      const response = await api.get('/tpo/students/filter-by-skills', { params });
      setStudents(response.data.students || []);
      toast.success(`Found ${response.data.students.length} student(s) matching criteria`);
    } catch (err) {
      toast.error('Failed to filter students');
      console.error('Failed to filter students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedSkills([]);
    setMatchType('any');
    setDepartment('');
    setBatchYear('');
    setMinCGPA('');
    fetchAllStudents();
  };

  const toggleSkillSelection = (skillName) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
  };

  const removeSkill = (skillName) => {
    setSelectedSkills(prev => prev.filter(s => s !== skillName));
  };

  const getSkillCategoryColor = (category) => {
    const colors = {
      programming_language: 'bg-blue-500',
      framework: 'bg-green-500',
      database: 'bg-purple-500',
      cloud: 'bg-sky-500',
      tool: 'bg-orange-500',
      soft_skill: 'bg-pink-500',
      other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCGPAColor = (cgpa) => {
    const cgpaNum = Number(cgpa);
    if (!cgpaNum || isNaN(cgpaNum)) return 'text-slate-400';
    if (cgpaNum >= 9) return 'text-green-400';
    if (cgpaNum >= 8) return 'text-blue-400';
    if (cgpaNum >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 bg-opacity-50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/tpo-dashboard')}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-300" />
              </button>
              <Users className="w-8 h-8 text-sky-400" />
              <h1 className="text-2xl font-bold text-white">Student Management</h1>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-6 bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Filter Students by Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Selection */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Skills *
                </label>
                
                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-700 bg-opacity-50 rounded-lg">
                    {selectedSkills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500 text-white text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-sky-600 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skill Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <span>{selectedSkills.length > 0 ? `${selectedSkills.length} skill(s) selected` : 'Select skills...'}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showSkillDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showSkillDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-700 rounded-lg shadow-xl border border-slate-600 max-h-96 overflow-y-auto">
                      {loadingSkills ? (
                        <div className="p-4 text-slate-300 text-center">Loading skills...</div>
                      ) : allSkills.length === 0 ? (
                        <div className="p-4 text-slate-300 text-center">No skills found</div>
                      ) : (
                        <>
                          {Object.entries(
                            allSkills.reduce((acc, skill) => {
                              if (!acc[skill.skill_category]) acc[skill.skill_category] = [];
                              acc[skill.skill_category].push(skill);
                              return acc;
                            }, {})
                          ).map(([category, skills]) => (
                            <div key={category} className="border-b border-slate-600 last:border-b-0">
                              <div className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold uppercase">
                                {category.replace(/_/g, ' ')}
                              </div>
                              {skills.map(skill => (
                                <label
                                  key={skill.skill_name}
                                  className="flex items-center justify-between px-4 py-2 hover:bg-slate-600 cursor-pointer"
                                >
                                  <div className="flex items-center space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedSkills.includes(skill.skill_name)}
                                      onChange={() => toggleSkillSelection(skill.skill_name)}
                                      className="w-4 h-4 rounded border-slate-500 text-sky-500 focus:ring-sky-500"
                                    />
                                    <span className="text-white">{skill.skill_name}</span>
                                  </div>
                                  <span className="text-sm text-slate-400">
                                    {skill.student_count} student{skill.student_count !== 1 ? 's' : ''}
                                  </span>
                                </label>
                              ))}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Match Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Match Type
                </label>
                <select
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="any">Any (OR) - Match at least one skill</option>
                  <option value="all">All (AND) - Match all skills</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Department (Optional)
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="">All Departments</option>
                  <option value="CSE">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="EEE">Electrical Engineering</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="CIVIL">Civil Engineering</option>
                </select>
              </div>

              {/* Batch Year */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Batch Year (Optional)
                </label>
                <input
                  type="number"
                  value={batchYear}
                  onChange={(e) => setBatchYear(e.target.value)}
                  placeholder="e.g., 2025"
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Min CGPA */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Minimum CGPA (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCGPA}
                  onChange={(e) => setMinCGPA(e.target.value)}
                  placeholder="e.g., 7.5"
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
              <button
                onClick={handleFilterBySkills}
                disabled={loading || selectedSkills.length === 0}
                className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Filtering...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
              Students {students.length > 0 && `(${students.length})`}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-300">Loading students...</div>
          ) : !students || students.length === 0 ? (
            <div className="p-8 text-center text-slate-300">No students found</div>
          ) : (
            <div className="divide-y divide-slate-700">
              {students.map(student => {
                if (!student || !student.id) return null;
                return (
                <div key={student.id} className="p-6 hover:bg-slate-700 hover:bg-opacity-30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Student Info */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                          <p className="text-sm text-slate-400">{student.email}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Department</p>
                          <p className="text-sm text-white font-medium">{student.department || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Batch Year</p>
                          <p className="text-sm text-white font-medium">{student.batch_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">CGPA</p>
                          <p className={`text-sm font-bold ${getCGPAColor(student.cgpa)}`}>
                            {student.cgpa ? Number(student.cgpa).toFixed(2) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            student.is_approved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {student.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Matched Skills */}
                      {student.matchedSkills && student.matchedSkills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-400 mb-2">
                            <Award className="w-3 h-3 inline mr-1" />
                            Matched Skills ({student.matchedSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {student.matchedSkills.map(skill => (
                              <span
                                key={skill.skill_name}
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getSkillCategoryColor(skill.skill_category)}`}
                              >
                                {skill.skill_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* All Skills */}
                      {student.skills && student.skills.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-400 mb-2">
                            All Skills ({student.skills.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {student.skills.map(skill => (
                              <span
                                key={skill.skill_name}
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getSkillCategoryColor(skill.skill_category)}`}
                              >
                                {skill.skill_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {student.resume_path && (
                        <button
                          onClick={() => {
                            const baseUrl = api.defaults.baseURL.replace('/api', '');
                            window.open(`${baseUrl}/uploads/resumes/${student.resume_path}`, '_blank');
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Resume</span>
                        </button>
                      )}
                      {student.ats_score && (
                        <div className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-center">
                          <p className="text-xs text-white opacity-80">ATS Score</p>
                          <p className="text-lg font-bold text-white">{student.ats_score}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TpoStudents;
