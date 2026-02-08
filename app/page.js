import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-linear-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-linear-to-r from-cyan-500/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-linear-to-r from-violet-500/10 to-fuchsia-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-70"></div>
            <div className="relative w-20 h-20 bg-linear-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl font-bold text-white">DL</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-center mb-4">
            <span className="block text-white">DevLogger</span>
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Track. Build. Grow.
            </span>
          </h1>
          <p className="text-xl text-gray-400 text-center max-w-2xl">
            Your personal dashboard for tracking coding activities, managing projects, 
            and visualizing developer growth.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <div className="inline-flex p-4 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-xl mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Logs</h3>
              <p className="text-gray-400 mb-4">Track hours, productivity patterns, and daily achievements with intelligent insights.</p>
              <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <div className="inline-flex p-4 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Project Hub</h3>
              <p className="text-gray-400 mb-4">Organize, track progress, and visualize milestones across all your development projects.</p>
              <div className="h-1 w-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-600 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <div className="inline-flex p-4 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-xl mb-6">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Growth Analytics</h3>
              <p className="text-gray-400 mb-4">Visualize skill progression, productivity trends, and growth patterns with beautiful charts.</p>
              <div className="h-1 w-16 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
            <Link
              href="/auth/register"
              className="group relative px-12 py-4 text-lg font-semibold rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-500"></div>
              <div className="absolute inset-0.5 bg-gray-950 rounded-2xl"></div>
              <span className="relative bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                Start Free Journey →
              </span>
            </Link>
            
            <Link
              href="/auth/login"
              className="px-8 py-4 border border-gray-700 text-gray-300 text-lg font-medium rounded-2xl hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all duration-300"
            >
              Existing Account
            </Link>
          </div>
          
          <p className="mt-8 text-gray-500 text-sm">
            Join thousands of developers tracking their growth journey
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="absolute top-10 left-10 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
    </div>
  );
}