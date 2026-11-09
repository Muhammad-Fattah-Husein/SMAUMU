import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheck, 
  Home, 
  Flame, 
  FileEdit, 
  Search, 
  Calculator, 
  AlertTriangle, 
  Lock, 
  ChevronRight, 
  Menu, 
  X, 
  Compass, 
  ArrowRight,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Ticket
} from 'lucide-react';
import { NAV_LINKS_PUBLIC } from '@/utils/constants';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLinkIcon = (href, isActive) => {
    const iconClass = `w-5 h-5 transition-transform group-hover:scale-110 ${
      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
    }`;
    switch (href) {
      case '/': return <Home className={iconClass} />;
      case '/kuota': return <Flame className={iconClass} />;
      case '/daftar': return <FileEdit className={iconClass} />;
      case '/lacak': return <Search className={iconClass} />;
      case '/simulator': return <Calculator className={iconClass} />;
      case '/whistleblower': return <AlertTriangle className={iconClass} />;
      case '/audit-log': return <Lock className={iconClass} />;
      default: return <Compass className={iconClass} />;
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. DESKTOP FLOATING SIDE NAVBAR */}
      {/* ============================================================== */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col justify-between transition-all duration-300 ease-out bg-[#1E3A8A]/95 backdrop-blur-xl border border-white/15 shadow-2xl rounded-3xl py-5 px-3.5 ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Logo & Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-white/5 transition-colors group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/40 group-hover:rotate-6 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {isExpanded && (
              <div className="min-w-0 animate-fade-in overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">SMAUMU</span>
                  <span className="text-[9px] bg-white/10 text-white font-bold px-1.5 py-0.2 rounded border border-white/20">
                    UntukMu
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate">Portal Transparansi SMAN</p>
              </div>
            )}
          </Link>

          {/* Garis Pembatas */}
          <div className="my-3 border-t border-white/15"></div>

          {/* Daftar Menu */}
          <nav className="space-y-1">
            {NAV_LINKS_PUBLIC.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={!isExpanded ? link.label : undefined}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-white/15 text-white shadow-lg font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="shrink-0">
                    {getLinkIcon(link.href, isActive)}
                  </div>

                  {isExpanded && (
                    <div className="min-w-0 flex-1 animate-fade-in text-left">
                      <p className="truncate text-xs font-bold leading-tight">{link.label}</p>
                      <p className={`text-[10px] truncate mt-0.5 leading-none ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        {link.desc}
                      </p>
                    </div>
                  )}

                  {/* Tooltip Melayang (Collapsed Mode) */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-semibold rounded-xl shadow-xl border border-white/15 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      <p className="font-bold text-white">{link.label}</p>
                      <p className="text-[10px] text-slate-300 font-normal">{link.desc}</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah: Profil Pengguna & Autentikasi */}
        <div className="pt-3 border-t border-white/15 space-y-2">
          {isAuthenticated ? (
            /* Logged in state */
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-2xl bg-white/10 border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                </div>
                {isExpanded && (
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-bold text-xs text-white truncate">{user.nama}</p>
                    <span className="text-[9px] text-emerald-300 font-semibold block truncate">
                      {isAdmin ? 'Petugas Instansi' : 'Calon Siswa Baru'}
                    </span>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  {user.nomor_tiket && !isAdmin && (
                    <Link
                      href={`/lacak?tiket=${encodeURIComponent(user.nomor_tiket)}`}
                      className="flex-1 py-1 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold text-center truncate flex items-center justify-center gap-1"
                    >
                      <Ticket className="w-3 h-3 text-pink-300" />
                      <span>Tiket Saya</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="flex-1 py-1 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold text-center truncate"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    title="Keluar Akun"
                    className="p-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest / Not logged in state */
            <div className="space-y-1.5">
              <Link
                href="/register"
                title={!isExpanded ? 'Daftar Calon Siswa' : undefined}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-xs shadow-md transition group"
              >
                <UserPlus className="w-4 h-4 shrink-0 text-white" />
                {isExpanded && <span className="truncate">Daftar Akun</span>}
              </Link>

              <Link
                href="/login"
                title={!isExpanded ? 'Masuk Akun' : undefined}
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition group"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                {isExpanded && <span className="truncate text-[11px]">Masuk</span>}
              </Link>
            </div>
          )}

          {/* Akses Petugas Dinas */}
          {!isAdmin && isExpanded && (
            <Link
              href="/admin/login"
              className="block text-center text-[10px] text-slate-300 hover:text-white py-1 transition"
            >
              Portal Petugas Instansi →
            </Link>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MOBILE TOP BANNER & FLOATING BOTTOM DOCK */}
      {/* ============================================================== */}
      {/* Header Kecil di Atas Layar untuk HP */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#1E3A8A]/95 backdrop-blur-md border-b border-white/15 px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-sm text-white">SMAUMU</span>
            <span className="text-[9px] text-slate-300 block -mt-0.5">SMAN UntukMu • WIA 2026</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <span className="px-2.5 py-1 rounded-xl bg-white/15 text-white text-xs font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-pink-300" />
              <span className="max-w-[80px] truncate">{user.nama?.split(' ')[0]}</span>
            </span>
          ) : (
            <Link
              href="/login"
              className="px-2.5 py-1 rounded-xl bg-white/10 text-white text-xs font-bold"
            >
              Masuk
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Bottom Dock untuk Akses Cepat di HP */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50 bg-[#1E3A8A]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl px-2 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] ${
            router.pathname === '/' ? 'text-white font-bold' : 'text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </Link>
        <Link
          href="/kuota"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] ${
            router.pathname === '/kuota' ? 'text-white font-bold' : 'text-slate-300'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Sisa Kursi</span>
        </Link>
        <Link
          href={isAuthenticated ? "/daftar" : "/register"}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-[10px] -mt-5 shadow-lg shadow-pink-500/30"
        >
          <FileEdit className="w-5 h-5" />
          <span>{isAuthenticated ? 'Formulir' : 'Daftar'}</span>
        </Link>
        <Link
          href="/lacak"
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] ${
            router.pathname === '/lacak' ? 'text-white font-bold' : 'text-slate-300'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Lacak</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] text-slate-300"
        >
          <Menu className="w-5 h-5" />
          <span>Lainnya</span>
        </button>
      </div>

      {/* Drawer Menu Lengkap di HP */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#1E3A8A] rounded-t-3xl border-t border-white/15 p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div>
                <h3 className="font-extrabold text-base text-white">Menu Layanan Publik</h3>
                <p className="text-xs text-slate-300">Pilih menu transparansi atau masuk akun:</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User status card in mobile drawer */}
            {isAuthenticated ? (
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EC4899] text-white flex items-center justify-center font-bold">
                    {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{user.nama}</p>
                    <p className="text-[10px] text-slate-300">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-200 text-xs font-bold"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-[#EC4899] text-white text-center font-bold text-xs shadow-md"
                >
                  Daftar Calon Siswa
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/10 border border-white/15 text-white text-center font-bold text-xs"
                >
                  Masuk Akun
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {NAV_LINKS_PUBLIC.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                    router.pathname === link.href
                      ? 'bg-white/15 border-white/30 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-200'
                  }`}
                >
                  {getLinkIcon(link.href, router.pathname === link.href)}
                  <div>
                    <p className="font-bold text-sm leading-tight">{link.label}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/15 flex justify-between items-center text-xs">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white font-semibold flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" /> Masuk Portal Petugas Dinas
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
