import Layout from '@/components/Layout';
import DualTruthComparatorView from '@/components/DualTruthComparatorView';
import { db } from '@/services/db';
import { Compass, ShieldCheck, Info } from 'lucide-react';

export default function KomparatorPage({ pendaftaranList }) {
  return (
    <Layout>
      {/* Header Halaman */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Validasi Data & Dukcapil
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Komparasi Data & Validitas Domisili
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
          Penyandingan klaim formulir dengan data Dukcapil dan rapor Dapodik untuk mendeteksi ketidaksesuaian data kependudukan secara transparan.
        </p>
      </div>

      {/* Main Dual-Truth Side-by-Side Comparison */}
      <div className="mb-10">
        <DualTruthComparatorView pendaftaranList={pendaftaranList} />
      </div>

      {/* Methodological Context Box */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800">
        <h3 className="font-bold text-xs text-blue-400 flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Integritas Data Dual-Truth
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sistem otomatis menandai berkas untuk <em>Tinjauan Lapangan Faktual</em> apabila masa tinggal KK kurang dari 12 bulan berturut-turut atau terdapat ketidaksesuaian nomor KK dengan pangkalan data resmi Dinas Kependudukan dan Pencatatan Sipil.
        </p>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const pendaftaranList = db.getAllPendaftaran();
  return {
    props: {
      pendaftaranList: JSON.parse(JSON.stringify(pendaftaranList))
    }
  };
}
