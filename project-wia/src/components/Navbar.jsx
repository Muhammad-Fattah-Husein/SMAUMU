import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Flame, 
  FileEdit, 
  Search, 
  Calculator, 
  AlertTriangle, 
  Lock, 
  Menu, 
  X, 
  Compass, 
  User,
  LogIn,
  UserPlus,
  LogOut,
  Ticket
} from 'lucide-react';
import { NAV_LINKS_PUBLIC } from '@/utils/constants';
import CommandPalette from '@/components/ui/CommandPalette';
import ThemeToggle from './ThemeToggle';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const leaveTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
      leaveTimerRef.current = null;
    }, 90);
  };

  const getLinkIcon = (href, isActive) => {
    const iconClass = `w-5 h-5 transition-colors ${
      isActive ? 'text-[#F97316]' : 'text-slate-400 group-hover:text-[#E2E8F0]'
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden lg:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col justify-between transition-[width] duration-200 ease-out overflow-hidden bg-[#18181B]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 rounded-3xl py-4 px-3 ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Logo & Brand */}
        <div>
          <Link
            href="/"
            className="w-full h-11 px-1.5 flex items-center rounded-2xl hover:bg-white/5 transition-colors group overflow-hidden"
          >
            <span className="w-11 h-11 flex items-center justify-center shrink-0">
              <BrandLogo className="w-9 h-9 group-hover:scale-105 transition-transform" iconClassName="w-7 h-7" />
            </span>
            <div
              className={`min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ${
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="pl-2.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-[#E2E8F0] tracking-tight">SMAUMU</span>
                  <span className="text-[9px] bg-orange-500/15 text-[#F97316] font-bold px-1.5 py-0.2 rounded border border-orange-500/30">
                    UntukMu
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">Portal Transparansi SMAN</p>
              </div>
            </div>
          </Link>

          {/* Garis Pembatas */}
          <div className="my-2.5 border-t border-white/10"></div>

          {/* Shortcut Command Palette (Ctrl+K) */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            title={!isExpanded ? 'Cari Cepat (Ctrl+K)' : undefined}
            aria-label="Cari Cepat"
            className="w-full h-11 px-1.5 flex items-center rounded-2xl bg-white/5 hover:bg-white/10 text-[#E2E8F0] text-xs font-medium border border-white/10 transition-colors mb-2 text-left group overflow-hidden"
          >
            <span className="w-11 h-11 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-[#F97316] group-hover:text-[#F43F5E] transition-colors" />
            </span>
            <div
              className={`min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ${
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="pl-2.5 pr-1.5 flex items-center justify-between whitespace-nowrap">
                <span className="text-[11px] font-semibold truncate">Cari Cepat...</span>
                <kbd className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-slate-300 border border-white/15 shrink-0">
                  Ctrl+K
                </kbd>
              </div>
            </div>
          </button>

          {/* Daftar Menu (Tinggi baris dikunci h-11 agar tidak pernah memicu loncatan tinggi saat hover) */}
          <nav className="space-y-1">
            {NAV_LINKS_PUBLIC.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={!isExpanded ? link.label : undefined}
                  className={`w-full h-11 px-1.5 flex items-center rounded-2xl text-xs font-semibold transition-colors group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F97316]/25 to-[#F43F5E]/20 text-white border border-orange-500/30 shadow-lg font-bold'
                      : 'text-slate-400 hover:text-[#E2E8F0] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="w-11 h-11 flex items-center justify-center shrink-0">
                    {getLinkIcon(link.href, isActive)}
                  </span>

                  <div
                    className={`min-w-0 flex-1 overflow-hidden text-left transition-opacity duration-200 ${
                      isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="pl-2.5 whitespace-nowrap">
                      <p className="truncate text-xs font-bold leading-tight">{link.label}</p>
                      <p className={`text-[10px] truncate mt-0.5 leading-snug ${isActive ? 'text-orange-200/90' : 'text-slate-500'}`}>
                        {link.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah: Profil Pengguna & Autentikasi (Tinggi seragam tanpa reflow saat expand) */}
        <div className="pt-2.5 mt-2 border-t border-white/10 space-y-1.5">
          <ThemeToggle variant="sidebar" isExpanded={isExpanded} />

          {isAuthenticated ? (
            <div className="space-y-1.5">
              <div className="w-full h-11 px-1.5 flex items-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <span className="w-11 h-11 flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#F43F5E] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                  </div>
                </span>
                <div
                  className={`min-w-0 flex-1 overflow-hidden text-left transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="pl-2.5 whitespace-nowrap">
                    <p className="font-bold text-xs text-[#E2E8F0] truncate">{user.nama}</p>
                    <span className="text-[9px] text-emerald-400 font-semibold block truncate">
                      {isAdmin ? 'Petugas Instansi' : 'Calon Siswa Baru'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`h-7 flex items-center gap-1.5 overflow-hidden transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {user.nomor_tiket && !isAdmin && (
                  <Link
                    href={`/lacak?tiket=${encodeURIComponent(user.nomor_tiket)}`}
                    className="flex-1 h-7 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#E2E8F0] text-[10px] font-bold truncate flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Ticket className="w-3 h-3 text-[#F97316] shrink-0" />
                    <span>Tiket Saya</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="flex-1 h-7 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#E2E8F0] text-[10px] font-bold truncate flex items-center justify-center whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  title="Keluar Akun"
                  className="h-7 px-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition flex items-center justify-center shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Link
                href="/register"
                title={!isExpanded ? 'Daftar Calon Siswa' : undefined}
                className="w-full h-11 px-1.5 flex items-center rounded-2xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] hover:from-[#EA580C] hover:to-[#E11D48] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-colors group overflow-hidden"
              >
                <span className="w-11 h-11 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-white" />
                </span>
                <div
                  className={`min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <span className="block pl-2.5 whitespace-nowrap truncate">Daftar Akun</span>
                </div>
              </Link>

              <Link
                href="/login"
                title={!isExpanded ? 'Masuk Akun' : undefined}
                className="w-full h-11 px-1.5 flex items-center rounded-2xl text-xs font-semibold text-slate-400 hover:text-[#E2E8F0] hover:bg-white/5 transition-colors group overflow-hidden"
              >
                <span className="w-11 h-11 flex items-center justify-center shrink-0">
                  <LogIn className="w-5 h-5" />
                </span>
                <div
                  className={`min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <span className="block pl-2.5 whitespace-nowrap truncate text-[11px]">Masuk</span>
                </div>
              </Link>
            </div>
          )}

          {/* Slot Tetap Akses Petugas Dinas (selalu menempati h-6 agar tinggi aside konstan 0px delta) */}
          {!isAdmin && (
            <div className="relative h-6 flex items-center justify-center overflow-hidden">
              <span
                aria-hidden="true"
                className={`absolute inset-0 flex items-center justify-center gap-1 transition-opacity duration-200 pointer-events-none ${
                  isExpanded ? 'opacity-0' : 'opacity-40'
                }`}
              >
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
              </span>
              <Link
                href="/admin/login"
                tabIndex={isExpanded ? 0 : -1}
                className={`text-center text-[10px] text-slate-400 hover:text-[#F97316] whitespace-nowrap transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                Portal Petugas Instansi →
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MOBILE TOP BANNER & FLOATING BOTTOM DOCK */}
      {/* ============================================================== */}
      {/* Header Kecil di Atas Layar untuk HP */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#18181B]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo className="w-8 h-8" iconClassName="w-5 h-5" />
          <div>
            <span className="font-black text-sm text-[#E2E8F0]">SMAUMU</span>
            <span className="text-[9px] text-slate-400 block -mt-0.5">SMAN UntukMu • WIA 2026</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <span className="px-2.5 py-1 rounded-xl bg-white/10 text-[#E2E8F0] text-xs font-bold flex items-center gap-1 border border-white/10">
              <User className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="max-w-[80px] truncate">{user.nama?.split(' ')[0]}</span>
            </span>
          ) : (
            <Link
              href="/login"
              className="px-2.5 py-1 rounded-xl bg-white/10 text-[#E2E8F0] text-xs font-bold"
            >
              Masuk
            </Link>
          )}
          <ThemeToggle variant="icon" />
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/10 text-[#E2E8F0] hover:bg-white/20 transition flex items-center justify-center shrink-0"
            title="Cari Cepat (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-[#222227] text-[#E2E8F0] text-xs font-bold flex items-center justify-center border border-white/10 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Bottom Dock untuk Akses Cepat di HP */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50 bg-[#18181B]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 px-2 py-2 grid grid-cols-5 items-center">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl text-[10px] ${
            router.pathname === '/' ? 'text-[#F97316] font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </Link>
        <Link
          href="/kuota"
          className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl text-[10px] ${
            router.pathname === '/kuota' ? 'text-[#F97316] font-bold' : 'text-slate-400'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>Sisa Kursi</span>
        </Link>
        <Link
          href={isAuthenticated ? "/daftar" : "/register"}
          className="flex flex-col items-center justify-center gap-1 p-2 mx-auto w-14 rounded-2xl bg-gradient-to-tr from-[#F97316] to-[#F43F5E] hover:from-[#EA580C] hover:to-[#E11D48] text-white font-bold text-[10px] -mt-5 shadow-lg shadow-orange-500/30"
        >
          <FileEdit className="w-5 h-5" />
          <span>{isAuthenticated ? 'Formulir' : 'Daftar'}</span>
        </Link>
        <Link
          href="/lacak"
          className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl text-[10px] ${
            router.pathname === '/lacak' ? 'text-[#F97316] font-bold' : 'text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Lacak</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl text-[10px] text-slate-400"
        >
          <Menu className="w-5 h-5" />
          <span>Lainnya</span>
        </button>
      </div>

      {/* Drawer Menu Lengkap di HP */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#18181B] rounded-t-3xl border-t border-white/10 p-4 sm:p-5 space-y-3 max-h-[85vh] overflow-y-auto animate-fade-in text-[#E2E8F0]">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">Menu Layanan Publik</h3>
                <p className="text-[11px] text-slate-400">Pilih menu transparansi atau masuk akun:</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User status card in mobile drawer */}
            {isAuthenticated ? (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#F43F5E] text-white flex items-center justify-center font-bold">
                    {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{user.nama}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white text-center font-bold text-xs shadow-md"
                >
                  Daftar Calon Siswa
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#E2E8F0] text-center font-bold text-xs"
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
                      ? 'bg-orange-500/15 border-orange-500/30 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  {getLinkIcon(link.href, router.pathname === link.href)}
                  <div>
                    <p className="font-bold text-sm leading-tight">{link.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-[#F97316] font-semibold flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" /> Masuk Portal Petugas Dinas
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
}
