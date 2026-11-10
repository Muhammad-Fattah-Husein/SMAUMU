import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  FileCheck, 
  ShieldAlert, 
  Database, 
  Lock, 
  FileSpreadsheet, 
  Settings, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  MessageSquareWarning
} from 'lucide-react';
import { NAV_LINKS_ADMIN } from '@/utils/constants';

export default function AdminSidebar() {
  const router = useRouter();

  const getAdminIcon = (href) => {
    switch (href) {
      case '/admin/dashboard': return <LayoutDashboard className="w-4 h-4" />;
      case '/admin/permohonan': return <FileCheck className="w-4 h-4" />;
      case '/admin/verifikasi-anomali': return <ShieldAlert className="w-4 h-4" />;
      case '/admin/pengaduan': return <MessageSquareWarning className="w-4 h-4 text-pink-400" />;
      case '/admin/master-kuota': return <Database className="w-4 h-4" />;
      case '/admin/audit-log': return <Lock className="w-4 h-4" />;
      case '/admin/export': return <FileSpreadsheet className="w-4 h-4" />;
      case '/admin/pengaturan': return <Settings className="w-4 h-4" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 space-y-6">
        {/* Admin Badge */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold shadow">
            AD
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-white text-xs truncate">Disdik WIA Provinsi</h4>
            <p className="text-[10px] text-[#10B981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Petugas Terotorisasi
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Menu Administrasi
          </p>
          {NAV_LINKS_ADMIN.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {getAdminIcon(item.href)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Switch to Public Portal / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <span>Buka Portal Publik</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </Link>
      </div>
    </aside>
  );
}
