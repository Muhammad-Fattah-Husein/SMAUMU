import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  School,
  FileText,
  ShieldAlert,
  Layers,
  Compass,
  Lock,
  Settings,
  ArrowRight,
  Flame,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command';
import { INITIAL_SEKOLAH } from '@/utils/constants';

const SYSTEM_PAGES = [
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
];

export function CommandPalette({ open, onOpenChange }) {
  const router = useRouter();

  // Shortcut Listener: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const navigateTo = (path) => {
    onOpenChange(false);
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ketik nama halaman, SMAN, atau fitur sistem..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil yang cocok.</CommandEmpty>

        <CommandGroup heading="Navigasi Cepat">
          {SYSTEM_PAGES.map((item) => (
            <CommandItem
              key={item.path}
              value={`${item.title} ${item.category}`}
              onSelect={() => navigateTo(item.path)}
              className="group"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-normal">
                  {item.category}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-data-[selected=true]:text-[#2563EB] group-data-[selected=true]:translate-x-0.5 transition" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Data SMA Negeri">
          {INITIAL_SEKOLAH.map((s) => (
            <CommandItem
              key={s.id}
              value={`${s.nama_sekolah} ${s.kota}`}
              onSelect={() => navigateTo(`/kuota?sekolah=${s.id}`)}
              className="group data-[selected=true]:bg-pink-50 data-[selected=true]:text-pink-700"
            >
              <div className="flex items-center gap-2.5">
                <School className="w-4 h-4 text-slate-400 group-data-[selected=true]:text-[#EC4899]" />
                <span>{s.nama_sekolah}</span>
                <span className="text-[10px] text-slate-400">({s.kota})</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Daya Tampung: {s.kuota_total}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Gunakan panah atas/bawah untuk navigasi, Enter untuk memilih</span>
        <span className="font-mono">SMAUMU • shadcn/ui + cmdk</span>
      </div>
    </CommandDialog>
  );
}

export default CommandPalette;
