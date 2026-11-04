import Layout from '@/components/Layout';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  Award, 
  Users, 
  Compass, 
  Database, 
  FileCheck2, 
  BarChart3,
  Scale,
  Lock,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function TentangPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 mb-14">
        
        {/* Header Resmi */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-bold mb-2 border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Inisiatif Tata Kelola Pemerintahan Terbuka (Open Government)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tentang Portal SMAUMU (SMAN UntukMu)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
            Sistem Informasi Resmi Dinas Pendidikan Provinsi DKI Jakarta untuk Penerimaan Peserta Didik Baru (PPDB) jenjang Sekolah Menengah Atas Negeri berbasis transparansi kuota seketika, keadilan spasial geodetik, dan audit publik kriptografis.
          </p>
        </div>

        {/* Latar Belakang & Amanat Regulasi */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-5 h-5 text-[#1E3A8A]" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Landasan Hukum & Amanat Konstitusi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Sesuai Pasal 31 Undang-Undang Dasar 1945, setiap warga negara berhak mendapatkan pendidikan yang bermutu tanpa diskriminasi. Portal SMAUMU dikembangkan untuk menjalankan amanat:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Regulasi Nasional</span>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5">Permendikbudristek RI No. 1 Tahun 2021</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mengatur tata cara pelaksanaan PPDB berbasis zonasi, afirmasi, perpindahan tugas orang tua, dan prestasi untuk mendorong pemerataan mutu sekolah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Peraturan Daerah</span>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5">Pergub DKI Jakarta No. 15 Tahun 2024</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Petunjuk Teknis PPDB Bersama jenjang SMA Negeri yang mengedepankan asas non-diskriminatif, berkeadilan, transparan, dan akuntabel.
              </p>
            </div>
          </div>
        </div>

        {/* Nilai Fundamental Pelayanan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1.5">1. Keterbukaan Penuh</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seluruh data kuota, daya tampung tersisa, dan laju pergerakan berkas disajikan secara terbuka untuk publik tanpa ada kursi titipan di belakang layar.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#1E3A8A]">
              Open Government Data
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1.5">2. Presisi Geospasial</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menggunakan formula Great-Circle (Haversine) yang tersinkronisasi dengan Dukcapil untuk memverifikasi domisili faktual dan meniadakan manipulasi KK fiktif.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-600">
              Keadilan Wilayah Geodetik
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-base mb-1.5">3. Integritas SHA-256</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seluruh tindakan verifikator sekolah dan mutasi berkas dicatat dalam buku besar berantai hash kriptografi yang tidak dapat diubah (immutable audit log).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-amber-600">
              Civic Accountability
            </div>
          </div>
        </div>

        {/* Hubungan Antar Lembaga */}
        <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Sinergi Lembaga Pengawas & Verifikasi Nasional
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dalam menjaga kualitas dan keabsahan seleksi, SMAUMU berkolaborasi aktif dengan berbagai institusi resmi pemerintah:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <strong className="text-blue-300 block mb-1">Ditjen Dukcapil Kemendagri</strong>
              <p className="text-slate-400 text-[11px]">Validasi NIK, kesesuaian alamat KK, dan masa tinggal minimal 12 bulan.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <strong className="text-emerald-400 block mb-1">Pusdatin Kemendikbudristek</strong>
              <p className="text-slate-400 text-[11px]">Integrasi data NISN, sekolah asal SMP, dan nilai rapor Dapodik.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <strong className="text-amber-300 block mb-1">Ombudsman & Inspektorat DKI</strong>
              <p className="text-slate-400 text-[11px]">Pengawasan kepatuhan prosedur dan penindakan laporan whistleblower.</p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
