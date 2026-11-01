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
            Decision Support
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulator Peluang Masuk SMAN
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
          Kalkulasi prediktif peluang diterima berdasarkan sisa kuota, jarak rumah, dan nilai rapor.
        </p>
      </div>

      <div className="mb-10">
        <PassingGradeCalculator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Metrik Seleksi</h4>
          <h3 className="font-extrabold text-slate-900 text-xs">Jarak & Rapor</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Bobot jarak domisili 85% pada jalur zonasi, atau nilai rapor semester pada jalur prestasi.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Peringkat Dinamis</h4>
          <h3 className="font-extrabold text-slate-900 text-xs">Estimasi Posisi Kuota</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Menghasilkan perkiraan peringkat aktif Anda terhadap daya tampung kelas SMAN pilihan.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Rekomendasi</h4>
          <h3 className="font-extrabold text-slate-900 text-xs">Opsi Alternatif</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Menyarankan sekolah terdekat alternatif dengan kuota yang belum padat pendaftar.
          </p>
        </div>
      </div>
    </Layout>
  );
}
