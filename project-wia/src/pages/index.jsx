import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import QuotaBurnRateCard from '@/components/QuotaBurnRateCard';
import DualTruthComparatorView from '@/components/DualTruthComparatorView';
import GeoDiscrepancyMap from '@/components/GeoDiscrepancyMap';
import PassingGradeCalculator from '@/components/PassingGradeCalculator';
import InteractiveZonasiHeatmap from '@/components/InteractiveZonasiHeatmap';
import { db } from '@/services/db';
import { 
  ShieldCheck, 
  Flame, 
  MapPin, 
  Compass, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileCheck2, 
  Search, 
  Lock, 
  TrendingUp,
  FileEdit,
  Scale
} from 'lucide-react';

export default function Home({ initialKuota, initialPendaftaran }) {
  const [kuotaList, setKuotaList] = useState(initialKuota);
  const [searchTicket, setSearchTicket] = useState('');

  const handleSimulateAdd = async (sekolahId, jalur) => {
    try {
      const res = await fetch('/api/kuota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sekolah_id: sekolahId, jalur, deltaApplicants: 1, deltaFilled: 1 })
      });
      const data = await res.json();
      if (data.success) {
        const refreshRes = await fetch('/api/kuota');
        const refreshData = await refreshRes.json();
        if (refreshData.success) setKuotaList(refreshData.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      {/* ============================================================== */}
      {/* 1. HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#1E3A8A] to-slate-950 text-white p-6 sm:p-12 lg:p-16 mb-12 shadow-2xl border border-blue-900/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
            <span>Transparansi PPDB SMAN • WIA MIA 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Penerimaan Siswa Baru yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Jujur & Terbuka.</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Pantau sisa kuota sekolah real-time, verifikasi integritas koordinat domisili, dan lacak status berkas pendaftaran tanpa rekayasa.
          </p>

          {/* 4 Pilar Jaminan Ringkas */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="bg-white/10 border border-white/15 px-3 py-1 rounded-xl text-slate-100">
              ✓ Kuota Real-Time
            </span>
            <span className="bg-white/10 border border-white/15 px-3 py-1 rounded-xl text-slate-100">
              ✓ Lacak Tiket
            </span>
            <span className="bg-white/10 border border-white/15 px-3 py-1 rounded-xl text-slate-100">
              ✓ Whistleblower Anonim
            </span>
            <span className="bg-white/10 border border-white/15 px-3 py-1 rounded-xl text-slate-100">
              ✓ Simulator Peluang
            </span>
          </div>

          {/* Tombol Aksi Utama - CTA Pink Aksen dengan Teks Putih Kontras Kuat */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Link
              href="/daftar"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-xl shadow-pink-500/30 hover:scale-[1.01] transition-all"
            >
              <span>Daftar Siswa Baru</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/kuota"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 transition-all"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>Pantau Kuota</span>
            </Link>

            <Link
              href="/komparator"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 transition-all"
            >
              <Scale className="w-4 h-4 text-white/80" />
              <span>Validasi Domisili</span>
            </Link>
          </div>
        </div>

        {/* Kolom Pencarian Cepat Nomor Tiket */}
        <div className="relative z-10 mt-8 p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTicket) window.location.href = `/lacak?tiket=${encodeURIComponent(searchTicket)}`;
            }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Masukkan nomor tiket (contoh: TIKET-SMU-2026-098214)"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs bg-[#1E3A8A] hover:bg-[#2563EB] text-white transition flex items-center justify-center gap-1.5 shrink-0 shadow"
            >
              <FileCheck2 className="w-4 h-4 text-white/80" />
              <span>Lacak Tiket</span>
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. STATISTIK RINGKAS */}
      {/* ============================================================== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold">Sekolah Terdaftar</p>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">6 SMAN</h4>
            <span className="text-[10px] text-emerald-600 font-bold">DKI Jakarta</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold">Total Kursi</p>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">1.920</h4>
            <span className="text-[10px] text-slate-500 font-medium">Semua Jalur</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold">Laju Pendaftaran</p>
            <h4 className="text-lg sm:text-xl font-black text-slate-900">8,9 / jam</h4>
            <span className="text-[10px] text-amber-600 font-bold">Rata-rata</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-semibold">Audit SHA-256</p>
            <h4 className="text-lg sm:text-xl font-black text-emerald-600">100%</h4>
            <span className="text-[10px] text-emerald-700 font-bold">Terverifikasi</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. BAGIAN 1: CEK SISA KURSI REAL-TIME */}
      {/* ============================================================== */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500 text-white">
                <Flame className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Open Government Data
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Pantau Sisa Kursi Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Sisa kuota dan kecepatan pengisian kursi diperbarui secara seketika.
            </p>
          </div>
          <Link
            href="/kuota"
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 group"
          >
            Lihat Semua SMA Negeri <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kuotaList.slice(0, 4).map((item) => (
            <QuotaBurnRateCard
              key={`${item.sekolah_id}-${item.jalur}`}
              kuotaItem={item}
              onSimulateAdd={handleSimulateAdd}
            />
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BAGIAN 2: ALUR PENDAFTARAN 4 LANGKAH */}
      {/* ============================================================== */}
      <section className="mb-12 bg-gradient-to-r from-slate-950 via-[#1E3A8A] to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/40">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
            Public Service Tracking
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            Alur Pendaftaran 4 Langkah
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Dari penentuan jalur seleksi hingga bukti tanda terima QR resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs mb-2.5 shadow">
              01
            </span>
            <h4 className="font-bold text-xs text-white">Pilih Jalur & SMAN</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Tentukan jalur seleksi dan sekolah pilihan utama serta cadangan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs mb-2.5 shadow">
              02
            </span>
            <h4 className="font-bold text-xs text-white">Isi Formulir & Titik Rumah</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Lengkapi biodata NIK, nilai rapor, dan tandai koordinat domisili di peta.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-xs mb-2.5 shadow">
              03
            </span>
            <h4 className="font-bold text-xs text-white">Pantau Status Berkas</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Dapatkan tiket berenkripsi dan pantau hasil verifikasi berkas seketika.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
            <span className="w-7 h-7 rounded-full bg-[#10B981] text-white font-black flex items-center justify-center text-xs mb-2.5 shadow">
              04
            </span>
            <h4 className="font-bold text-xs text-white">Terima Tanda Terima QR</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Unduh bukti pendaftaran digital resmi bertanda QR hash yang sah.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs hover:scale-[1.01] transition shadow-lg shadow-pink-500/25"
          >
            <span>Mulai Pendaftaran</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. BAGIAN 3: CEK KEJUJURAN DATA & DETEKTOR TITIK CURANG */}
      {/* ============================================================== */}
      <section className="mb-12">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#1E3A8A] text-white">
              <Scale className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Dual-Truth & Geo-Discrepancy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Validasi Data & Deteksi Anomali Zonasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Penyandingan data formulir dengan catatan kependudukan Dukcapil dan rapor Dapodik.
          </p>
        </div>

        {/* Tampilan Perbandingan Berdampingan */}
        <DualTruthComparatorView pendaftaranList={initialPendaftaran} />

        {/* Alat Peta Cek Selisih Titik Rumah */}
        <div className="mt-6">
          <GeoDiscrepancyMap />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. BAGIAN 4: KALKULATOR PELUANG LOLOS SMAN */}
      {/* ============================================================== */}
      <section className="mb-12">
        <PassingGradeCalculator />
      </section>

      {/* ============================================================== */}
      {/* 7. BAGIAN 5: PETA SEBARAN & WILAYAH KURANG SMA */}
      {/* ============================================================== */}
      <section className="mb-12">
        <InteractiveZonasiHeatmap />
      </section>

      {/* ============================================================== */}
      {/* 8. BAGIAN 6: LAPOR KECURANGAN RAHASIA (WHISTLEBLOWER) */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-r from-slate-950 via-[#1E3A8A] to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-blue-900/40 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
            Pengaduan Warga Anonim
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Lapor Anomali atau Kejanggalan Zonasi
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Laporkan kecurangan numpang KK atau anomali data secara 100% anonim tanpa pencatatan IP. Pantau progres investigasi melalui token rahasia.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/whistleblower"
              className="px-5 py-2.5 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition flex items-center gap-2"
            >
              <span>Kirim Laporan Anonim</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/audit-log"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Log Audit Publik</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const initialKuota = db.getAllKuotaWithMetrics();
  const initialPendaftaran = db.getAllPendaftaran();

  return {
    props: {
      initialKuota: JSON.parse(JSON.stringify(initialKuota)),
      initialPendaftaran: JSON.parse(JSON.stringify(initialPendaftaran))
    }
  };
}
