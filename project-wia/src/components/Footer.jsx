import Link from 'next/link';
import { 
  ShieldCheck, 
  Database, 
  MapPin, 
  FileCheck2, 
  BarChart3, 
  Lock, 
  HeartHandshake, 
  Mail, 
  Phone,
  ExternalLink 
} from 'lucide-react';
import { FOOTER_LINKS_GENERAL } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-slate-300 border-t border-white/10 text-sm">
      {/* 4 Pilar Jaminan Transparansi */}
      <div className="border-b border-white/10 bg-[#172554]/70 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
              <div className="p-2 rounded-xl bg-blue-500/10 text-royal shrink-0">
                <Database className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Open Data Kuota</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Pantau sisa kuota dan laju pendaftar per jam.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Pelacakan Berkas</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Alur 4 tahap dengan nomor tiket digital.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-300 shrink-0">
                <HeartHandshake className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Akuntabilitas Publik</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Aduan anonim & log audit SHA-256 bebas rekayasa.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Bantuan Keputusan</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Simulator peluang lolos & uji koordinat zonasi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center text-white font-bold shadow-md shadow-blue-900/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                SMA<span className="text-white">UMU</span>
                <span className="text-xs font-normal text-slate-400 ml-2">SMAN UntukMu</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Portal transparansi penerimaan siswa baru SMAN berbasis data terbuka, verifikasi integritas koordinat, dan pencatatan audit publik.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Layanan Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/kuota" className="text-slate-400 hover:text-white transition">Sisa Kuota SMAN</Link></li>
              <li><Link href="/daftar" className="text-slate-400 hover:text-white transition">Pendaftaran (4 Langkah)</Link></li>
              <li><Link href="/lacak" className="text-slate-400 hover:text-white transition">Lacak Status Tiket</Link></li>
              <li><Link href="/komparator" className="text-slate-400 hover:text-white transition">Validasi Domisili</Link></li>
              <li><Link href="/simulator" className="text-slate-400 hover:text-white transition">Simulator Peluang</Link></li>
              <li><Link href="/whistleblower" className="text-slate-400 hover:text-white transition">Lapor Anonim</Link></li>
              <li><Link href="/audit-log" className="text-slate-400 hover:text-white transition">Log Audit Publik</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Informasi & Bantuan</h4>
            <ul className="space-y-2 text-xs">
              {FOOTER_LINKS_GENERAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-800">
                <Link href="/admin/login" className="text-blue-300 hover:text-white font-bold transition flex items-center gap-1">
                  Portal Petugas Dinas <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Tim SMAUMU • Web In Action (WIA) MIA 2026. Hak Cipta Terlindungi.</p>
          <p>Mendukung Keterbukaan Informasi Publik (UU No. 14 Tahun 2008)</p>
        </div>
      </div>
    </footer>
  );
}
