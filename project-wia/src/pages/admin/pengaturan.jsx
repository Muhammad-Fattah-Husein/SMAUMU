import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Settings, Save, CheckCircle2, ShieldCheck, Database, Key } from 'lucide-react';

export default function AdminPengaturanPage() {
  const [toleranceMeters, setToleranceMeters] = useState(150);
  const [anomalyMeters, setAnomalyMeters] = useState(500);
  const [minKkMonths, setMinKkMonths] = useState(12);
  const [burnRateInterval, setBurnRateInterval] = useState(30);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan Sistem & Parameter Regulasi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi ambang batas toleransi geospasial, aturan Kartu Keluarga, dan integrasi API data publik.
          </p>
        </div>

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pengaturan berhasil diperbarui dan diterapkan ke seluruh modul validasi.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Parameter Detektor Anomali Geospasial (Geo-Discrepancy)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Batas Toleransi Deviasi GPS (Meter)
                </label>
                <input
                  type="number"
                  value={toleranceMeters}
                  onChange={(e) => setToleranceMeters(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Deviasi di bawah angka ini dianggap presisi wajar.</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Ambang Batas Anomali Kritis / Fraud (Meter)
                </label>
                <input
                  type="number"
                  value={anomalyMeters}
                  onChange={(e) => setAnomalyMeters(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Deviasi melampaui ini memicu penangguhan status otomatis.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Validasi Kependudukan & Interval Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Masa Tinggal Minimal di KK (Bulan)
                </label>
                <input
                  type="number"
                  value={minKkMonths}
                  onChange={(e) => setMinKkMonths(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Regulasi standar Permendikbud: 12 Bulan (1 tahun).</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Interval Refresh Live Quota Burn-Rate (Detik)
                </label>
                <input
                  type="number"
                  value={burnRateInterval}
                  onChange={(e) => setBurnRateInterval(parseInt(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Frekuensi sinkronisasi kuota real-time ke masyarakat.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-xs transition flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Simpan Konfigurasi</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
