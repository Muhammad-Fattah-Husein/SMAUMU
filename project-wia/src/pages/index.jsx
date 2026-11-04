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
  School,
  Calendar,
  Clock,
  AlertCircle,
  Search,
  MapPin,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { INITIAL_SEKOLAH } from '@/utils/constants';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [searchSchool, setSearchSchool] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredSchools = INITIAL_SEKOLAH.filter(s => 
    s.nama_sekolah.toLowerCase().includes(searchSchool.toLowerCase()) ||
    s.kecamatan.toLowerCase().includes(searchSchool.toLowerCase()) ||
    s.npsn.includes(searchSchool)
  );

  const JADWAL_PPDB = [
    {
      jalur: 'Jalur Prestasi (Akademik & Non-Akademik)',
      tanggal: '10 – 15 Juni 2026',
      kuota: '20% - 25%',
      status: 'Selesai',
      badgeClass: 'bg-slate-100 text-slate-700'
    },
    {
      jalur: 'Jalur Afirmasi (KJP Plus, PIP, Disabilitas)',
      tanggal: '17 – 21 Juni 2026',
      kuota: '15% - 20%',
      status: 'Selesai',
      badgeClass: 'bg-slate-100 text-slate-700'
    },
    {
      jalur: 'Jalur Zonasi Wilayah (Prioritas 1 & 2)',
      tanggal: '24 – 28 Juni 2026',
      kuota: '50% (Mayoritas)',
      status: 'SEDANG DIBUKA',
      badgeClass: 'bg-emerald-500 text-white animate-pulse'
    },
    {
      jalur: 'Jalur Perpindahan Tugas Orang Tua / Guru',
      tanggal: '01 – 03 Juli 2026',
      kuota: '5% - 10%',
      status: 'Mendatang',
      badgeClass: 'bg-blue-100 text-blue-800'
    }
  ];

  const FAQS = [
    {
      q: 'Apa itu SMAUMU dan apa legalitasnya dalam PPDB SMAN DKI Jakarta?',
      a: 'SMAUMU (SMAN UntukMu) adalah portal resmi sistem transparansi dan pemantauan Penerimaan Peserta Didik Baru (PPDB) jenjang SMA Negeri yang dikembangkan sesuai Permendikbudristek No. 1 Tahun 2021 dan Pergub DKI Jakarta No. 15 Tahun 2024. Portal ini mengintegrasikan data Dapodik, Pusdatin, dan Dukcapil untuk menjamin asas keadilan, akuntabilitas, dan keterbukaan publik.'
    },
    {
      q: 'Apakah pendaftaran dan pemantauan di portal SMAUMU dipungut biaya?',
      a: 'Sama sekali TIDAK DIPUNGUT BIAYA (100% GRATIS). Seluruh fasilitas, mulai dari pendaftaran akun, pemantauan sisa kuota secara real-time, simulasi zonasi berbasis peta geodesik, hingga akses log audit terbuka, disediakan secara cuma-cuma untuk seluruh warga negara Indonesia.'
    },
    {
      q: 'Bagaimana sistem mencegah manipulasi zonasi atau pemalsuan Kartu Keluarga (numpang KK)?',
      a: 'Sistem menerapkan mekanisme Dual-Truth Geospasial dengan formula jarak Great-Circle (Haversine). Data koordinat rumah pendaftar dicocokkan langsung dengan basis data kependudukan Dukcapil. Jika deviasi koordinat melebihi batas toleransi 150 meter atau masa kepemilikan KK kurang dari 12 bulan berturut-turut, sistem otomatis mengunci berkas untuk Tinjauan Lapangan Faktual.'
    },
    {
      q: 'Apakah catatan verifikasi dan pergerakan kuota bisa diubah diam-diam oleh oknum?',
      a: 'Tidak bisa. Setiap aksi petugas pendaftaran maupun mutasi penambahan kuota direkam dalam rantai audit kriptografi SHA-256 yang bersifat permanen (immutable ledger). Upaya mengubah satu baris data akan merusak integritas rantai hash dan otomatis membunyikan alarm audit pada Ombudsman dan Inspektorat.'
    },
    {
      q: 'Ke mana masyarakat dapat mengadu jika menemukan indikasi kecurangan atau pungli?',
      a: 'Masyarakat dapat langsung melapor melalui Saluran Whistleblower resmi di portal ini. Laporan dapat dikirim 100% anonim tanpa pencatatan identitas maupun alamat IP, dan pelapor diberikan Token Rahasia unik untuk memantau status tindak lanjut oleh tim investigasi Inspektorat Disdik.'
    }
  ];

  return (
    <Layout>
      {/* ============================================================== */}
      {/* 1. HERO SECTION: PORTAL RESMI PPDB PEMERINTAHAN               */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0A192F] text-white p-6 sm:p-10 lg:p-14 mb-12 shadow-2xl border border-blue-900/50">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Sisi Kiri: Headline, Identitas Resmi, CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Lencana Otoritas Resmi */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-5 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="uppercase tracking-wider text-[11px]">Sistem Informasi Resmi PPDB SMAN DKI Jakarta</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              Penerimaan Siswa Baru yang{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-300 to-emerald-300">
                Jujur, Transparan & Berkeadilan.
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Portal terpadu Dinas Pendidikan Provinsi DKI Jakarta untuk pendaftaran dan pemantauan PPDB jenjang SMA Negeri. Menjamin hak kesetaraan pendidikan anak bangsa dengan transparansi sisa kuota seketika, uji jarak zonasi geospasial presisi, dan audit permanen SHA-256.
            </p>

            {/* Aksi Cepat / CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/kuota"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-[1.02] transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Pantau Sisa Kuota SMAN</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-[10px] uppercase font-mono">Live</span>
              </Link>

              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white backdrop-blur border border-white/25 transition-all hover:scale-[1.02]"
              >
                <span>Pendaftaran Siswa Baru</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/simulator"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-semibold text-xs text-blue-200 hover:text-white hover:bg-white/10 transition"
              >
                <Compass className="w-4 h-4" />
                <span>Uji Jarak Zonasi</span>
              </Link>
            </div>

            {/* Jaminan Layanan Pemerintah */}
            <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Bebas Biaya (Gratis)
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Dukcapil & Kemdikbud Verified
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                BSSN Cyber Shield Certified
              </span>
            </div>

          </div>

          {/* Sisi Kanan: Panel Status Real-Time PPDB */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 w-full">
            <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Status Server PPDB 2026
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ONLINE • LIVE
                </span>
              </div>

              {/* Ringkasan Angka Daya Tampung */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block">Total SMAN Binaan</span>
                  <span className="text-2xl font-black text-white block mt-0.5">6 SMAN</span>
                  <span className="text-[10px] text-blue-300 font-medium">Jakarta Pusat & Selatan</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block">Daya Tampung Total</span>
                  <span className="text-2xl font-black text-emerald-400 block mt-0.5">1.940 Kursi</span>
                  <span className="text-[10px] text-emerald-300 font-medium">4 Jalur Seleksi Terpadu</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block">Integritas Audit</span>
                  <span className="text-2xl font-black text-amber-400 block mt-0.5">SHA-256</span>
                  <span className="text-[10px] text-amber-300 font-medium">Buku Besar Tak Berubah</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block">Pengaduan Warga</span>
                  <span className="text-2xl font-black text-cyan-300 block mt-0.5">100% Anonim</span>
                  <span className="text-[10px] text-cyan-300 font-medium">Inspektorat & Ombudsman</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-300 leading-relaxed border-t border-white/10 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pelayanan Berintegritas Tanpa Calo</span>
                </span>
                <Link href="/kontak" className="text-blue-200 hover:text-white underline font-semibold">
                  Hubungi Posko
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. JADWAL RESMI PELAKSANAAN PPDB 2026                          */}
      {/* ============================================================== */}
      <section className="mb-14">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                  Jadwal Resmi Pelaksanaan
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Tahapan Seleksi PPDB SMAN Tahun Ajaran 2026/2027
              </h2>
            </div>
            <Link
              href="/bantuan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
            >
              <span>Lihat Petunjuk Teknis Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {JADWAL_PPDB.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === 'SEDANG DIBUKA' 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' 
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                    {item.status}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Kuota {item.kuota}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                  {item.jalur}
                </h3>
                <p className="text-xs font-semibold text-[#1E3A8A] mt-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.tanggal}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. PENCARIAN CEPAT SEKOLAH & RADIUS ZONASI                     */}
      {/* ============================================================== */}
      <section className="mb-14">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-white px-3 py-1 rounded-full border border-blue-200 inline-block mb-2">
              Direktori Resmi Sekolah
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cek Daya Tampung & Radius Zonasi SMAN
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ketik nama sekolah, NPSN, atau kecamatan untuk melihat jangkauan radius zonasi dan kapasitas resmi.
            </p>
          </div>

          {/* Search Box Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchSchool}
              onChange={(e) => setSearchSchool(e.target.value)}
              placeholder="Cari SMAN (contoh: Boedoet, Bukit Duri, Cilandak, NPSN: 20101567)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition"
            />
          </div>

          {/* Hasil Pencarian Sekolah Cepat */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchools.slice(0, 6).map((school) => (
              <div 
                key={school.id} 
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      NPSN: {school.npsn}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 text-[10px] px-2 py-0.5 rounded border border-emerald-200">
                      {school.akreditasi}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">{school.nama_sekolah}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{school.kecamatan}, {school.kota}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Radius Zonasi</span>
                    <span className="font-mono font-black text-[#1E3A8A]">{(school.radius_max / 1000).toFixed(1)} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Kursi</span>
                    <span className="font-mono font-black text-slate-900">{school.kuota_total} Kursi</span>
                  </div>
                  <Link
                    href={`/simulator`}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#1E3A8A] font-bold hover:bg-blue-100 transition text-[11px]"
                  >
                    Uji Jarak
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/sekolah"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
            >
              <span>Lihat Seluruh Daftar & Lokasi SMAN Binaan DKI Jakarta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. EMPAT LAYANAN UTAMA PORTAL PPDB SMAUMU                      */}
      {/* ============================================================== */}
      <section className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Layanan Terpadu Warga
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Fasilitas Resmi Pelayanan PPDB
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Akses seluruh fasilitas pelayanan daring terstandar untuk mempermudah calon siswa dan orang tua:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Kartu 1: Pantau Kuota */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                1. Pantau Kuota Real-Time
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menyajikan informasi sisa bangku per-sekolah, persentase kuota terisi, laju berkas pendaftar per jam, dan grafik keterisian terbuka.
              </p>
            </div>
            <Link
              href="/kuota"
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>Buka Data Kuota</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Kartu 2: Pendaftaran 4 Langkah */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold mb-4 group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                2. Formulir Pendaftaran
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alur pendaftaran mandiri 4 tahap: verifikasi NIK/NISN, penentuan pilihan sekolah, unggah berkas, dan penerbitan bukti pendaftaran resmi.
              </p>
            </div>
            <Link
              href="/daftar"
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1E3A8A] hover:text-blue-800"
            >
              <span>Isi Formulir</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Kartu 3: Simulator Zonasi */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                3. Uji Zonasi Peta Rumah
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Klik titik lokasi domisili rumah Anda pada peta interaktif untuk mengukur jarak geodesik dan ranking peluang lolos di seluruh SMAN serentak.
              </p>
            </div>
            <Link
              href="/simulator"
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>Coba Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Kartu 4: Whistleblower System */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1.5">
                4. Pengaduan & Pungli
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saluran pelaporan warga terenkripsi 100% anonim. Laporkan titipan siswa, pemalsuan KK, dan pungutan liar langsung ke Inspektorat Disdik.
              </p>
            </div>
            <Link
              href="/whistleblower"
              className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              <span>Kirim Laporan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FAQ (PERTANYAAN UMUM WARGA & ORANG TUA)                     */}
      {/* ============================================================== */}
      <section className="mb-14 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Pusat Informasi & FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Pelajari ketentuan hukum, verifikasi zonasi, dan jaminan keamanan data calon peserta didik.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-extrabold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/bantuan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline"
          >
            <span>Buka Seluruh Pertanyaan & Panduan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. BANNER CALL CENTER & POSKO BANTUAN DISDIK                   */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0F172A] rounded-3xl p-8 sm:p-10 text-white border border-blue-900/50 shadow-xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Layanan Posko PPDB DKI Jakarta
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Butuh Pendampingan atau Terkendala Verifikasi NIK?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Petugas Dinas Pendidikan Provinsi DKI Jakarta siap melayani Anda melalui layanan tatap muka posko maupun saluran telepon resmi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/kontak"
              className="px-6 py-3.5 rounded-2xl bg-white text-[#1E3A8A] font-black text-xs hover:bg-slate-100 transition shadow-lg hover:scale-105"
            >
              Lihat Posko Wilayah
            </Link>
            <a
              href="tel:1500164"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hubungi 1500-164</span>
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
}
