import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheck, 
  Home, 
  Flame, 
  FileEdit, 
  Scale, 
  Calculator, 
  AlertTriangle, 
  Lock, 
  Menu, 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut, 
  School, 
  HelpCircle, 
  Phone, 
  ChevronDown,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { NAV_LINKS_PUBLIC } from '@/utils/constants';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  }, [router.asPath]);

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. DESKTOP STICKY TOP PRIMARY NAVBAR                           */}
      {/* ============================================================== */}
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & Portal Brand */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] p-0.5 shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#1E3A8A] rounded-[10px] flex items-center justify-center p-1.5">
                    <img 
                      src="/images/logo-pemprov-dki.svg" 
                      alt="Logo Resmi DKI Jakarta" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg sm:text-xl text-[#1E3A8A] tracking-tight group-hover:text-blue-700 transition-colors">
                      SMA<span className="text-[#2563EB]">UMU</span>
                    </span>
                    <span className="text-[10px] bg-blue-50 text-[#1E3A8A] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                      RESMI
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide hidden sm:inline">
                    Portal PPDB SMAN DKI Jakarta
                  </span>
                </div>
              </Link>
            </div>

            {/* Main Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold text-slate-700">
              <Link
                href="/"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/')
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                }`}
              >
                Beranda
              </Link>

              <Link
                href="/kuota"
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isActive('/kuota')
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                }`}
              >
                <span>Pantau Kuota</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </Link>

              <Link
                href="/daftar"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/daftar')
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                }`}
              >
                Pendaftaran
              </Link>

              <Link
                href="/simulator"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/simulator')
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                }`}
              >
                Uji Zonasi
              </Link>

              <Link
                href="/whistleblower"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/whistleblower')
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                }`}
              >
                Pengaduan
              </Link>

              <Link
                href="/audit-log"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/audit-log')
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                }`}
              >
                Audit Log
              </Link>

              {/* Dropdown Layanan Informasi */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  onBlur={() => setTimeout(() => setMoreMenuOpen(false), 200)}
                  className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
                    ['/sekolah', '/bantuan', '/kontak'].some(p => router.pathname.startsWith(p))
                      ? 'bg-blue-50 text-[#1E3A8A] font-bold'
                      : 'hover:bg-slate-100 hover:text-[#1E3A8A]'
                  }`}
                >
                  <span>Lainnya</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <Link
                      href="/sekolah"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A] transition"
                    >
                      <School className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-bold">Daftar SMAN</p>
                        <p className="text-[10px] text-slate-400">Profil & radius zonasi</p>
                      </div>
                    </Link>

                    <Link
                      href="/bantuan"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A] transition"
                    >
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-bold">Pusat Bantuan (FAQ)</p>
                        <p className="text-[10px] text-slate-400">Tanya jawab PPDB</p>
                      </div>
                    </Link>

                    <Link
                      href="/kontak"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#1E3A8A] transition"
                    >
                      <Phone className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="font-bold">Posko & Kontak</p>
                        <p className="text-[10px] text-slate-400">Lokasi posko Disdik</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Auth / Admin / Quick Status */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* PPDB Status Badge */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>PPDB 2026: DIBUKA</span>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    {user?.nama || 'Siswa Terdaftar'}
                  </span>
                  <button
                    onClick={logout}
                    title="Keluar"
                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E3A8A] hover:bg-blue-50 transition border border-transparent hover:border-blue-200"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/admin/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-blue-800 text-white shadow-sm shadow-blue-900/20 transition hover:scale-[1.02]"
                  >
                    Admin Disdik
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                aria-label="Buka Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MOBILE DRAWER MENU                                          */}
        {/* ============================================================== */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>PPDB SMAN 2026 Resmi Dibuka</span>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">
                  100% Gratis
                </span>
              </div>

              {/* Navigasi Utama */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                <Link
                  href="/"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Beranda</span>
                </Link>

                <Link
                  href="/kuota"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/kuota') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-4 h-4 text-emerald-500" />
                  <span>Pantau Kuota</span>
                </Link>

                <Link
                  href="/daftar"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/daftar') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <FileEdit className="w-4 h-4" />
                  <span>Pendaftaran</span>
                </Link>

                <Link
                  href="/simulator"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/simulator') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>Uji Zonasi</span>
                </Link>

                <Link
                  href="/whistleblower"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/whistleblower') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Pengaduan</span>
                </Link>

                <Link
                  href="/audit-log"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/audit-log') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Audit Log</span>
                </Link>

                <Link
                  href="/sekolah"
                  className={`p-3 rounded-xl flex items-center gap-2.5 transition ${
                    isActive('/sekolah') ? 'bg-[#1E3A8A] text-white' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <School className="w-4 h-4 text-blue-500" />
                  <span>Daftar SMAN</span>
                </Link>
              </div>

              {/* Tautan Bantuan & Kontak */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <Link href="/bantuan" className="hover:text-[#1E3A8A] font-semibold flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Pusat Bantuan</span>
                </Link>
                <Link href="/kontak" className="hover:text-[#1E3A8A] font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Posko PPDB</span>
                </Link>
                <Link href="/admin/login" className="hover:text-[#1E3A8A] font-semibold text-[#1E3A8A]">
                  Portal Petugas
                </Link>
              </div>

              {/* Login / Auth */}
              <div className="pt-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100">
                    <span className="text-xs font-bold text-slate-800">{user?.nama}</span>
                    <button onClick={logout} className="text-xs font-bold text-red-600">
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="text-center py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700"
                    >
                      Masuk Siswa
                    </Link>
                    <Link
                      href="/admin/login"
                      className="text-center py-2.5 rounded-xl bg-[#1E3A8A] font-bold text-xs text-white"
                    >
                      Login Petugas
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* ============================================================== */}
      {/* 3. MOBILE BOTTOM QUICK NAVIGATION BAR                          */}
      {/* ============================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-lg">
        <div className="flex items-center justify-around text-[10px] font-bold text-slate-600">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 ${
              isActive('/') ? 'text-[#1E3A8A]' : 'hover:text-[#1E3A8A]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Beranda</span>
          </Link>

          <Link
            href="/kuota"
            className={`flex flex-col items-center gap-1 relative ${
              isActive('/kuota') ? 'text-[#1E3A8A]' : 'hover:text-[#1E3A8A]'
            }`}
          >
            <Flame className="w-5 h-5" />
            <span>Kuota</span>
            <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
          </Link>

          <Link
            href="/daftar"
            className={`flex flex-col items-center gap-1 ${
              isActive('/daftar') ? 'text-[#1E3A8A]' : 'hover:text-[#1E3A8A]'
            }`}
          >
            <div className="p-1.5 -mt-3 rounded-full bg-[#1E3A8A] text-white shadow-md">
              <FileEdit className="w-5 h-5" />
            </div>
            <span>Daftar</span>
          </Link>

          <Link
            href="/simulator"
            className={`flex flex-col items-center gap-1 ${
              isActive('/simulator') ? 'text-[#1E3A8A]' : 'hover:text-[#1E3A8A]'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Zonasi</span>
          </Link>

          <Link
            href="/whistleblower"
            className={`flex flex-col items-center gap-1 ${
              isActive('/whistleblower') ? 'text-[#1E3A8A]' : 'hover:text-[#1E3A8A]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span>Aduan</span>
          </Link>
        </div>
      </div>
    </>
  );
}
