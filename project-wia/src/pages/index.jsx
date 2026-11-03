import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { 
  ShieldCheck, 
  Eye, 
  Compass, 
  Lock, 
  Scale, 
  ArrowRight, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Users, 
  BarChart3, 
  Globe,
  FileCheck2,
  HelpCircle,
  TrendingUp,
  School
} from 'lucide-react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: 'Apa itu SMAUMU dan apa perannya dalam PPDB SMAN?',
      a: 'SMAUMU (SMAN UntukMu) adalah inisiatif portal transparansi publik independen yang dirancang untuk Web In Action (WIA) MIA 2026. Portal ini bertujuan menjamin keadilan, keterbukaan data kuota, integritas zonasi, dan pengawasan warga dalam penerimaan peserta didik baru jenjang SMA Negeri.'
    },
    {
      q: 'Mengapa transparansi kuota dan zonasi sangat penting?',
      a: 'Proses seleksi berbasis zonasi sering kali menghadapi tantangan manipulasi data alamat (numpang KK) dan ketertutupan sisa bangku. SMAUMU menghadirkan keterbukaan data real-time dan validasi spasial otomatis agar setiap anak memiliki hak pendidikan yang adil sesuai aturan yang berlaku.'
    },
    {
      q: 'Bagaimana SMAUMU memastikan integritas data?',
      a: 'Setiap entri data pendaftaran dan mutasi kuota diaudit secara permanen menggunakan penanda kriptografis SHA-256 yang tercatat dalam log audit publik terbuka dan tidak dapat diubah (immutable).'
    },
    {
      q: 'Apakah platform ini berbayar atau memerlukan login untuk melihat data?',
      a: 'Tidak. Seluruh informasi kuota, transparansi jarak zonasi, simulator, dan log audit publik dapat diakses 100% gratis oleh siapa saja tanpa batasan akses atau biaya pendaftaran.'
    }
  ];

  return (
    <Layout>
      {/* ============================================================== */}
      {/* 1. HERO SECTION: PENGENALAN & VISI PLATFORM SMAUMU */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#1E3A8A] to-slate-950 text-white p-6 sm:p-10 lg:p-16 mb-16 shadow-2xl border border-blue-900/40">
        <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Headline & Value Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Web In Action • MIA 2026 Innovation Showcase</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15]">
              Penerimaan Siswa Baru yang{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-pink-300 to-white">
                Jujur, Terbuka & Berkeadilan.
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              SMAUMU (SMAN UntukMu) mewujudkan tata kelola PPDB digital yang berintegritas tinggi. Menghapus asimetri informasi melalui transparansi kuota seketika, pengawasan partisipatif warga, dan audit data berbasis kriptografi.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-xl shadow-pink-500/30 hover:scale-[1.02] transition-all"
              >
                <span>Mulai Pendaftaran Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/kuota"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 transition-all hover:scale-[1.02]"
              >
                <span>Lihat Data Kuota Terbuka</span>
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Kartu Profil Integritas Platform */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 w-full">
            <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Jaminan Transparansi Publik
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Open Data
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-black text-white block">100%</span>
                  <span className="text-[11px] text-slate-300 font-semibold leading-tight block mt-0.5">
                    Data Seleksi Terbuka untuk Umum
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-black text-emerald-400 block">SHA-256</span>
                  <span className="text-[11px] text-slate-300 font-semibold leading-tight block mt-0.5">
                    Integritas Audit Kriptografis
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-black text-cyan-300 block">0 Celik</span>
                  <span className="text-[11px] text-slate-300 font-semibold leading-tight block mt-0.5">
                    Manipulasi Alamat / Numpang KK
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-black text-pink-400 block">Gratis</span>
                  <span className="text-[11px] text-slate-300 font-semibold leading-tight block mt-0.5">
                    Bebas Akses Bagi Seluruh Warga
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-300/90 leading-relaxed border-t border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Terhubung dengan ekosistem pelacakan publik SMAN DKI Jakarta.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. STATISTIK KUNCI SMAUMU */}
      {/* ============================================================== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Sekolah Percontohan</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">6 SMAN</h4>
            <span className="text-[11px] text-blue-600 font-bold">DKI Jakarta</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-pink-50 text-pink-600 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Daya Tampung</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">1.920 Kursi</h4>
            <span className="text-[11px] text-slate-500 font-medium">Seluruh Jalur Seleksi</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Jaminan Keamanan</p>
            <h4 className="text-2xl font-black text-emerald-600 mt-0.5">100% Audit</h4>
            <span className="text-[11px] text-emerald-700 font-bold">Terverifikasi Publik</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Akses Partisipatif</p>
            <h4 className="text-2xl font-black text-slate-900 mt-0.5">Publik & Terbuka</h4>
            <span className="text-[11px] text-amber-600 font-bold">Tanpa Asimetri Data</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. VALUE PROPOSITION: TIGA PILAR UTAMA INTEGRITAS */}
      {/* ============================================================== */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Prinsip Fundamental
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Mengapa SMAUMU Hadir?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Membangun kembali kepercayaan masyarakat terhadap sistem seleksi sekolah negeri dengan tiga fondasi utama:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold mb-5 group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                1. Transparansi Radikal
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Masyarakat berhak mengetahui pergerakan sisa kuota bangku sekolah dan antrean pendaftaran secara langsung tanpa ada yang disembunyikan di balik pintu tertutup.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-[#1E3A8A]">
              <span>Keterbukaan Data Penuh</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#EC4899] flex items-center justify-center font-bold mb-5 group-hover:bg-[#EC4899] group-hover:text-white transition-colors">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                2. Keadilan Spasial Presisi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Perhitungan radius dan jarak zonasi sekolah dihitung dengan standar formula geodesik presisi, mengeliminasi kecurangan titik koordinat fiktif dan pemalsuan domisili.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-[#EC4899]">
              <span>Validasi Koordinat Nyata</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                3. Akuntabilitas & Audit Kriptografis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Setiap mutasi data memiliki jejak rekam digital (audit trail) tak terhapuskan yang dapat diverifikasi publik kapan saja, serta saluran pelaporan warga yang aman dan rahasia.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
              <span>Keamanan Kriptografi Terjamin</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. TATA CARA PENGAWALAN: 4 TAHAP MENUJU SELEKSI BERSIH */}
      {/* ============================================================== */}
      <section className="mb-16 bg-gradient-to-r from-slate-950 via-[#1E3A8A] to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-blue-900/40">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
            Ekosistem Pengawasan Publik
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Bagaimana Masyarakat Mengawal Bersama?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Empat pilar keterlibatan masyarakat untuk mewujudkan PPDB yang adil dan berintegritas:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs mb-3 shadow">
              01
            </span>
            <h4 className="font-bold text-sm text-white">Eksplorasi Informasi</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Masyarakat memeriksa kuota daya tampung resmi dari masing-masing sekolah dan jalur seleksi.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs mb-3 shadow">
              02
            </span>
            <h4 className="font-bold text-sm text-white">Perencanaan Spasial</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Mengukur jarak riil rumah ke sekolah tujuan secara objektif tanpa manipulasi jarak fiktif.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs mb-3 shadow">
              03
            </span>
            <h4 className="font-bold text-sm text-white">Verifikasi Terbuka</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Data berkas disandingkan secara jujur dan transparan dengan basis data kependudukan resmi.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xs mb-3 shadow">
              04
            </span>
            <h4 className="font-bold text-sm text-white">Audit Partisipatif</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Masyarakat dapat memverifikasi log catatan sistem dan melaporkan kejanggalan dengan perlindungan anonim.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FAQ SECTION (PERTANYAAN UMUM WARGA) */}
      {/* ============================================================== */}
      <section className="mb-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Informasi & Panduan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Pelajari lebih dalam mengenai keterbukaan platform dan jaminan hak masyarakat.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CALL TO ACTION (CTA) AKHIR */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-r from-[#0B2545] via-[#1E3A8A] to-[#0B2545] rounded-3xl p-8 sm:p-12 text-white border border-blue-900/40 text-center relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-300 border border-white/15 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Mari Kawal Pendidikan Indonesia
          </div>

          <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
            Bersama Wujudkan PPDB yang Adil & Transparan
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl mx-auto">
            Gunakan hak Anda sebagai warga untuk memantau data, melakukan pendaftaran mandiri, dan mengawal integritas sekolah negeri di seluruh Jakarta.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/daftar"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs sm:text-sm shadow-xl shadow-pink-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Daftarkan Siswa Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/kuota"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur transition-all"
            >
              <span>Pantau Sisa Kuota SMAN</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
