'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    techStack: '',
    status: 'planning',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech),
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchProjects();
        setFormData({
          name: '',
          description: '',
          techStack: '',
          status: 'planning',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'in-progress': return 'from-blue-500 to-cyan-500';
      case 'planning': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'planning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Projects Hub</h1>
                <p className="text-gray-400">Manage and track your development projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Projects</div>
                <div className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {projects.length}
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25"
              >
                {showForm ? 'Cancel' : '+ New Project'}
              </button>
            </div>
          </div>
          
          <div className="h-1 w-24 bg-linear-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <div className="mb-8 group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600/30 to-pink-500/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="My Awesome Project"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="planning" className="bg-gray-800">📋 Planning</option>
                      <option value="in-progress" className="bg-gray-800">🚀 In Progress</option>
                      <option value="completed" className="bg-gray-800">✅ Completed</option>
                      <option value="paused" className="bg-gray-800">⏸️ Paused</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Describe your project goals, features, and milestones..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.techStack}
                      onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                      placeholder="React, Node.js, MongoDB, Tailwind CSS"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Add technologies used in this project
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-gray-600 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-gray-500">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Start by creating your first project to track your development work
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Create Your First Project
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-linear-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-xl p-6">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {projects.filter(p => p.status === 'in-progress').length}
                </div>
                <div className="text-sm font-medium text-blue-300">In Progress</div>
              </div>
              <div className="bg-linear-to-br from-green-900/20 to-green-800/10 border border-green-800/30 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm font-medium text-green-300">Completed</div>
              </div>
              <div className="bg-linear-to-br from-gray-800/20 to-gray-900/10 border border-gray-700/30 rounded-xl p-6">
                <div className="text-2xl font-bold text-gray-300 mb-1">
                  {projects.length}
                </div>
                <div className="text-sm font-medium text-gray-400">Total Projects</div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="group relative">
                  <div className={`absolute -inset-0.5 bg-linear-to-r ${getStatusColor(project.status)} rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500`}></div>
                  <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-linear-to-r from-purple-400 to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                          {project.name}
                        </h3>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 rounded-lg bg-linear-to-r from-red-900/20 to-red-800/10 border border-red-800/30 text-red-400 hover:border-red-500/50 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete project"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-linear-to-r ${getStatusColor(project.status)}/10 ${getStatusText(project.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 bg-linear-to-r ${getStatusColor(project.status)}`}></span>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.description || 'No description provided'}
                      </p>
                      
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.slice(0, 3).map((tech) => (
                              <span key={tech} className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded">
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-500 rounded">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {project.estimatedHours || 0}h
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 py-3 bg-gray-900/30 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Last updated recently</span>
                        <button className="text-xs font-medium bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}