import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  FileText,
  UserCheck,
  ShieldCheck,
  Info
} from 'lucide-react';

/**
 * Floating Hover Side Navigation for Student Dashboard
 * - Exclusively visible inside protected student routes (/student/*).
 * - Desktop: Floating glassmorphic card on the left with hover elevation.
 * - Mobile & Tablet: Sleek floating bottom pill navbar.
 */
export const StudentSideNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Student identification info with fallback
  const studentFullName = user?.user_metadata?.full_name || 'Muhammad Fattah Husein';
  const studentNisn = user?.user_metadata?.nisn || '1351515315';
  const studentInitial = studentFullName.charAt(0).toUpperCase();

  const navItems = [
    {
      to: '/student/info',
      label: 'Status Pendaftaran',
      sublabel: 'Pantau Hasil Seleksi',
      icon: Clock,
      badge: 'Live',
    },
    {
      to: '/student/register-school',
      label: 'Pendaftaran SMAN',
      sublabel: 'Formulir & Berkas',
      icon: FileText,
      badge: 'PPDB 2026',
    },
    {
      to: '/student/profile',
      label: 'Informasi Akun',
      sublabel: 'Data NISN & Dapodik',
      icon: UserCheck,
      badge: null,
    },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. FLOATING HOVER SIDE NAVBAR (DESKTOP) */}
      {/* ========================================================= */}
      <aside
        id="student-floating-side-nav"
        aria-label="Navigasi Samping Siswa"
        className="hidden lg:flex fixed left-5 xl:left-8 top-28 bottom-8 z-40 w-64 bg-white/90 backdrop-blur-xl border border-gray-200/90 rounded-3xl p-5 shadow-xl shadow-gray-200/40 flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-primary/20 group"
      >
        <div className="space-y-6">
          {/* Student Profile Snapshot Banner */}
          <div className="p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/80 space-y-2.5 transition-colors group-hover:bg-red-50/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white font-heading font-black text-base flex items-center justify-center shadow-sm shadow-primary/25">
                {studentInitial}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-heading font-bold text-xs text-gray-900 truncate" title={studentFullName}>
                  {studentFullName}
                </h4>
                <p className="text-[11px] font-mono text-primary font-bold">
                  NISN: {studentNisn}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[10px]">
              <span className="text-gray-500 font-medium flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                Status Akun:
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Terverifikasi
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-heading block px-1">
              Menu Portal Siswa
            </span>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || 
                  (item.to === '/student/info' && (location.pathname === '/student' || location.pathname === '/student/'));

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive: linkActive }) => {
                      const active = linkActive || isActive;
                      return `w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left group/item ${
                        active
                          ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]'
                          : 'bg-white hover:bg-red-50/40 text-gray-700 border border-gray-100 hover:border-primary/20'
                      }`;
                    }}
                  >
                    {({ isActive: linkActive }) => {
                      const active = linkActive || isActive;
                      return (
                        <>
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-gray-100 text-gray-600 group-hover/item:text-primary group-hover/item:bg-white'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-heading font-bold text-xs block leading-tight">
                                {item.label}
                              </span>
                              <span
                                className={`text-[10px] block ${
                                  active ? 'text-white/80' : 'text-gray-400'
                                }`}
                              >
                                {item.sublabel}
                              </span>
                            </div>
                          </div>

                          {item.badge && (
                            <span
                              className={`text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-md ${
                                active
                                  ? 'bg-white/25 text-white'
                                  : 'bg-accent/20 text-amber-900 border border-accent/40'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      );
                    }}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Policy Info in Side Navbar */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-accent/40 text-[11px] text-amber-950 space-y-1">
          <div className="flex items-center font-heading font-bold text-amber-900">
            <Info className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
            <span>Regulasi PPDB 2026:</span>
          </div>
          <p className="text-[10px] leading-relaxed text-amber-900/90">
            1 Siswa hanya dapat mendaftar 1 kali ke 1 sekolah pilihan resmi.
          </p>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. FLOATING BOTTOM PILL NAVBAR (MOBILE & TABLET) */}
      {/* ========================================================= */}
      <nav
        id="student-floating-mobile-nav"
        aria-label="Navigasi Siswa Mobile"
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-full p-1.5 shadow-2xl flex items-center justify-around"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
            (item.to === '/student/info' && (location.pathname === '/student' || location.pathname === '/student/'));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: linkActive }) => {
                const active = linkActive || isActive;
                return `flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-heading font-bold transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'text-gray-600 hover:text-gray-900'
                }`;
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default StudentSideNav;

