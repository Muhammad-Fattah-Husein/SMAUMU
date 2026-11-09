import Layout from '@/components/Layout';
import DualTruthComparatorView from '@/components/DualTruthComparatorView';
import GeoDiscrepancyMap from '@/components/GeoDiscrepancyMap';
import { db } from '@/services/db';
import { Compass, ShieldCheck, Info } from 'lucide-react';

export default function KomparatorPage({ pendaftaranList }) {
  return (
    <Layout>
      {/* Header Ringkas */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Dual-Truth & Geospasial
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Komparasi Data & Validitas Domisili
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
          Penyandingan klaim formulir dengan data Dukcapil dan rapor Dapodik untuk mendeteksi anomali zonasi.
        </p>
      </div>

      {/* Main Dual-Truth Side-by-Side Comparison */}
      <div className="mb-10">
        <DualTruthComparatorView pendaftaranList={pendaftaranList} />
      </div>

      {/* Geo-Discrepancy Spatial Engine & Presets */}
      <div className="mb-10">
        <div className="mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Uji Deviasi Koordinat (Haversine)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kalkulasi jarak Great-Circle antara titik klaim vs alamat KK resmi sistem.
          </p>
        </div>
        <GeoDiscrepancyMap />
      </div>

      {/* Methodological Context Box */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-5 border border-slate-800">
        <h3 className="font-bold text-xs text-pink-400 flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          Integritas Data Dual-Truth
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Sistem mengunci berkas ke <em>Tinjauan Lapangan</em> bila deviasi koordinat melebihi 150 meter atau masa tinggal KK kurang dari 12 bulan berturut-turut.
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
