'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl blur group-hover:blur-md transition duration-300"></div>
              <div className="relative w-10 h-10 bg-linear-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">DL</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DevLogger
              </span>
              <div className="h-0.5 w-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/dashboard" icon="📊" text="Dashboard" />
              <NavLink href="/dashboard/logs" icon="📝" text="Logs" />
              <NavLink href="/dashboard/projects" icon="🚀" text="Projects" />
              <NavLink href="/dashboard/skills" icon="📈" text="Skills" />
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* User Profile */}
                <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-800">
                  <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">Developer</p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut()}
                  className="hidden md:inline-flex items-center px-5 py-2.5 bg-linear-to-r from-gray-800 to-gray-900 text-gray-300 font-medium rounded-xl border border-gray-700 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <span>Sign Out</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 font-medium rounded-xl hover:border-blue-500 hover:text-white hover:bg-blue-500/10 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && session && (
          <div className="md:hidden bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 mt-4 p-4 animate-fade-in">
            <div className="space-y-2">
              <MobileNavLink href="/dashboard" icon="📊" text="Dashboard" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/dashboard/logs" icon="📝" text="Logs" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/dashboard/projects" icon="🚀" text="Projects" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/dashboard/skills" icon="📈" text="Skills" onClick={() => setIsMenuOpen(false)} />
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => signOut()}
                  className="w-full px-4 py-3 bg-linear-to-r from-gray-800 to-gray-900 text-red-400 font-medium rounded-xl border border-gray-700 hover:border-red-500/50 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Helper Components
function NavLink({ href, icon, text }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-900/50 rounded-xl transition-all duration-300 group"
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{text}</span>
      <div className="h-0.5 w-0 group-hover:w-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"></div>
    </Link>
  );
}

function MobileNavLink({ href, icon, text, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );
}