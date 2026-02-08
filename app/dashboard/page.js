import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Log from '@/lib/models/Log';
import Project from '@/lib/models/Project';
import Skill from '@/lib/models/Skill';
import StatsCard from '@/components/Dashboard/StatsCard';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();

  // Fetch data
  const [logs, projects, skills] = await Promise.all([
    Log.find({ user: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .populate('project'),
    Project.find({ user: session.user.id }),
    Skill.find({ user: session.user.id }),
  ]);

  // Calculate stats
  const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const avgSkillLevel = skills.length > 0 
    ? (skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">👋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back, <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{session.user?.name}</span>!
              </h1>
              <p className="text-gray-400 mt-2">Here's your developer activity overview</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏱️</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{totalHours}h</div>
              <div className="text-sm font-medium text-gray-300">Total Hours</div>
              <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full mt-3"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{activeProjects}</div>
              <div className="text-sm font-medium text-gray-300">Active Projects</div>
              <div className="h-1 w-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mt-3"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-600 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{skills.length}</div>
              <div className="text-sm font-medium text-gray-300">Skills Tracked</div>
              <div className="h-1 w-16 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full mt-3"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-orange-600 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{logs.length}</div>
              <div className="text-sm font-medium text-gray-300">Recent Logs</div>
              <div className="h-1 w-16 bg-linear-to-r from-orange-500 to-red-500 rounded-full mt-3"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Logs */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                <Link 
                  href="/dashboard/logs"
                  className="text-sm font-medium bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition"
                >
                  View all →
                </Link>
              </div>
              
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-gray-500">📝</span>
                  </div>
                  <p className="text-gray-400">No logs yet</p>
                  <p className="text-gray-500 text-sm mt-1">Start tracking your coding sessions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log._id} className="p-4 bg-gray-800/30 rounded-xl border border-gray-800 hover:border-blue-500/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-white font-medium truncate">{log.description}</p>
                          <div className="flex items-center mt-2 space-x-3">
                            <span className="text-sm px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg">
                              {log.hours}h
                            </span>
                            <span className="text-sm text-gray-400">
                              {new Date(log.date).toLocaleDateString()}
                            </span>
                            {log.project && (
                              <span className="text-sm px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg">
                                {log.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-lg ${
                          log.mood === 'productive' ? 'text-green-400' :
                          log.mood === 'excited' ? 'text-yellow-400' :
                          log.mood === 'focused' ? 'text-blue-400' :
                          'text-gray-400'
                        }`}>
                          {log.mood === 'productive' ? '🚀' :
                           log.mood === 'excited' ? '🎉' :
                           log.mood === 'focused' ? '🎯' :
                           log.mood === 'stuck' ? '🤔' : '😴'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <Link
                  href="/dashboard/logs"
                  className="group/action flex items-center justify-between p-4 bg-linear-to-r from-blue-900/20 to-blue-800/10 rounded-xl border border-blue-800/30 hover:border-blue-500/50 hover:from-blue-900/30 hover:to-blue-800/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                      <span className="text-lg">➕</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Add Today's Log</div>
                      <div className="text-sm text-gray-400">Track your coding session</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-blue-400 group-hover/action:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link
                  href="/dashboard/projects"
                  className="group/action flex items-center justify-between p-4 bg-linear-to-r from-purple-900/20 to-purple-800/10 rounded-xl border border-purple-800/30 hover:border-purple-500/50 hover:from-purple-900/30 hover:to-purple-800/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🚀</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Start New Project</div>
                      <div className="text-sm text-gray-400">Begin tracking work</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-purple-400 group-hover/action:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link
                  href="/dashboard/skills"
                  className="group/action flex items-center justify-between p-4 bg-linear-to-r from-emerald-900/20 to-emerald-800/10 rounded-xl border border-emerald-800/30 hover:border-emerald-500/50 hover:from-emerald-900/30 hover:to-emerald-800/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📈</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Update Skills</div>
                      <div className="text-sm text-gray-400">Track your progress</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-emerald-400 group-hover/action:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Stats Summary */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{completedProjects}</div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{avgSkillLevel}/10</div>
                    <div className="text-sm text-gray-400">Avg Skill Level</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}