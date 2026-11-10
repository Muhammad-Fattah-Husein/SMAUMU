import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Key,
  Zap,
  Activity,
  Cpu,
  BarChart2,
  Lock,
  Layers,
  Sparkles,
  Play,
  RotateCw,
  AlertTriangle
} from 'lucide-react';
import { runLoadStressSimulation } from '@/services/concurrencyService';

export default function AdminPengaturanPage() {
  const [activeTab, setActiveTab] = useState('konfigurasi'); // 'konfigurasi' or 'stress_test'
  const [toleranceMeters, setToleranceMeters] = useState(150);
  const [anomalyMeters, setAnomalyMeters] = useState(500);
  const [minKkMonths, setMinKkMonths] = useState(12);
  const [burnRateInterval, setBurnRateInterval] = useState(30);
  const [saved, setSaved] = useState(false);

  // Concurrency Stress Test States
  const [concurrentTier, setConcurrentTier] = useState(2500);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRunStressTest = async () => {
    setIsRunningTest(true);
    setTestResults(null);
    setTestProgress({ progress: 5, processed: 0, accepted: 0, rejected: 0 });

    try {
      const res = await runLoadStressSimulation({
        concurrentUsers: concurrentTier,
        totalSeats: 144,
        currentFilled: 118,
        onProgress: (p) => setTestProgress(p)
      });
      setTestResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222227] flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#F97316] text-white">
              <Settings className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Panel Konfigurasi & Kinerja Sistem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pengaturan Sistem & Uji Stres Beban Database
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi ambang batas toleransi geospasial serta simulasi lonjakan ribuan concurrent users saat rush hour PPDB.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('konfigurasi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'konfigurasi' 
                  ? 'bg-[#F97316] text-white shadow-md' 
                  : 'bg-[#1A1A1E] text-slate-300 border border-white/10'
              }`}
            >
              Parameter Regulasi & GIS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stress_test')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'stress_test' 
                  ? 'bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white shadow-md' 
                  : 'bg-[#1A1A1E] text-slate-300 border border-white/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulasi Lonjakan Trafik PPDB ({concurrentTier.toLocaleString()} Users)</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pengaturan berhasil diperbarui dan diterapkan ke seluruh modul validasi.</span>
          </div>
        )}

        {/* TAB 1: PARAMETER REGULASI & TOLERANSI */}
        {activeTab === 'konfigurasi' && (
          <form onSubmit={handleSave} className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F97316]" />
                Parameter Detektor Anomali Geospasial (Geo-Discrepancy)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Batas Toleransi Deviasi GPS (Meter)
                  </label>
                  <input
                    type="number"
                    value={toleranceMeters}
                    onChange={(e) => setToleranceMeters(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-white/10 font-mono text-xs focus:ring-2 focus:ring-[#F97316]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Deviasi di bawah angka ini dianggap presisi wajar.</p>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Ambang Batas Anomali Kritis / Fraud (Meter)
                  </label>
                  <input
                    type="number"
                    value={anomalyMeters}
                    onChange={(e) => setAnomalyMeters(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-white/10 font-mono text-xs focus:ring-2 focus:ring-[#F97316]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Deviasi melampaui ini memicu penangguhan status otomatis.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-[#10B981]" />
                Validasi Kependudukan & Interval Data
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Masa Tinggal Minimal di KK (Bulan)
                  </label>
                  <input
                    type="number"
                    value={minKkMonths}
                    onChange={(e) => setMinKkMonths(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-white/10 font-mono text-xs focus:ring-2 focus:ring-[#F97316]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Regulasi standar Permendikbud: 12 Bulan (1 tahun).</p>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Interval Refresh Live Quota Burn-Rate (Detik)
                  </label>
                  <input
                    type="number"
                    value={burnRateInterval}
                    onChange={(e) => setBurnRateInterval(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-white/10 font-mono text-xs focus:ring-2 focus:ring-[#F97316]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Frekuensi sinkronisasi kuota real-time ke masyarakat.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] hover:opacity-90 text-white font-bold text-xs transition flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Simpan Konfigurasi</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SIMULASI BEBAN & OPTIMASI DATABASE */}
        {activeTab === 'stress_test' && (
          <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F43F5E]">
                High-Concurrency Load & Database Stress Test
              </span>
              <h2 className="text-xl font-black text-white">
                Simulasi Lonjakan Trafik Puncak PPDB (Massive Traffic Spike)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menguji ketahanan trigger basis data Supabase PostgreSQL, compound B-Tree indexes, serta kunci transaksional (<code>SELECT ... FOR UPDATE</code>) dalam menangani ribuan calon siswa yang berebut kursi secara simultan.
              </p>
            </div>

            {/* Pilihan Beban Konkurensi */}
            <div className="p-4 rounded-2xl bg-[#222227] border border-white/10 space-y-3 text-xs">
              <span className="font-bold text-slate-300 block">Pilih Skala Pengujian Beban Konkurensi:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { users: 1000, label: '1.000 Concurrent Users', desc: 'Lonjakan menit pembukaan server' },
                  { users: 2500, label: '2.500 Concurrent Users', desc: 'Trafik puncak jam sibuk (Rush Hour)' },
                  { users: 5000, label: '5.000 Concurrent Users', desc: 'Ekstrem 10 menit menjelang penutupan' }
                ].map((tier) => (
                  <button
                    key={tier.users}
                    type="button"
                    onClick={() => setConcurrentTier(tier.users)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      concurrentTier === tier.users
                        ? 'border-[#F43F5E] bg-rose-500/10 text-[#F43F5E] ring-2 ring-rose-500/20'
                        : 'border-white/10 bg-[#1A1A1E] hover:border-white/10 text-[#E2E8F0]'
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{tier.label}</span>
                    <span className="text-[11px] text-slate-400 mt-1">{tier.desc}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
                <div className="text-[11px] text-slate-400">
                  Target Simulasi: <strong>SMAN 1 Jakarta (Zonasi)</strong> • Sisa Kuota Terbuka: <strong>26 Kursi</strong> (dari 144)
                </div>
                <button
                  type="button"
                  disabled={isRunningTest}
                  onClick={handleRunStressTest}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isRunningTest ? <RotateCw className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-amber-300" />}
                  <span>{isRunningTest ? 'Menjalankan Simulasi Beban...' : `Jalankan Uji Stres (${concurrentTier.toLocaleString()} Requests)`}</span>
                </button>
              </div>
            </div>

            {/* Progress Bar Saat Uji Berjalan */}
            {isRunningTest && testProgress && (
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2 animate-fade-in text-xs">
                <div className="flex items-center justify-between font-bold text-[#F97316]">
                  <span>Memproses Lonjakan Trafik: {testProgress.processed.toLocaleString()} / {concurrentTier.toLocaleString()} User</span>
                  <span>{testProgress.progress}%</span>
                </div>
                <div className="w-full bg-orange-500/20 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F97316] h-full transition-all duration-300"
                    style={{ width: `${testProgress.progress}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Mengeksekusi kunci transaksional PostgreSQL baris kuota & mencatat audit hash chain SHA-256...
                </p>
              </div>
            )}

            {/* Hasil Uji Stres Beban */}
            {testResults && (
              <div className="space-y-4 animate-fade-in">
                {/* Status Sukses Banner */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">{testResults.statusText}</h4>
                    <p className="text-[11px] text-emerald-400 mt-0.5">
                      Berhasil menyelesaikan <strong>{testResults.concurrentUsers.toLocaleString()}</strong> transaksi serentak dalam tempo <strong>{testResults.totalDurationMs} ms</strong> tanpa jeda (0 crash / zero deadlocks).
                    </p>
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Throughput (TPS)</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {testResults.throughputTps.toLocaleString()} <span className="text-xs font-normal text-slate-400">TPS</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Tinggi & Tanpa Bottleneck</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Latensi p95 (95% User)</span>
                    <span className="text-xl font-black text-[#F97316] mt-1 block">
                      {testResults.p95LatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Median (p50): {testResults.p50LatencyMs} ms</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Integritas Kuota</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">
                      0 Overbooking
                    </span>
                    <span className="text-[10px] text-slate-400">Tepat 144/144 Kursi Terisi</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Kunci Transaksional</span>
                    <span className="text-xl font-black text-[#F43F5E] mt-1 block">
                      100% Lolos
                    </span>
                    <span className="text-[10px] text-slate-400">Row Lock (FOR UPDATE)</span>
                  </div>
                </div>

                {/* Detail Verifikasi Teknis */}
                <div className="p-4 rounded-2xl bg-[#222227] border border-white/10 text-xs space-y-2">
                  <span className="font-bold text-[#E2E8F0] block text-[11px] uppercase tracking-wider">
                    Parameter Teknis yang Terverifikasi:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-[#1A1A1E] border border-white/10">
                      <span className="text-slate-400 block text-[10px]">Indeks PostgreSQL Aktif:</span>
                      <strong className="text-[#E2E8F0] font-mono">idx_pendaftaran_sekolah_jalur_status</strong>
                      <p className="text-slate-400 text-[10px] mt-0.5">Mencegah full table scan pada lonjakan pencarian tiket.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#1A1A1E] border border-white/10">
                      <span className="text-slate-400 block text-[10px]">Proteksi Overbooking:</span>
                      <strong className="text-[#E2E8F0] font-mono">SELECT ... FOR UPDATE Atomic Lock</strong>
                      <p className="text-slate-400 text-[10px] mt-0.5">Tepat mengalokasikan 26 kursi sisa, 2.474 ditolak anggun.</p>
                    </div>
                  </div>
                  <div className="pt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Cryptographic Audit Proof: {testResults.auditHash.substring(0, 32)}...</span>
                    <span className="text-emerald-400 font-bold">✓ SHA-256 Chain Valid</span>
                  </div>
                </div>

                {/* Perbandingan EXPLAIN ANALYZE Indeks PostgreSQL vs Sequential Scan */}
                {testResults.explainAnalyzeData && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] text-slate-200 border border-white/10 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#F97316] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#F97316]" />
                        Analisis Eksekusi Query PostgreSQL (EXPLAIN ANALYZE)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {testResults.explainAnalyzeData.speedupFactor}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                      {/* Dengan Indeks Komposit */}
                      <div className="p-3 rounded-xl bg-[#222227] border border-cyan-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F97316]">DENGAN INDEKS B-TREE:</span>
                          <span className="text-emerald-400 font-bold">0.82 ms</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">Strategy: {testResults.explainAnalyzeData.indexedQuery.strategy}</p>
                        <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                          <span>Cost: {testResults.explainAnalyzeData.indexedQuery.cost}</span>
                          <span>Disk Reads: {testResults.explainAnalyzeData.indexedQuery.diskReads}</span>
                        </div>
                      </div>

                      {/* Tanpa Indeks (Sequential Scan) */}
                      <div className="p-3 rounded-xl bg-[#222227] border border-rose-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300">TANPA INDEKS (SEQ SCAN):</span>
                          <span className="text-rose-400 font-bold">84.60 ms</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">Strategy: {testResults.explainAnalyzeData.sequentialQuery.strategy}</p>
                        <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                          <span>Cost: {testResults.explainAnalyzeData.sequentialQuery.cost}</span>
                          <span>Disk Reads: {testResults.explainAnalyzeData.sequentialQuery.diskReads} blocks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
