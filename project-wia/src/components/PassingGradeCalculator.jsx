import { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  School, 
  ChevronRight,
  Info,
  Sliders,
  Award,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { simulateSchoolAcceptance } from '@/services/simulatorService';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { formatDistance } from '@/utils/formatters';

export default function PassingGradeCalculator() {
  const [jalur, setJalur] = useState('zonasi');
  const [distanceMeters, setDistanceMeters] = useState(650);
  const [raporScore, setRaporScore] = useState(88.5);
  const [prestasiScore, setPrestasiScore] = useState(10);

  // Hitung simulasi peluang untuk semua SMAN
  const simulationResults = INITIAL_SEKOLAH.map((school) => {
    const distForThisSchool = school.id === 1 ? distanceMeters : Math.round(distanceMeters * (1 + (school.id - 1) * 0.25));
    return simulateSchoolAcceptance({
      school,
      jalur,
      distanceMeters: distForThisSchool,
      raporScore,
      prestasiScore
    });
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header Ramah Warga */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 text-pink-400 backdrop-blur">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Simulator Peluang Masuk SMAN
              </h3>
              <span className="bg-[#EC4899] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Otomatis
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Estimasi probabilitas kelulusan berdasarkan jarak zonasi, nilai rapor, dan kuota aktif.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Kolom Kiri: Input Data Anak (4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600">
            <Sliders className="w-4 h-4 text-[#2563EB]" />
            Parameter Seleksi
          </div>

          {/* Jalur Masuk */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Jalur Seleksi:
            </label>
            <select
              value={jalur}
              onChange={(e) => setJalur(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB] outline-none"
            >
              <option value="zonasi">Zonasi (50% Kuota)</option>
              <option value="prestasi_akademik">Prestasi Nilai Rapor (20% Kuota)</option>
              <option value="afirmasi">Afirmasi / KJP (20% Kuota)</option>
              <option value="prestasi_non_akademik">Prestasi Non-Akademik (5% Kuota)</option>
              <option value="perpindahan_tugas">Perpindahan Tugas (5% Kuota)</option>
            </select>
          </div>

          {/* Jarak Rumah */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 font-bold">Jarak Domisili:</span>
              <span className="font-mono text-[#1E3A8A] font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                {formatDistance(distanceMeters)}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="3500"
              step="25"
              value={distanceMeters}
              onChange={(e) => setDistanceMeters(parseInt(e.target.value))}
              className="w-full accent-[#EC4899] h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>50 m</span>
              <span>1,5 km</span>
              <span>3,5 km</span>
            </div>
          </div>

          {/* Nilai Rapor */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 font-bold">Rata-rata Rapor:</span>
              <span className="font-mono text-[#1E3A8A] font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                {raporScore.toFixed(1)} / 100
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="100"
              step="0.5"
              value={raporScore}
              onChange={(e) => setRaporScore(parseFloat(e.target.value))}
              className="w-full accent-[#EC4899] h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>70.0</span>
              <span>85.0</span>
              <span>100.0</span>
            </div>
          </div>

          {/* Sertifikat Prestasi Tambahan */}
          {(jalur === 'prestasi_akademik' || jalur === 'prestasi_non_akademik') && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Piagam / Sertifikat Juara:
              </label>
              <select
                value={prestasiScore}
                onChange={(e) => setPrestasiScore(parseInt(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 font-semibold"
              >
                <option value="0">Tidak Ada Piagam (0 Poin)</option>
                <option value="10">Tingkat Kota / Kabupaten (+10 Poin)</option>
                <option value="20">Tingkat Provinsi (+20 Poin)</option>
                <option value="30">Tingkat Nasional / Internasional (+30 Poin)</option>
              </select>
            </div>
          )}

          {/* Saran Ringkas */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 mb-0.5 text-blue-950 text-[11px]">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Rekomendasi
            </p>
            <p className="text-[11px] opacity-90">
              Jalur zonasi memprioritaskan jarak (85%). Pilih sekolah dengan indikator hijau (&gt;75%) untuk posisi teraman.
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Hasil Peluang di SMAN (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Hasil Peluang Masuk per Sekolah
              </h4>
              <p className="text-xs text-slate-500">Estimasi posisi berkas terhadap daya tampung:</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              {simulationResults.length} SMAN
            </span>
          </div>

          <div className="space-y-2.5">
            {simulationResults.map((result) => {
              const isHigh = result.probability >= 75;
              const isMedium = result.probability >= 40 && result.probability < 75;

              let labelWarga = 'Peluang Tinggi (>75%)';
              let tipsWarga = 'Posisi aman di peringkat kuota atas.';

              if (result.probability < 40) {
                labelWarga = 'Risiko Tergeser (<40%)';
                tipsWarga = 'Peringkat di luar batas kuota. Siapkan sekolah alternatif.';
              } else if (result.probability < 75) {
                labelWarga = 'Kompetitif (40-74%)';
                tipsWarga = 'Posisi di batas kuota. Pantau laju pendaftar berkala.';
              }

              return (
                <div
                  key={result.schoolId}
                  className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                    isHigh
                      ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                      : isMedium
                      ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                      : 'bg-pink-50/50 border-pink-200 hover:border-pink-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <School className="w-4 h-4 text-slate-500" />
                        <h5 className="font-black text-sm text-slate-900">
                          {result.schoolName}
                        </h5>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          isHigh
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isMedium
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-pink-100 text-[#DB2777] border-pink-300'
                        }`}>
                          {labelWarga}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span>Jarak: <strong className="font-mono text-slate-900">{formatDistance(result.distanceMeters)}</strong></span>
                        <span>•</span>
                        <span>Kuota Kursi: <strong className="font-mono text-slate-900">{result.quotaSeatCount} kursi</strong></span>
                        <span>•</span>
                        <span>Perkiraan Urutan: <strong className="font-mono text-slate-900">Urutan ke-#{result.estimatedRank}</strong></span>
                      </div>
                    </div>

                    {/* Persentase Besar */}
                    <div className="text-right sm:self-center shrink-0">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Peluang:</span>
                        <span className={`text-2xl font-black font-mono ${
                          isHigh ? 'text-emerald-600' : isMedium ? 'text-amber-600' : 'text-[#EC4899]'
                        }`}>
                          {result.probability}%
                        </span>
                      </div>
                      <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden mt-1 ml-auto">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh ? 'bg-[#10B981]' : isMedium ? 'bg-amber-500' : 'bg-[#EC4899]'
                          }`}
                          style={{ width: `${result.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Saran Konkret */}
                  <p className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-start gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{tipsWarga}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
