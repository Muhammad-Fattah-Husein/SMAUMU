import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Search, 
  School, 
  FileText, 
  ShieldAlert, 
  Layers, 
  Compass, 
  Lock, 
  Settings, 
  ArrowRight, 
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { INITIAL_SEKOLAH } from '@/utils/constants';

export function CommandPalette({ open, onOpenChange }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Shortcut Listener: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const navigateTo = (path) => {
    onOpenChange(false);
    setQuery('');
    router.push(path);
  };

  const cleanQ = query.toLowerCase().trim();

  // Daftar Rute Sistem
  const systemPages = [
    { title: 'Beranda Utama', path: '/', category: 'Publik', icon: <Layers className="w-4 h-4 text-blue-600" /> },
    { title: 'Pantau Sisa Kuota SMAN', path: '/kuota', category: 'Publik', icon: <Flame className="w-4 h-4 text-pink-600" /> },
    { title: 'Pendaftaran Siswa Baru (4 Langkah)', path: '/daftar', category: 'Publik', icon: <FileText className="w-4 h-4 text-emerald-600" /> },
    { title: 'Simulator Peluang Zonasi & Rapor', path: '/simulator', category: 'Publik', icon: <Compass className="w-4 h-4 text-purple-600" /> },
    { title: 'Posko Whistleblower & Aduan Anonim', path: '/whistleblower', category: 'Publik', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
    { title: 'Buku Besar Audit Log SHA-256', path: '/audit-log', category: 'Publik', icon: <Lock className="w-4 h-4 text-cyan-600" /> },
    { title: 'Dasbor Petugas Disdik', path: '/admin/dashboard', category: 'Admin', icon: <Lock className="w-4 h-4 text-blue-700" /> },
    { title: 'Berkas Masuk & Verifikasi Fiori', path: '/admin/permohonan', category: 'Admin', icon: <FileText className="w-4 h-4 text-blue-700" /> },
    { title: 'Posko Aduan Warga & Anti-Spam', path: '/admin/pengaduan', category: 'Admin', icon: <ShieldAlert className="w-4 h-4 text-pink-600" /> },
    { title: 'Pengaturan & Uji Stres Beban 5k Users', path: '/admin/pengaturan', category: 'Admin', icon: <Settings className="w-4 h-4 text-slate-700" /> },
  ].filter(p => !cleanQ || p.title.toLowerCase().includes(cleanQ) || p.category.toLowerCase().includes(cleanQ));

  // Daftar Sekolah
  const filteredSchools = INITIAL_SEKOLAH.filter(s => 
    !cleanQ || s.nama_sekolah.toLowerCase().includes(cleanQ) || s.kota.toLowerCase().includes(cleanQ)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div 
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Command Dialog Window */}
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in text-slate-800">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama halaman, SMAN, atau fitur sistem..."
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="hidden sm:inline px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 text-slate-600">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3 divide-y divide-slate-100">
          {/* Kelompok Halaman Sistem */}
          {systemPages.length > 0 && (
            <div className="pt-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Navigasi Cepat
              </span>
              <div className="space-y-0.5">
                {systemPages.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigateTo(item.path)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#1E3A8A] flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-normal">
                        {item.category}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Kelompok SMAN */}
          {filteredSchools.length > 0 && (
            <div className="pt-2">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Data SMA Negeri
              </span>
              <div className="space-y-0.5">
                {filteredSchools.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigateTo(`/kuota?sekolah=${s.id}`)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-pink-50 hover:text-pink-700 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <School className="w-4 h-4 text-slate-400 group-hover:text-[#EC4899]" />
                      <span>{s.nama_sekolah}</span>
                      <span className="text-[10px] text-slate-400">({s.kota})</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Daya Tampung: {s.kuota_total}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {systemPages.length === 0 && filteredSchools.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Gunakan panah untuk navigasi, enter untuk memilih</span>
          <span className="font-mono">SMAUMU • WIA 2026</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;

