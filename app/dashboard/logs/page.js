'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LogForm from '@/components/Forms/LogForm';

export default function LogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [logsRes, projectsRes] = await Promise.all([
        fetch('/api/logs'),
        fetch('/api/projects'),
      ]);
      
      const logsData = await logsRes.json();
      const projectsData = await projectsRes.json();
      
      setLogs(logsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    
    try {
      const response = await fetch(`/api/logs/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setLogs(logs.filter(log => log._id !== id));
        if (selectedLog && selectedLog._id === id) {
          setSelectedLog(null);
        }
      }
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your logs...</p>
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
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Coding Logs</h1>
                <p className="text-gray-400">Track and manage your development sessions</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Logs</div>
              <div className="text-2xl font-bold bg-linear
              -to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {logs.length}
              </div>
            </div>
          </div>
          
          <div className="h-1 w-24 bg-linear
          -to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-1">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-linear
              -to-r from-blue-600/30 to-cyan-500/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {selectedLog ? 'Edit Log' : 'Add New Log'}
                  </h2>
                  {selectedLog && (
                    <button
                      onClick={() => setSelectedLog(null)}
                      className="px-3 py-1 text-sm bg-linear
                      -to-r from-gray-800 to-gray-900 text-gray-300 rounded-lg border border-gray-700 hover:border-red-500/50 hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                
                <LogForm 
                  initialData={selectedLog} 
                  projects={projects} 
                  onSuccess={() => {
                    fetchData();
                    setSelectedLog(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="lg:col-span-2">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-linear
              -to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    <div className="flex items-center space-x-3">
                      {selectedLog && (
                        <button
                          onClick={() => setSelectedLog(null)}
                          className="px-3 py-1 text-sm bg-linear
                          -to-r from-gray-800 to-gray-900 text-blue-400 rounded-lg border border-blue-800/30 hover:border-blue-500/50 transition-colors"
                        >
                          Clear Selection
                        </button>
                      )}
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-800">
                  {logs.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div className="w-20 h-20 bg-linear-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl text-gray-500">📝</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No logs yet</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Start by adding your first coding log to track your development sessions
                      </p>
                      <div className="h-1 w-32 bg-linear
                      -to-r from-blue-500 to-cyan-500 rounded-full mx-auto"></div>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div 
                        key={log._id} 
                        className={`p-6 hover:bg-gray-800/30 transition-all duration-300 cursor-pointer ${
                          selectedLog?._id === log._id ? 'bg-blue-900/10 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-4">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {log.description}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                {log.hours}h
                              </span>
                              
                              {log.project && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400">
                                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                  {log.project.name}
                                </span>
                              )}
                              
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                log.mood === 'productive' ? 'bg-green-500/10 text-green-400' :
                                log.mood === 'excited' ? 'bg-yellow-500/10 text-yellow-400' :
                                log.mood === 'focused' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-gray-500/10 text-gray-400'
                              }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                  log.mood === 'productive' ? 'bg-green-400' :
                                  log.mood === 'excited' ? 'bg-yellow-400' :
                                  log.mood === 'focused' ? 'bg-blue-400' :
                                  'bg-gray-400'
                                }`}></span>
                                {log.mood}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-400 mb-3">
                              {new Date(log.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            
                            {log.tags && log.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {log.tags.map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLog(log);
                              }}
                              className="p-2 rounded-lg bg-linear
                              -to-r from-blue-900/20 to-blue-800/10 border border-blue-800/30 text-blue-400 hover:border-blue-500/50 hover:text-blue-300 transition-all"
                              title="Edit log"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(log._id);
                              }}
                              className="p-2 rounded-lg bg-linear
                              -to-r from-red-900/20 to-red-800/10 border border-red-800/30 text-red-400 hover:border-red-500/50 hover:text-red-300 transition-all"
                              title="Delete log"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {logs.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/30">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Showing <span className="font-semibold text-white">{logs.length}</span> log{logs.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-xs text-gray-500">Last updated: Just now</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}