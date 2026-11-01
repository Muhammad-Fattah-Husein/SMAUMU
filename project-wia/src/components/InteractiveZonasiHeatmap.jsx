import { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Flame, 
  School, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { INITIAL_SEKOLAH, INITIAL_BLANK_SPOTS } from '@/utils/constants';
import { formatDistance } from '@/utils/formatters';

export default function InteractiveZonasiHeatmap() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'zonasi', 'heatmap', 'blankspot'
  const [selectedSchool, setSelectedSchool] = useState(INITIAL_SEKOLAH[0]);
  const [selectedBlankSpot, setSelectedBlankSpot] = useState(INITIAL_BLANK_SPOTS[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Tombol Pilihan Peta Ringkas */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1E3A8A] text-white">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">
              Peta Sebaran Zonasi & Blank-Spot SMA
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi sebaran SMAN, radius zonasi tempat tinggal, dan wilayah defisit kuota kursi.
          </p>
        </div>

        {/* Tab Pilihan Peta */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl self-stretch md:self-auto text-xs font-bold flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab('zonasi')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'zonasi' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Radius Zonasi
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'heatmap' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Kepadatan
          </button>
          <button
            onClick={() => setActiveTab('blankspot')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'blankspot' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Blank-Spot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Sisi Kiri: Peta Sekolah & Titik Wilayah (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-slate-950 text-white relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70"></div>

          {/* Info Status Peta */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Peta DKI Jakarta • 6 Titik SMAN & Titik Wilayah Kurang Kursi</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Lokasi SMAN
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span> Wilayah Kurang SMA
              </span>
            </div>
          </div>

          {/* Kotak-kotak Sekolah */}
          <div className="relative z-10 my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INITIAL_SEKOLAH.slice(0, 5).map((sch) => {
              const isSelected = selectedSchool.id === sch.id;
              return (
                <div
                  key={sch.id}
                  onClick={() => setSelectedSchool(sch)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer backdrop-blur ${
                    isSelected
                      ? 'bg-blue-900/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-400">{sch.npsn}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  </div>
                  <h5 className="font-extrabold text-xs text-white truncate">{sch.nama_sekolah}</h5>
                  <p className="text-[10px] text-slate-300 mt-1">{sch.kecamatan}, {sch.kota}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Jangkauan Zonasi:</span>
                    <span className="text-cyan-300 font-bold">{formatDistance(sch.radius_max)}</span>
                  </div>
                </div>
              );
            })}

            {/* Kotak Wilayah Kurang SMA */}
            <div
              onClick={() => setActiveTab('blankspot')}
              className="p-3.5 rounded-2xl border border-rose-500/50 bg-rose-950/40 backdrop-blur cursor-pointer hover:bg-rose-950/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-rose-300 uppercase">Wilayah Kurang SMA</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </div>
                <h5 className="font-bold text-xs text-white">Cipayung & Kalideres</h5>
                <p className="text-[10px] text-rose-200 mt-1">Kekurangan lebih dari 3.200 kursi SMA</p>
              </div>
              <span className="text-[10px] text-rose-300 font-bold mt-2 inline-flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Lihat Usulan Solusi
              </span>
            </div>
          </div>

          {/* Indikator Kepadatan */}
          <div className="relative z-10 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">
              Sekolah Paling Ramai Saat Ini: <strong className="text-amber-400">SMAN 8 Bukit Duri & SMAN 1 Pasar Baru</strong>
            </span>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Longgar</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Mulai Ramai</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300">Sangat Padat</span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Penjelasan Detail untuk Warga (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-white flex flex-col justify-between space-y-4">
          {activeTab === 'blankspot' ? (
            /* Tampilan Wilayah Kurang SMA */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-rose-100 text-rose-700">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Wilayah yang Kurang SMA Negeri</h4>
                  <p className="text-[11px] text-slate-500">Agar ke depan anak-anak di kecamatan ini tidak kesulitan sekolah</p>
                </div>
              </div>

              <div className="space-y-3">
                {INITIAL_BLANK_SPOTS.map((bs) => (
                  <div
                    key={bs.id}
                    onClick={() => setSelectedBlankSpot(bs)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                      selectedBlankSpot.id === bs.id
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900">{bs.kecamatan}</span>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        Kurang {bs.defisit_kursi} Kursi
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mb-2">{bs.kelurahan}</p>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                      <strong>Usulan untuk Dinas:</strong> {bs.rekomendasi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Tampilan Detail Sekolah */
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">{selectedSchool.nama_sekolah}</h4>
                  <p className="text-[11px] text-slate-500">{selectedSchool.alamat}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500">Kecamatan & Kota:</span>
                  <span className="font-bold text-slate-800">{selectedSchool.kecamatan}, {selectedSchool.kota}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500">Batas Jarak Rumah (Zonasi):</span>
                  <span className="font-mono font-bold text-blue-700">{formatDistance(selectedSchool.radius_max)}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500">Daya Tampung Kursi:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedSchool.kuota_total} siswa</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="text-slate-500">Nilai Akreditasi:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedSchool.akreditasi}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <p className="font-bold mb-1">Ketentuan untuk Orang Tua:</p>
                <p className="text-[11px] opacity-90">
                  Anak yang rumahnya berjarak maksimal {formatDistance(selectedSchool.radius_max)} berhak memperebutkan 50% kursi zonasi sekolah ini. Urutan ditentukan dari yang rumahnya paling dekat.
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab(activeTab === 'blankspot' ? 'all' : 'blankspot')}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
            >
              {activeTab === 'blankspot' ? 'Kembali ke Pilihan SMA' : 'Lihat Wilayah yang Kekurangan SMA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
