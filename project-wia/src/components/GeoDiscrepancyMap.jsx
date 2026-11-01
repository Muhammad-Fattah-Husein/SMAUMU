import { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Crosshair, 
  RotateCcw
} from 'lucide-react';
import { detectGeoDiscrepancy } from '@/services/geoService';
import { formatDistance } from '@/utils/formatters';

export default function GeoDiscrepancyMap({ 
  initialSchool = { id: 2, name: 'SMAN 8 Jakarta (Bukit Duri)', lat: -6.223400, lng: 106.858712 },
  initialClaimed = { lat: -6.224100, lng: 106.859200, label: 'Klaim Pendaftar (Tebet)' },
  initialVerified = { lat: -6.234500, lng: 106.871000, label: 'Resmi Dukcapil (Rawamangun)' }
}) {
  const [school, setSchool] = useState(initialSchool);
  const [claimedLat, setClaimedLat] = useState(initialClaimed.lat);
  const [claimedLng, setClaimedLng] = useState(initialClaimed.lng);
  const [verifiedLat, setVerifiedLat] = useState(initialVerified.lat);
  const [verifiedLng, setVerifiedLng] = useState(initialVerified.lng);

  // Perhitungan otomatis selisih jarak
  const analysis = detectGeoDiscrepancy(
    claimedLat,
    claimedLng,
    verifiedLat,
    verifiedLng,
    school.lat,
    school.lng
  );

  const isAnomalous = analysis.anomalyStatus === 'anomali_kritis_fraud';
  const isWarning = analysis.anomalyStatus === 'peringatan_toleransi';

  // Contoh kasus nyata yang mudah dipahami warga
  const handleLoadScenario = (type) => {
    if (type === 'fraud') {
      // Kasus curang: Rumah aslinya di Rawamangun (1.68 km), tapi titiknya ditandai di dekat sekolah (310 meter)
      setSchool({ id: 2, name: 'SMAN 8 Jakarta (Bukit Duri)', lat: -6.223400, lng: 106.858712 });
      setClaimedLat(-6.224100);
      setClaimedLng(106.859200);
      setVerifiedLat(-6.234500);
      setVerifiedLng(106.871000);
    } else if (type === 'safe') {
      // Kasus jujur: SMAN 1 Boedoet, titik rumah pas di jalan yang sama
      setSchool({ id: 1, name: 'SMAN 1 Jakarta (Pasar Baru)', lat: -6.166881, lng: 106.837319 });
      setClaimedLat(-6.167200);
      setClaimedLng(106.837800);
      setVerifiedLat(-6.167210);
      setVerifiedLng(106.837820);
    } else if (type === 'borderline') {
      // Kasus selisih tipis karena beda ujung gang
      setSchool({ id: 4, name: 'SMAN 28 Jakarta (Pasar Minggu)', lat: -6.289120, lng: 106.835420 });
      setClaimedLat(-6.287200);
      setClaimedLng(106.832100);
      setVerifiedLat(-6.288900);
      setVerifiedLng(106.834100);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Tombol Uji Kasus Nyata */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1E3A8A] text-white">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">
              Detektor Deviasi Koordinat Geospasial
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kalkulasi selisih jarak geospasial antara titik klaim formulir vs alamat resmi Dukcapil.
          </p>
        </div>

        {/* Pilihan Contoh Kasus */}
        <div className="flex items-center gap-1.5 self-stretch md:self-auto flex-wrap">
          <button
            onClick={() => handleLoadScenario('safe')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition"
          >
            ✓ Titik Valid (SMAN 1)
          </button>
          <button
            onClick={() => handleLoadScenario('borderline')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 transition"
          >
            ! Toleransi Gang (SMAN 28)
          </button>
          <button
            onClick={() => handleLoadScenario('fraud')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#EC4899] text-white hover:bg-[#DB2777] shadow-sm transition"
          >
            ✕ Anomali 1,3 Km (SMAN 8)
          </button>
        </div>
      </div>

      {/* Tampilan Visual Peta & Hasil Cek */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Sisi Kiri: Peta Spasial Visual */}
        <div className="lg:col-span-7 p-6 bg-slate-950 text-white relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs bg-slate-800/90 text-cyan-300 px-3 py-1 rounded-full border border-slate-700 font-semibold">
              ● Radius Aktif
            </span>
            <span className="text-xs text-slate-300 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700 font-bold">
              {school.name}
            </span>
          </div>

          {/* Kotak Perbandingan 3 Titik */}
          <div className="relative z-10 my-4 py-2 flex items-center justify-center">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur space-y-2.5">
              {/* Titik 1: Gerbang Sekolah */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-950/70 border border-blue-800/60">
                <div className="w-7 h-7 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-black text-xs shrink-0">
                  SMU
                </div>
                <div>
                  <p className="text-[10px] text-blue-300 font-bold uppercase">Gerbang Sekolah</p>
                  <p className="font-bold text-xs text-white">{school.name}</p>
                </div>
              </div>

              {/* Jarak Deviasi Antara Titik Klaim vs Titik Asli */}
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px] flex items-center gap-1 font-sans">
                  <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                  Deviasi Titik Koordinat:
                </span>
                <span className={`font-bold font-mono ${isAnomalous ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                  Δ {formatDistance(analysis.coordinateDivergence)}
                </span>
              </div>

              {/* Titik 2: Titik yang diakui pendaftar */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 ${
                  isAnomalous ? 'bg-rose-600' : 'bg-slate-700'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-300 font-bold">Klaim Pendaftar</p>
                    <p className="text-[10px] text-slate-400">Jarak Form</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-300">
                    {formatDistance(analysis.claimedDistanceToSchool)}
                  </span>
                </div>
              </div>

              {/* Titik 3: Alamat Asli Sesuai KK di Dukcapil */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-emerald-400 font-bold">Resmi Dukcapil</p>
                    <p className="text-[10px] text-slate-400">Jarak Riil</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300">
                    {formatDistance(analysis.verifiedDistanceToSchool)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Selisih Jarak */}
          <div className="relative z-10 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-300 text-[11px]">
              Status Pergeseran Jarak:
            </span>
            <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded ${
              isAnomalous ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {analysis.discrepancyDeltaMeters > 50 
                ? `Dimajukan ${formatDistance(analysis.discrepancyDeltaMeters)}`
                : 'Sesuai (Presisi)'}
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Penjelasan Bahasa Sehari-hari */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-white flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Status Validasi Geospasial
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                isAnomalous
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : isWarning
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {isAnomalous ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : isWarning ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isAnomalous ? 'ANOMALI KRITIS (FRAUD)' : isWarning ? 'PERINGATAN TOLERANSI' : 'KOORDINAT VALID'}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
              isAnomalous
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <p>
                {isAnomalous 
                  ? `Sistem mendeteksi deviasi ${formatDistance(analysis.coordinateDivergence)} dari alamat resmi di KK. Berkas otomatis ditahan untuk audit lapangan.`
                  : isWarning
                  ? `Deviasi ${formatDistance(analysis.coordinateDivergence)} meter masih dalam batas toleransi gang/RT.`
                  : `Titik koordinat klaim cocok presisi dengan data kependudukan resmi.`}
              </p>
            </div>

            {/* Skor Kecurigaan */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-600">Tingkat Deviasi:</span>
                <span className="font-mono font-bold text-slate-900">{analysis.severityScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.severityScore > 60 ? 'bg-rose-500' : analysis.severityScore > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${analysis.severityScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => handleLoadScenario('fraud')}
              className="w-full py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Contoh Kasus Anomali</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
