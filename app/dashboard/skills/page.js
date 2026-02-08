'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
 Tooltip,
  Legend,
  ArcElement
);

export default function SkillsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    level: 5,
    category: 'frontend',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    
    if (status === 'authenticated') {
      fetchSkills();
    }
  }, [status, router]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSkills();
        setFormData({
          name: '',
          level: 5,
          category: 'frontend',
        });
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category || 'frontend',
    });
    setEditingId(skill._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSkills();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: '',
      level: 5,
      category: 'frontend',
    });
    setEditingId(null);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    const categories = ['frontend', 'backend', 'database', 'devops', 'other'];
    const categoryCounts = {};
    const levelData = skills.slice(0, 10);
    
    categories.forEach(cat => {
      categoryCounts[cat] = skills.filter(s => s.category === cat).length;
    });

    // Bar chart data with dark theme
    const barChartData = {
      labels: levelData.map(skill => skill.name),
      datasets: [
        {
          label: 'Skill Level',
          data: levelData.map(skill => skill.level),
          backgroundColor: 'rgba(168, 85, 247, 0.6)',
          borderColor: 'rgb(168, 85, 247)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };

    // Doughnut chart data with aesthetic colors
    const doughnutChartData = {
      labels: categories,
      datasets: [
        {
          data: categories.map(cat => categoryCounts[cat]),
          backgroundColor: [
            'rgba(139, 92, 246, 0.8)',
            'rgba(14, 165, 233, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderColor: [
            'rgba(139, 92, 246, 1)',
            'rgba(14, 165, 233, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(236, 72, 153, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    return { barChartData, doughnutChartData };
  };

  const { barChartData, doughnutChartData } = prepareChartData();

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            family: "'Inter', sans-serif",
          }
        },
      },
      title: {
        display: true,
        text: 'Top Skills by Level',
        color: '#f3f4f6',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: '600',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
      },
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            family: "'Inter', sans-serif",
          }
        },
      },
      title: {
        display: true,
        text: 'Skills by Category',
        color: '#f3f4f6',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: '600',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-linear-to-br from-gray-900 to-gray-950">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading skills...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-linear-to-br from-gray-900 to-gray-950">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-linear-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Skills Tracker
        </h1>
        <div className="text-sm text-gray-400 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
          Total Skills: <span className="font-semibold text-purple-400 ml-1">{skills.length}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-colors">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{skills.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Skills</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-emerald-500/50 transition-colors">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {skills.filter(s => s.level >= 7).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Advanced (7+)</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-amber-500/50 transition-colors">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">
              {skills.filter(s => s.level >= 4 && s.level <= 6).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Intermediate (4-6)</div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-rose-500/50 transition-colors">
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400">
              {skills.filter(s => s.level <= 3).length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Beginner (1-3)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Skill Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                  placeholder="e.g., React, Node.js, MongoDB"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="frontend" className="bg-gray-800">Frontend</option>
                  <option value="backend" className="bg-gray-800">Backend</option>
                  <option value="database" className="bg-gray-800">Database</option>
                  <option value="devops" className="bg-gray-800">DevOps</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Level: <span className="font-bold text-purple-400 ml-1">{formData.level}/10</span>
                  </label>
                  <div className="text-sm text-gray-400">
                    {formData.level <= 3 ? 'Beginner' : 
                     formData.level <= 6 ? 'Intermediate' : 'Advanced'}
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-dark"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 (Basic)</span>
                  <span>5 (Good)</span>
                  <span>10 (Expert)</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                >
                  {editingId ? 'Update Skill' : 'Add Skill'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-700 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Skills List & Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Charts */}
          {skills.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <Bar options={barChartOptions} data={barChartData} />
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
              </div>
            </div>
          )}

          {/* Skills List */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-200">My Skills</h2>
              <p className="text-sm text-gray-400 mt-1">
                Track and manage your technical skills
              </p>
            </div>
            
            {skills.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No skills yet</h3>
                <p className="text-gray-400 mb-4">
                  Add your first skill to start tracking your progress
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {skills.map((skill) => (
                  <div key={skill._id} className="px-6 py-4 hover:bg-gray-800/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-200">{skill.name}</h3>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              skill.category === 'frontend' ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50' :
                              skill.category === 'backend' ? 'bg-cyan-900/30 text-cyan-300 border border-cyan-700/50' :
                              skill.category === 'database' ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50' :
                              skill.category === 'devops' ? 'bg-amber-900/30 text-amber-300 border border-amber-700/50' :
                              'bg-gray-700 text-gray-300 border border-gray-600'
                            }`}>
                              {skill.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-400">
                              {skill.level}/10
                            </div>
                            <div className="text-sm text-gray-400">
                              {skill.level <= 3 ? 'Beginner' : 
                               skill.level <= 6 ? 'Intermediate' : 'Advanced'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="font-medium text-gray-300">{skill.level * 10}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                skill.level <= 3 ? 'bg-linear-to-r from-rose-500 to-rose-600' :
                                skill.level <= 6 ? 'bg-linear-to-r from-amber-500 to-amber-600' :
                                'bg-linear-to-r from-emerald-500 to-emerald-600'
                              }`}
                              style={{ width: `${skill.level * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Updated: {new Date(skill.lastUpdated).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-purple-400 hover:text-purple-300 p-2 rounded-md hover:bg-purple-900/30 transition-colors border border-purple-700/30 hover:border-purple-600/50"
                          title="Edit skill"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="text-rose-400 hover:text-rose-300 p-2 rounded-md hover:bg-rose-900/30 transition-colors border border-rose-700/30 hover:border-rose-600/50"
                          title="Delete skill"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {skills.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/20">
                <div className="text-sm text-gray-400">
                  Showing {skills.length} skill{skills.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}