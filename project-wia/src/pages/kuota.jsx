import { useState } from 'react';
import Layout from '@/components/Layout';
import QuotaBurnRateCard from '@/components/QuotaBurnRateCard';
import InteractiveZonasiHeatmap from '@/components/InteractiveZonasiHeatmap';
import { db } from '@/services/db';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { Flame, Filter, School, Download, RefreshCw } from 'lucide-react';

export default function KuotaPage({ initialKuota }) {
  const [kuotaList, setKuotaList] = useState(initialKuota);
  const [selectedSekolah, setSelectedSekolah] = useState('all');
  const [selectedJalur, setSelectedJalur] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredKuota = kuotaList.filter((item) => {
    const matchSchool = selectedSekolah === 'all' || item.sekolah_id === parseInt(selectedSekolah);
    const matchJalur = selectedJalur === 'all' || item.jalur === selectedJalur;
    return matchSchool && matchJalur;
  });

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
    setKuotaList(prev => prev.map(item => {
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
    }));
  };

  const exportDataJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(kuotaList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SMAUMU_Data_Sisa_Kursi_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Layout>
      {/* Header Ringkas */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#1E3A8A] text-white">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              Open Government Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pantau Sisa Kuota SMAN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
            Sisa daya tampung per jalur pendaftaran dan laju pengisian kursi per jam secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
          <button
            onClick={exportDataJSON}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Sekolah & Jalur */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-700 shrink-0">Sekolah:</span>
          <select
            value={selectedSekolah}
            onChange={(e) => setSelectedSekolah(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#2563EB] outline-none"
          >
            <option value="all">Semua SMAN ({INITIAL_SEKOLAH.length})</option>
            {INITIAL_SEKOLAH.map((s) => (
              <option key={s.id} value={s.id}>{s.nama_sekolah}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-bold text-slate-700 shrink-0">Pilih Jalur Masuk:</span>
          <select
            value={selectedJalur}
            onChange={(e) => setSelectedJalur(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#2563EB] outline-none"
          >
            <option value="all">Semua Jalur Masuk</option>
            <option value="zonasi">Jalur Jarak Rumah / Zonasi (50%)</option>
            <option value="afirmasi">Jalur Bantuan KJP & Inklusi (20%)</option>
            <option value="prestasi_akademik">Jalur Nilai Rapor Siswa (20%)</option>
            <option value="perpindahan_tugas">Jalur Pindah Tugas Orang Tua (5%)</option>
          </select>
        </div>
      </div>

      {/* Grid Kartu Sisa Kursi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
        {filteredKuota.map((item) => (
          <QuotaBurnRateCard
            key={`${item.sekolah_id}-${item.jalur}`}
            kuotaItem={item}
            onSimulateAdd={handleSimulateAdd}
          />
        ))}
      </div>

      {/* Peta Sebaran & Blank-Spot */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-900">
            Peta Lokasi Sekolah & Wilayah yang Kekurangan SMA Negeri
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menganalisis sebaran sekolah terhadap kecamatan yang lulusan SMP-nya banyak agar semua anak punya kesempatan sekolah yang adil.
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
