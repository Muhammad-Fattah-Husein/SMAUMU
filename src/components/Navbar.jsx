import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  LogIn,
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';

/**
 * Minimalist Floating Navbar for SMAUMU
 * Adapts dynamically:
 * - In Student Portal (/student): 3 Sections -> Pendaftaran, Status Pendaftaran, Informasi Akun.
 * - In Admin Portal: Beranda, Dashboard Admin, Logout.
 * - In Public Portal: Beranda, Portal Siswa, Masuk.
 */
export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/');
    }
  };

  const isHome = location.pathname === '/';
  const isStudentPortal = location.pathname.startsWith('/student') || 
                          location.pathname.startsWith('/pendaftaran');
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                       location.pathname.startsWith('/login-admin');
  const isLogin = location.pathname.startsWith('/login');

  const demoStudent = !isAuthenticated ? (() => {
    try {
      return JSON.parse(localStorage.getItem('smaumu_demo_student') || 'null');
    } catch {
      return null;
    }
  })() : null;

  const effectiveRole = user?.user_metadata?.role || demoStudent?.user_metadata?.role;
  const isStudentUser = (isAuthenticated && effectiveRole === 'student') || Boolean(demoStudent);
  const isAdminUser = isAuthenticated && effectiveRole !== 'student';

  // Read active tab for student dashboard (pendaftaran | status | akun)
  const searchParams = new URLSearchParams(location.search);
  const activeStudentTab = searchParams.get('tab') || 'pendaftaran';

  return (
    <nav
      id="floating-navbar"
      aria-label="Navigasi Utama"
      className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-4xl bg-white/75 backdrop-blur-lg border border-gray-100 rounded-full shadow-sm hover:shadow-md transition-all duration-300 z-50 px-3 sm:px-6 py-2.5 sm:py-3 font-body"
    >
      <div className="flex items-center justify-between">
        
        {/* Brand Logo (SMAUMU) on the left */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full flex-shrink-0"
          title="SMAUMU - Sistem Informasi Kuota SMAN"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <span className="font-heading font-black text-base sm:text-xl tracking-tight text-primary group-hover:text-primary-hover transition-colors">
              SMAUMU
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-amber-900 border border-accent/40 leading-none">
              PPDB
            </span>
          </div>
        </Link>

        {/* Top Navbar navigation links */}
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          
          {/* 1. Beranda */}
          <Link
            to="/"
            className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full font-heading font-bold transition-all duration-200 ${
              isHome
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'text-gray-700 hover:text-primary hover:bg-gray-100/70'
            }`}
          >
            <Home className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Beranda</span>
          </Link>

          {/* 2. Portal Siswa (Tampil untuk siswa & publik; disembunyikan untuk admin) */}
          {!isAdminUser && (
            <Link
              to="/student"
              className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full font-heading font-bold transition-all duration-200 ${
                isStudentPortal
                  ? 'bg-primary text-white shadow-sm shadow-primary/25'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100/70'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 hidden sm:inline" />
              <span>Portal Siswa</span>
            </Link>
          )}

          {/* 3. Dashboard Admin (Hanya untuk Admin / Bukan Siswa) */}
          {isAdminUser && (
            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full font-heading font-bold transition-all duration-200 ${
                isAdminRoute
                  ? 'bg-primary text-white shadow-sm shadow-primary/25'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100/70'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="hidden md:inline">Dashboard</span>
              <span>Admin</span>
            </Link>
          )}

          {/* 4. Masuk vs Logout */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                {user?.user_metadata?.role === 'student' ? '🎓 Siswa' : '🛡️ Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-full font-heading font-bold text-gray-600 hover:text-primary hover:bg-red-50/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                title={`Keluar (${user?.email || 'Akun'})`}
              >
                <LogOut className="w-3.5 h-3.5 text-primary" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-full font-heading font-bold transition-all duration-200 ${
                isLogin
                  ? 'bg-primary text-white shadow-sm shadow-primary/25'
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100/70'
              }`}
              title="Masuk ke Akun Calon Siswa atau Petugas Admin"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
};

export const TopNavbar = Navbar;
export default Navbar;

