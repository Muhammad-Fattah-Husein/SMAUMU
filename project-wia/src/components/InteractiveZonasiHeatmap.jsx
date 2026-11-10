import dynamic from 'next/dynamic';
import { Layers, MapPin, School, AlertTriangle, Sparkles } from 'lucide-react';

// Load komponen peta secara dinamis di browser (SSR = false untuk kompatibilitas Leaflet)
const ZonasiBlankSpotMapView = dynamic(() => import('./ZonasiBlankSpotMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] sm:h-[600px] bg-[#121212] rounded-3xl border border-white/10 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-9 h-9 border-3 border-orange-500/30 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-300">Memuat Visual Peta Sebaran Zonasi & Blank-Spot...</p>
    </div>
  )
});

export default function InteractiveZonasiHeatmap() {
  return (
    <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 overflow-hidden shadow-sm p-4 sm:p-6 space-y-4">
      {/* Header Visual Peta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#F97316] text-white">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Analitik Geospasial PPDB
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            Peta Sebaran Zonasi & Blank-Spot SMA
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-2xl">
            Visualisasi geospasial sebaran SMAN DKI Jakarta, radius zonasi tempat tinggal (3,2 - 3,8 km), dan pemetaan kawasan defisit kuota kursi (Blank-Spot).
          </p>
        </div>

        {/* Ringkasan Indikator Cepat */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#F97316] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
            <span>6 SMAN Zonasi</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[#FB7185] font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>3 Titik Blank-Spot</span>
          </div>
        </div>
      </div>

      {/* Visual Peta Interaktif Utama */}
      <div className="w-full">
        <ZonasiBlankSpotMapView />
      </div>
    </div>
  );
}
