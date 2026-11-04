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
  Clock,
  ExternalLink,
  Scale,
  Award
} from 'lucide-react';
import { FOOTER_LINKS_GENERAL } from '@/utils/constants';

export default function Footer() {
  return (
    <footer className="bg-[#0B1329] text-slate-300 border-t border-slate-800 text-sm">
      {/* 1. Bar Empat Pilar Integritas PPDB Pemerintahan */}
      <div className="border-b border-slate-800 bg-[#0F1E36] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Open Data Kuota Real-Time</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Pemantauan sisa bangku & laju pendaftaran terbuka.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Pendaftaran Terpadu 4 Tahap</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Integrasi NIK Dukcapil & NISN Kemendikbudristek.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Audit Kriptografis SHA-256</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Seluruh tindakan petugas tercatat permanen tanpa rekayasa.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Keadilan Spasial Geospasial</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Eliminasi praktik manipulasi titik koordinat domisili.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Informasi Instansi & Kontak Resmi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Kolom 1: Profil Instansi & Identitas */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/15">
                <img 
                  src="/images/logo-pemprov-dki.svg" 
                  alt="Pemprov DKI Jakarta" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight block">
                  SMA<span className="text-blue-400">UMU</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dinas Pendidikan Provinsi DKI Jakarta
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Portal resmi sistem informasi Penerimaan Peserta Didik Baru (PPDB) jenjang Sekolah Menengah Atas Negeri (SMAN). Menjamin akuntabilitas, transparansi kuota, validasi jarak zonasi, dan pengawasan publik warga.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  Gedung Dinas Pendidikan Provinsi DKI Jakarta, Jl. Gatot Subroto Kav. 40-41, Kuningan Barat, Mampang Prapatan, Jakarta Selatan 12710
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[11px]">
                  Call Center PPDB: <strong className="text-white font-mono">1500-164</strong> / (021) 3865001
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px]">
                  Email: <span className="text-white font-mono">ppdb.disdik@jakarta.go.id</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-[11px]">
                  Layanan Posko: Senin – Jumat, 08.00 – 16.00 WIB
                </span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Layanan Publik Utama */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              Layanan Utama PPDB
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/kuota" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Pantau Kuota Per-Sekolah</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono">LIVE</span>
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="text-slate-400 hover:text-white transition">
                  Pendaftaran Siswa Baru (4 Tahap)
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-slate-400 hover:text-white transition">
                  Simulator Zonasi & Jarak Rumah
                </Link>
              </li>
              <li>
                <Link href="/komparator" className="text-slate-400 hover:text-white transition">
                  Validasi Domisili (Dual-Truth)
                </Link>
              </li>
              <li>
                <Link href="/whistleblower" className="text-slate-400 hover:text-white transition">
                  Saluran Pengaduan Whistleblower
                </Link>
              </li>
              <li>
                <Link href="/audit-log" className="text-slate-400 hover:text-white transition">
                  Buku Catatan Tindakan (Audit SHA-256)
                </Link>
              </li>
              <li>
                <Link href="/sekolah" className="text-slate-400 hover:text-white transition">
                  Daftar SMAN DKI Jakarta & Radius
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Regulasi & Dasar Hukum Resmi */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              Regulasi & Informasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="text-slate-300 font-bold block text-[11px]">Permendikbud No. 1/2021</span>
                <span className="text-[10px] text-slate-400">Penerimaan Peserta Didik Baru TK, SD, SMP, SMA/SMK</span>
              </li>
              <li>
                <span className="text-slate-300 font-bold block text-[11px]">Pergub DKI No. 15/2024</span>
                <span className="text-[10px] text-slate-400">Petunjuk Teknis Pelaksanaan PPDB Bersama DKI Jakarta</span>
              </li>
              <li>
                <span className="text-slate-300 font-bold block text-[11px]">UU No. 14/2008</span>
                <span className="text-[10px] text-slate-400">Keterbukaan Informasi Publik (KIP)</span>
              </li>
              <li>
                <span className="text-slate-300 font-bold block text-[11px]">UU No. 27/2022</span>
                <span className="text-[10px] text-slate-400">Perlindungan Data Pribadi (UU PDP)</span>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <Link href="/kebijakan-privasi" className="hover:text-white transition text-xs">
                  Kebijakan Privasi
                </Link>
                <span className="mx-2">•</span>
                <Link href="/syarat-ketentuan" className="hover:text-white transition text-xs">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sertifikasi & Mitra Pengawas */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              Mitra & Pengawasan
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-white text-[11px] block">BSSN CSIRT</span>
                <span className="text-[10px] text-slate-400">Keamanan Siber Terjamin</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-white text-[11px] block">Ombudsman RI</span>
                <span className="text-[10px] text-slate-400">Pengawasan Pelayanan Publik</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-white text-[11px] block">Dukcapil DKI</span>
                <span className="text-[10px] text-slate-400">Verifikasi NIK Kependudukan</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bar Copyright Hak Cipta Resmi */}
      <div className="border-t border-slate-800 bg-[#070D1E] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Hak Cipta © 2026 <strong>Pemerintah Provinsi DKI Jakarta</strong> • Dinas Pendidikan. Seluruh Hak Dilindungi Undang-Undang.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Versi Sistem 2.4.0 (Production Release)</span>
            <span>•</span>
            <Link href="/admin/login" className="text-slate-400 hover:text-white transition underline font-semibold">
              Portal Petugas
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
