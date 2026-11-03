import Layout from '@/components/Layout';
import PassingGradeCalculator from '@/components/PassingGradeCalculator';
import { Calculator, BarChart3, Info } from 'lucide-react';

export default function SimulatorPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <Calculator className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Decision Support System
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulator Zonasi Berbasis Peta Rumah Siswa
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
          Tentukan lokasi rumah Anda di peta interaktif Jakarta untuk membandingkan jarak spasial riil (Haversine) dan peluang diterima di seluruh SMAN SMAUMU secara otomatis tanpa input manual.
        </p>
      </div>

      <div className="mb-10">
        <PassingGradeCalculator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Peta Spasial Riil</h4>
          <h3 className="font-extrabold text-slate-900 text-xs">Bebas Input Manual</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Cukup klik atau pilih preset pemukiman rumah pada peta untuk mengunci koordinat GPS domisili Anda.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Komparasi Serentak</h4>
          <h3 className="font-extrabold text-slate-900 text-xs">Seluruh SMAN SMAUMU</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Menghitung jarak Great-Circle (Haversine) ke seluruh 6 sekolah sekaligus dan mengurutkannya dari yang terdekat.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Estimasi Zonasi</h4>
          <h3 className="font-extrabold text-slate-900 text-xs">Probabilitas & Ranking</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Memetakan jangkauan radius zonasi dan memperkirakan urutan peringkat kuota penerimaan secara transparan.
          </p>
        </div>
      </div>
    </Layout>
  );
}
