import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import SchoolQuotaCard from '@/components/SchoolQuotaCard';
import InteractiveZonasiHeatmap from '@/components/InteractiveZonasiHeatmap';
import { db } from '@/services/db';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { 
  Flame, 
  Filter, 
  School, 
  Download, 
  RefreshCw, 
  Search, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { formatPercentage } from '@/utils/formatters';

export default function KuotaPage({ initialKuota }) {
  const [kuotaList, setKuotaList] = useState(initialKuota);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKota, setSelectedKota] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fungsi perbarui data dari API
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/kuota');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setKuotaList(data.data);
          return;
        }
      }
    } catch (e) {
      console.warn('API route not available (static host), using local refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Simulasi penambahan berkas (client-side & API fallback)
  const handleSimulateAdd = async (sekolahId, jalur) => {
    try {
      const res = await fetch('/api/kuota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sekolah_id: sekolahId, jalur, deltaApplicants: 1, deltaFilled: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          handleRefresh();
          return;
        }
      }
    } catch (err) {
      console.warn('Simulating locally for static environment');
    }

    // Local client-side simulation fallback for GitHub Pages
    setKuotaList((prev) =>
      prev.map((item) => {
        if (item.sekolah_id === sekolahId && item.jalur === jalur) {
          const newFilled = Math.min(item.total_kuota, item.kuota_terisi + 1);
          const newApplicants = item.pendaftar_total + 1;
          const newBurn = parseFloat((item.burn_rate_per_jam + 0.3).toFixed(1));
          const rem = Math.max(0, item.total_kuota - newFilled);
          const hrs = newBurn > 0 ? parseFloat((rem / newBurn).toFixed(1)) : 99;
          return {
            ...item,
            kuota_terisi: newFilled,
            pendaftar_total: newApplicants,
            burn_rate_per_jam: newBurn,
            metrics: {
              remainingSeats: rem,
              saturationPercentage: (newFilled / item.total_kuota) * 100,
              hoursUntilFull: hrs,
              isCritical: rem <= 5 || hrs <= 2
            }
          };
        }
        return item;
      })
    );
  };

  // 1. Kelompokkan Data Kuota Per-Sekolah (Bukan Per-Jalur Saja)
  const schoolsData = useMemo(() => {
    return INITIAL_SEKOLAH.map((school) => {
      const schoolJalurList = kuotaList.filter((k) => k.sekolah_id === school.id);
      const totalKuota = schoolJalurList.reduce((acc, curr) => acc + curr.total_kuota, 0) || school.kuota_total;
      const totalTerisi = schoolJalurList.reduce((acc, curr) => acc + curr.kuota_terisi, 0);
      const totalPendaftar = schoolJalurList.reduce((acc, curr) => acc + curr.pendaftar_total, 0);
      const avgBurnRate = parseFloat(
        (schoolJalurList.reduce((acc, curr) => acc + curr.burn_rate_per_jam, 0)).toFixed(1)
      );
      const remainingSeats = Math.max(0, totalKuota - totalTerisi);
      const saturationPct = totalKuota > 0 ? (totalTerisi / totalKuota) * 100 : 0;

      let statusCode = 'tersedia';
      if (saturationPct >= 100 || remainingSeats === 0) {
        statusCode = 'penuh';
      } else if (saturationPct >= 85) {
        statusCode = 'hampir_penuh';
      } else if (saturationPct >= 65) {
        statusCode = 'cepat_terisi';
      }

      return {
        school,
        jalurList: schoolJalurList,
        totalKuota,
        totalTerisi,
        totalPendaftar,
        avgBurnRate,
        remainingSeats,
        saturationPct,
        statusCode
      };
    });
  }, [kuotaList]);

  // 2. Filter & Sort Data Per-Sekolah
  const filteredSchools = useMemo(() => {
    return schoolsData
      .filter((item) => {
        // Filter Kata Kunci Pencarian (Nama SMAN, Kecamatan, NPSN)
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q || 
          item.school.nama_sekolah.toLowerCase().includes(q) ||
          item.school.kecamatan.toLowerCase().includes(q) ||
          item.school.npsn.includes(q);

        // Filter Kota
        const matchKota = selectedKota === 'all' || item.school.kota === selectedKota;

        // Filter Status
        const matchStatus = selectedStatus === 'all' || item.statusCode === selectedStatus;

        return matchSearch && matchKota && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'terisi_desc') return b.saturationPct - a.saturationPct;
        if (sortBy === 'sisa_desc') return b.remainingSeats - a.remainingSeats;
        if (sortBy === 'laju_desc') return b.avgBurnRate - a.avgBurnRate;
        return a.school.id - b.school.id; // default urut id
      });
  }, [schoolsData, searchQuery, selectedKota, selectedStatus, sortBy]);

  // Statistik Agregat Seluruh Sekolah
  const aggregateMetrics = useMemo(() => {
    const totalCap = schoolsData.reduce((acc, s) => acc + s.totalKuota, 0);
    const totalFilled = schoolsData.reduce((acc, s) => acc + s.totalTerisi, 0);
    const totalApplicants = schoolsData.reduce((acc, s) => acc + s.totalPendaftar, 0);
    const avgSaturation = totalCap > 0 ? (totalFilled / totalCap) * 100 : 0;
    return { totalCap, totalFilled, totalApplicants, avgSaturation };
  }, [schoolsData]);

  // Ekspor Data JSON
  const exportDataJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schoolsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SMAUMU_Data_Siswa_Sekolah_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Layout>
      {/* ============================================================== */}
      {/* 1. HEADER HALAMAN & AKSI */}
      {/* ============================================================== */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#F97316] text-white">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Open Government Data • Real-Time Capacity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pantau Kuota Siswa Per-Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
            Informasi keterisian kuota siswa ditampilkan per-sekolah dengan bar progres visual keseluruhan dan rincian per jalur pendaftaran.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl border border-white/10 bg-[#1A1A1E] hover:bg-white/5 text-xs font-bold text-slate-300 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Perbarui Data</span>
          </button>
          <button
            onClick={exportDataJSON}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh JSON</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. STATISTIK RINGKAS SELURUH SMAN */}
      {/* ============================================================== */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-white/10 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#F97316] shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Total SMAN</p>
            <h4 className="text-lg sm:text-xl font-black text-white">
              {schoolsData.length} Sekolah
            </h4>
            <span className="text-[10px] text-[#F97316] font-bold">DKI Jakarta</span>
          </div>
        </div>

        <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-white/10 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-[#F43F5E] shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Total Kuota Terisi</p>
            <h4 className="text-lg sm:text-xl font-black text-white">
              {aggregateMetrics.totalFilled} / {aggregateMetrics.totalCap}
            </h4>
            <span className="text-[10px] text-[#F43F5E] font-bold">
              {formatPercentage(aggregateMetrics.avgSaturation)} Terisi
            </span>
          </div>
        </div>

        <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-white/10 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Sisa Bangku Terbuka</p>
            <h4 className="text-lg sm:text-xl font-black text-emerald-400">
              {aggregateMetrics.totalCap - aggregateMetrics.totalFilled} Kursi
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold">Tersedia untuk Siswa</span>
          </div>
        </div>

        <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-white/10 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Total Berkas Masuk</p>
            <h4 className="text-lg sm:text-xl font-black text-white">
              {aggregateMetrics.totalApplicants} Siswa
            </h4>
            <span className="text-[10px] text-amber-400 font-bold">Seluruh Jalur</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. TOOLBAR PENCARIAN & FILTER PER-SEKOLAH */}
      {/* ============================================================== */}
      <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-white/10 shadow-sm mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        {/* Input Pencarian */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari SMAN, kecamatan (contoh: SMAN 1, Tebet, Bulungan)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-[#222227] text-[#E2E8F0] font-medium focus:bg-[#1A1A1E] focus:ring-2 focus:ring-[#F97316] outline-none transition"
          />
        </div>

        {/* Filter Wilayah & Status */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Filter Kota */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="font-bold text-slate-400 shrink-0">Wilayah:</span>
            <select
              value={selectedKota}
              onChange={(e) => setSelectedKota(e.target.value)}
              className="px-3 py-2 rounded-xl border border-white/10 bg-[#1A1A1E] text-[#E2E8F0] font-bold focus:ring-2 focus:ring-[#F97316] outline-none w-full sm:w-auto"
            >
              <option value="all">Semua Wilayah</option>
              <option value="Jakarta Pusat">Jakarta Pusat</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
            </select>
          </div>

          {/* Filter Status Keterisian */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="font-bold text-slate-400 shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-white/10 bg-[#1A1A1E] text-[#E2E8F0] font-bold focus:ring-2 focus:ring-[#F97316] outline-none w-full sm:w-auto"
            >
              <option value="all">Semua Status</option>
              <option value="tersedia">Tersedia (&lt;65%)</option>
              <option value="cepat_terisi">Cepat Terisi (65-84%)</option>
              <option value="hampir_penuh">Hampir Penuh (&ge;85%)</option>
              <option value="penuh">Penuh (100%)</option>
            </select>
          </div>

          {/* Pengurutan (Sort) */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-white/10 bg-[#1A1A1E] text-[#E2E8F0] font-bold focus:ring-2 focus:ring-[#F97316] outline-none w-full sm:w-auto"
            >
              <option value="default">Urutkan SMAN (Default)</option>
              <option value="terisi_desc">Paling Banyak Terisi (%)</option>
              <option value="sisa_desc">Sisa Kursi Terbanyak</option>
              <option value="laju_desc">Laju Pendaftaran Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. GRID KARTU PER-SEKOLAH (DENGAN BAR KUOTA TERISI) */}
      {/* ============================================================== */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          {filteredSchools.map((item) => (
            <SchoolQuotaCard
              key={item.school.id}
              schoolData={item}
              onSimulateAdd={handleSimulateAdd}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-10 text-center mb-16">
          <School className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-black text-[#E2E8F0] text-base">Tidak ada sekolah yang cocok</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter wilayah dan status.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedKota('all');
              setSelectedStatus('all');
              setSortBy('default');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-500/10 text-[#F97316] font-bold text-xs hover:bg-orange-500/15 transition"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PETA SEBARAN & WILAYAH KURANG SMA (HEATMAP) */}
      {/* ============================================================== */}
      <section className="mb-12">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#10B981] text-white">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Analisis Spasial Zonasi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Peta Lokasi SMAN & Deteksi Blank-Spot Zonasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Menganalisis sebaran sekolah percontohan terhadap wilayah kepadatan lulusan SMP agar seluruh anak memiliki hak akses pendidikan yang adil.
          </p>
        </div>
        <InteractiveZonasiHeatmap />
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const initialKuota = db.getAllKuotaWithMetrics();
  return {
    props: {
      initialKuota: JSON.parse(JSON.stringify(initialKuota))
    }
  };
}
