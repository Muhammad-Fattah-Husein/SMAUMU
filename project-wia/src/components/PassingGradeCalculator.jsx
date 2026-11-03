import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  MapPin, 
  School, 
  Navigation, 
  Sparkles, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Crosshair, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { calculateHaversineDistance } from '@/services/geoService';
import { formatDistance } from '@/utils/formatters';

// Load komponen peta secara dinamis di browser (SSR = false untuk kompatibilitas Leaflet / Map tiles)
const DetailedMapView = dynamic(() => import('./DetailedMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[470px] sm:h-[500px] bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-300">Memuat Peta Detail Google Maps...</p>
    </div>
  )
});

// Preset Titik Pemukiman Populer Warga Jakarta
const PRESET_LOCATIONS = [
  { label: 'Pasar Baru', lat: -6.168500, lng: 106.835000, desc: 'Jakarta Pusat (Dekat SMAN 1)' },
  { label: 'Salemba / Senen', lat: -6.192000, lng: 106.848000, desc: 'Jakarta Pusat (Dekat SMAN 68)' },
  { label: 'Tebet / Bukit Duri', lat: -6.226000, lng: 106.855000, desc: 'Jakarta Selatan (Dekat SMAN 8)' },
  { label: 'Bulungan / Blok M', lat: -6.243000, lng: 106.802000, desc: 'Jakarta Selatan (Dekat SMAN 70)' },
  { label: 'Pasar Minggu', lat: -6.285000, lng: 106.832000, desc: 'Jakarta Selatan (Dekat SMAN 28)' },
  { label: 'Pondok Labu / Cilandak', lat: -6.308000, lng: 106.802000, desc: 'Jakarta Selatan (Dekat SMAN 34)' },
  { label: 'Menteng / Gambir', lat: -6.185000, lng: 106.832000, desc: 'Pusat Kota (Titik Netral)' },
  { label: 'Cipayung (Blank-Spot)', lat: -6.315000, lng: 106.878000, desc: 'Jarak Jauh ke Seluruh SMAN' },
];

export default function PassingGradeCalculator() {
  // Posisi rumah siswa saat ini (default di sekitar Menteng / Salemba)
  const [studentHouse, setStudentHouse] = useState({
    lat: -6.188000,
    lng: 106.845000,
    label: 'Salemba / Cempaka Putih (Titik Rumah Default)'
  });
  
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [hoveredSchoolId, setHoveredSchoolId] = useState(null);
  const [gpsStatus, setGpsStatus] = useState(null);

  // Deteksi lokasi nyata lewat sensor GPS browser
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS tidak didukung peramban ini');
      return;
    }
    setGpsStatus('Mencari sinyal GPS perangkat Anda...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Jika masih dalam rentang wajar Jabodetabek
        if (latitude >= -6.40 && latitude <= -6.08 && longitude >= 106.65 && longitude <= 107.00) {
          setStudentHouse({
            lat: Number(latitude.toFixed(6)),
            lng: Number(longitude.toFixed(6)),
            label: 'Lokasi Riil Perangkat (GPS)'
          });
          setGpsStatus('Lokasi GPS berhasil dikunci!');
        } else {
          setGpsStatus('Lokasi di luar jangkauan peta DKI. Menggunakan titik default Jakarta.');
        }
        setTimeout(() => setGpsStatus(null), 3000);
      },
      () => {
        setGpsStatus('Izin lokasi ditolak atau sinyal lemah.');
        setTimeout(() => setGpsStatus(null), 3000);
      },
      { timeout: 7000 }
    );
  };

  // Komparasi Riil Jarak & Peluang ke SELURUH Sekolah di SMAUMU
  const comparisonResults = useMemo(() => {
    const list = INITIAL_SEKOLAH.map((school) => {
      const distanceMeters = calculateHaversineDistance(
        studentHouse.lat,
        studentHouse.lng,
        school.lat,
        school.lng
      );

      const maxRadius = school.radius_max || 3500;
      const quotaZonasi = Math.round((school.kuota_total || 288) * 0.5);

      let probability = 0;
      let statusLabel = '';
      let statusTheme = 'safe'; // 'safe', 'warning', 'danger'
      let advice = '';

      if (distanceMeters <= 500) {
        probability = 98;
        statusLabel = 'Pasti Lolos Zonasi';
        statusTheme = 'safe';
        advice = 'Prioritas 1 Ring Utama. Posisi sangat aman di kuota zonasi teratas.';
      } else if (distanceMeters <= 1000) {
        probability = 88;
        statusLabel = 'Peluang Sangat Tinggi';
        statusTheme = 'safe';
        advice = 'Dalam radius aman domisili kelurahan terdekat.';
      } else if (distanceMeters <= 1800) {
        probability = 68;
        statusLabel = 'Kompetitif (Batas Kuota)';
        statusTheme = 'warning';
        advice = 'Peluang baik, pantau laju pendaftar harian secara berkala.';
      } else if (distanceMeters <= maxRadius) {
        const factor = Math.max(0.15, 1 - (distanceMeters - 1800) / (maxRadius - 1800));
        probability = Math.round(factor * 50);
        statusLabel = 'Risiko Tergeser';
        statusTheme = 'danger';
        advice = 'Mendekati perimeter luar. Siapkan sekolah cadangan alternatif.';
      } else {
        const factor = Math.max(0.05, maxRadius / distanceMeters);
        probability = Math.round(factor * 15);
        statusLabel = 'Di Luar Radius Zonasi';
        statusTheme = 'danger';
        advice = 'Jarak melebihi radius zonasi umum sekolah ini.';
      }

      // Estimasi urutan peringkat kuota zonasi
      const estimatedRank = Math.max(
        1,
        Math.round((1 - probability / 100) * quotaZonasi * 1.45 + 1)
      );

      return {
        school,
        distanceMeters,
        probability,
        statusLabel,
        statusTheme,
        advice,
        quotaZonasi,
        estimatedRank
      };
    });

    // Urutkan dari yang terdekat (peluang terbesar) ke yang terjauh
    return list.sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [studentHouse]);

  const bestSchool = comparisonResults[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      {/* Header Interaktif */}
      <div className="p-6 sm:p-7 bg-gradient-to-r from-[#0B2545] via-[#1E3A8A] to-[#0B2545] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-white/10 text-pink-400 backdrop-blur border border-white/15 shadow-inner">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-lg sm:text-xl tracking-tight text-white">
                Simulator Zonasi Berbasis Peta Google Maps
              </h3>
              <span className="bg-[#EC4899] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                Peta Detail Real • Bebas Input Manual
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
              Peta interaktif nyata dengan jalan, gedung, dan batas wilayah riil. Klik atau geser pin rumah Anda untuk menghitung jarak spasial instan ke seluruh 6 SMAN di SMAUMU.
            </p>
          </div>
        </div>

        {/* Tombol Deteksi GPS */}
        <button
          onClick={handleDetectGPS}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition flex items-center gap-2 shrink-0 backdrop-blur"
        >
          <Crosshair className="w-4 h-4 text-emerald-300" />
          <span>Kunci Lokasi Saya (GPS)</span>
        </button>
      </div>

      {gpsStatus && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 text-xs font-semibold text-blue-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>{gpsStatus}</span>
        </div>
      )}

      {/* Preset Cepat Pemukiman Warga */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider shrink-0">
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <span>Pilih Preset Wilayah Rumah:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          {PRESET_LOCATIONS.map((preset) => {
            const isCurrent = Math.abs(studentHouse.lat - preset.lat) < 0.005 && Math.abs(studentHouse.lng - preset.lng) < 0.005;
            return (
              <button
                key={preset.label}
                onClick={() => setStudentHouse({ lat: preset.lat, lng: preset.lng, label: `${preset.label} (${preset.desc})` })}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                  isCurrent
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title={preset.desc}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Peta di Kiri (7 cols) dan Komparasi Seluruh SMAN di Kanan (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* ============================================================== */}
        {/* SISI KIRI: PETA DETAIL GMAPS / LEAFLET (7 COLS) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[#0B1728] text-white flex flex-col justify-between select-none relative overflow-hidden">
          
          {/* Header Status Bar di Peta */}
          <div className="flex items-center justify-between gap-2 mb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-extrabold text-slate-200">
                Peta Spasial Real-Time (Jalan, Bangunan & Radius SMAN)
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
              ● Klik di peta atau geser pin 🏠
            </span>
          </div>

          {/* Komponen Peta Detail */}
          <DetailedMapView
            studentHouse={studentHouse}
            onStudentHouseChange={setStudentHouse}
            schools={comparisonResults}
            selectedSchoolId={selectedSchoolId}
            onSelectSchool={setSelectedSchoolId}
            bestSchool={bestSchool}
          />

          {/* Kotak Info Koordinat Rumah Aktif */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                Lokasi Rumah Aktif:
              </span>
              <p className="font-extrabold text-white text-xs">
                {studentHouse.label}
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Lintang: {studentHouse.lat} • Bujur: {studentHouse.lng}
              </p>
            </div>

            {bestSchool && (
              <div className="sm:text-right shrink-0 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-bold block">Rekomendasi Terdekat:</span>
                <span className="font-extrabold text-white text-xs">{bestSchool.school.nama_sekolah.split('(')[0]}</span>
                <span className="font-mono text-emerald-300 font-bold ml-1.5">({formatDistance(bestSchool.distanceMeters)})</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SISI KANAN: HASIL KOMPARASI SELURUH 6 SMAN (5 COLS) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 p-4 sm:p-6 bg-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h4 className="font-black text-slate-900 text-sm tracking-tight">
                  Peringkat Komparasi Seluruh SMAN
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dihitung real-time dari titik rumah siswa ({comparisonResults.length} Sekolah):
                </p>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-[#1E3A8A] px-2 py-0.5 rounded-full border border-blue-200">
                Zonasi Domisili
              </span>
            </div>

            {/* List Sekolah Terkomparasi */}
            <div className="mt-3.5 space-y-2.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
              {comparisonResults.map((item, index) => {
                const isBest = index === 0;
                const isSelected = selectedSchoolId === item.school.id || hoveredSchoolId === item.school.id;

                let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                let barColor = 'bg-emerald-500';
                let rankBadge = 'bg-slate-200 text-slate-700';

                if (isBest) {
                  rankBadge = 'bg-emerald-600 text-white';
                } else if (index === 1) {
                  rankBadge = 'bg-blue-600 text-white';
                }

                if (item.statusTheme === 'warning') {
                  badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
                  barColor = 'bg-amber-500';
                } else if (item.statusTheme === 'danger') {
                  badgeColor = 'bg-pink-100 text-[#DB2777] border-pink-300';
                  barColor = 'bg-[#EC4899]';
                }

                return (
                  <div
                    key={item.school.id}
                    onClick={() => setSelectedSchoolId(item.school.id)}
                    onMouseEnter={() => setHoveredSchoolId(item.school.id)}
                    onMouseLeave={() => setHoveredSchoolId(null)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-[#2563EB] shadow-md ring-1 ring-[#2563EB]/40'
                        : isBest
                        ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${rankBadge}`}>
                          #{index + 1}
                        </span>
                        <div>
                          <h5 className="font-black text-xs text-slate-900 leading-tight">
                            {item.school.nama_sekolah}
                          </h5>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {item.school.kecamatan}, {item.school.kota}
                          </p>
                        </div>
                      </div>

                      {/* Jarak Riil */}
                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-xs text-[#1E3A8A]">
                          {formatDistance(item.distanceMeters)}
                        </span>
                        <span className={`block text-[9px] font-extrabold px-1.5 py-0.2 rounded border mt-0.5 ${badgeColor}`}>
                          {item.statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Probabilitas */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-600 font-semibold">
                        Peluang Zonasi:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${item.probability}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-black text-xs text-slate-900 w-8 text-right">
                          {item.probability}%
                        </span>
                      </div>
                    </div>

                    {/* Info Kuota & Estimasi Ranking */}
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>Daya Tampung Zonasi: <strong className="text-slate-800">{item.quotaZonasi} kursi</strong></span>
                      <span>Est. Peringkat: <strong className="font-mono text-slate-800">#{item.estimatedRank}</strong></span>
                    </div>

                    {/* Rekomendasi Khusus */}
                    {isBest && (
                      <div className="mt-2 p-1.5 rounded-lg bg-emerald-100/70 text-emerald-900 text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Sekolah Terdekat & Peluang Paling Maksimal untuk Rumah Anda!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tombol Aksi Lanjut Daftar */}
          <div className="pt-3 border-t border-slate-200">
            <Link
              href="/daftar"
              className="w-full py-3 px-4 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs transition-all shadow-md shadow-pink-500/20 flex items-center justify-center gap-2"
            >
              <span>Daftarkan Siswa ke SMAN Pilihan ({bestSchool?.school.nama_sekolah.split('(')[0] || 'SMAN Terdekat'})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
