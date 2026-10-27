import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-smaumu-surface/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm transition-all font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-smaumu-primary flex items-center justify-center text-white shadow-md shadow-smaumu-primary/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-smaumu-primary">
                  SMAUMU
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-smaumu-accent/40">
                  <span className="w-2 h-2 rounded-full bg-smaumu-accent mr-1.5 animate-ping"></span>
                  Live PPDB
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block font-medium">
                SMA UntukMu &bull; Transparansi Kuota Siswa Kelas 9 Nasional
              </p>
            </div>
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-smaumu-primary hover:bg-gray-100 transition-colors"
            >
              Beranda Publik
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to="/admin"
                  className="font-heading inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 transition-colors shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5 text-smaumu-primary" />
                  Dashboard Sekolah
                </Link>

                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-600 hidden md:inline">
                    {user?.assignedSchool?.name || user?.email || user?.name || user?.username || 'Admin SMAN'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-bold text-smaumu-primary hover:bg-red-50 transition-colors"
                    title="Keluar dari akun admin"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="font-heading inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold text-white bg-smaumu-primary hover:bg-[#B30F20] shadow-md shadow-smaumu-primary/20 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4 mr-2 text-smaumu-accent" />
                Login Admin SMAN
              </Link>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
};
