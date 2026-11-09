import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  MapPin, 
  FileText, 
  UserCheck, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { formatDistance } from '@/utils/formatters';

export default function DualTruthComparatorView({ pendaftaranList = [] }) {
  const [selectedId, setSelectedId] = useState(pendaftaranList.length > 1 ? pendaftaranList[1].id : (pendaftaranList[0]?.id || 1));
  const record = pendaftaranList.find(p => p.id === parseInt(selectedId)) || pendaftaranList[0];

  if (!record) return null;

  const isCritical = record.geo_anomaly_status === 'anomali_kritis_fraud' || record.dual_truth_status === 'inkonsistensi_kritis';
  const isWarning = record.geo_anomaly_status === 'peringatan_toleransi' || record.dual_truth_status === 'perbedaan_ringan';

  return (
    <div className="space-y-6">
      {/* Pilihan Siswa untuk Dites */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-0.5">
            Pilih Sampel Berkas:
          </label>
          <p className="text-xs text-slate-500">
            Validasi komparatif data klaim vs catatan resmi Dukcapil & Dapodik.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pendaftaranList.map((p) => {
            const hasAnomaly = p.geo_anomaly_status === 'anomali_kritis_fraud';
            const isSelected = p.id === record.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {hasAnomaly ? (
                  <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                )}
                <span>{p.nama_siswa.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  hasAnomaly ? 'bg-pink-500/20 text-[#DB2777]' : 'bg-emerald-500/20 text-[#10B981]'
                }`}>
                  {hasAnomaly ? 'Anomali' : 'Valid'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner Kesimpulan Ringkas */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
        isCritical
          ? 'bg-pink-50/90 border-pink-200 text-[#DB2777]'
          : isWarning
          ? 'bg-amber-50/90 border-amber-200 text-amber-900'
          : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl text-white shrink-0 ${
            isCritical ? 'bg-[#EC4899] shadow-md' : isWarning ? 'bg-amber-600' : 'bg-[#10B981]'
          }`}>
            {isCritical ? <ShieldAlert className="w-5 h-5 text-white" /> : isWarning ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base">
                {isCritical 
                  ? 'Anomali Kritis: Deviasi Titik & Masa KK' 
                  : isWarning 
                  ? 'Peringatan Toleransi Koordinat' 
                  : 'Data Terverifikasi & Valid'}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-current">
                {record.nomor_tiket}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5 max-w-xl">
              {record.catatan_verifikator || 'Data isian pendaftar cocok dengan catatan kependudukan resmi.'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold block uppercase tracking-wider opacity-75">
            Deviasi Jarak:
          </span>
          <span className="font-mono font-black text-base sm:text-lg">
            {record.selisih_jarak_meter > 0 ? `Δ ${formatDistance(record.selisih_jarak_meter)}` : '0 m (Presisi)'}
          </span>
        </div>
      </div>

      {/* Tabel Komparasi Berdampingan Dua Sisi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SISI KIRI: KLAIM PENDAFTAR */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-100/90 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h3 className="font-extrabold text-slate-800 text-sm">
                1. Data Klaim Pendaftar
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Formulir
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3.5 text-xs divide-y divide-slate-100">
            {/* Nama & NIK */}
            <div className="flex items-start justify-between gap-4 pt-1">
              <span className="text-slate-500 font-medium">Nama & NIK:</span>
              <div className="text-right">
                <p className="font-bold text-slate-900">{record.nama_siswa}</p>
                <p className="font-mono text-slate-400 text-[11px]">{record.nik}</p>
              </div>
            </div>

            {/* Alamat Rumah yang Diakui */}
            <div className="flex items-start justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Alamat Domisili:</span>
              <p className="text-right font-semibold text-slate-800 max-w-xs">
                {record.alamat_domisili}
              </p>
            </div>

            {/* Lama Tinggal di KK */}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Masa Tinggal KK:</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                record.lama_tinggal_bulan < 12 ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-800'
              }`}>
                {record.lama_tinggal_bulan} Bulan
              </span>
            </div>

            {/* Jarak ke Sekolah yang Ditunjuk */}
            <div className="flex items-start justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Jarak Klaim:</span>
              <div className="text-right font-mono">
                <p className="font-bold text-[#2563EB] text-sm">{formatDistance(record.jarak_klaim_meter)}</p>
              </div>
            </div>

            {/* Nilai Rapor Isian */}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Nilai Rapor:</span>
              <span className="font-bold font-mono text-xs text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {record.klaim_nilai_rapor.toFixed(2)}
              </span>
            </div>

            {/* Sekolah yang Dituju */}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Sekolah & Jalur:</span>
              <div className="text-right">
                <p className="font-bold text-slate-900">{record.sekolah_nama}</p>
                <span className="text-[10px] text-[#1E3A8A] font-bold uppercase">{record.jalur}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: CATATAN RESMI DUKCAPIL & RAPOR */}
        <div className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm ${
          isCritical ? 'border-rose-300 ring-2 ring-rose-100' : isWarning ? 'border-amber-300' : 'border-emerald-300'
        }`}>
          <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
            isCritical ? 'bg-rose-50 border-rose-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                2. Data Otoritatif Sistem
              </h3>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
              isCritical ? 'bg-rose-200 text-rose-800 border-rose-300' : 'bg-emerald-200 text-emerald-800 border-emerald-300'
            }`}>
              Dukcapil / Dapodik
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-3.5 text-xs divide-y divide-slate-100">
            {/* Status NIK */}
            <div className="flex items-start justify-between gap-4 pt-1">
              <span className="text-slate-500 font-medium">Validitas NIK:</span>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> NIK Sah (Kemendagri)
                </span>
              </div>
            </div>

            {/* Alamat Asli di KK */}
            <div className="flex items-start justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Alamat Asli KK:</span>
              <div className="text-right max-w-xs">
                <p className="font-semibold text-slate-900">
                  {record.id === 2 ? 'Jl. Pemuda Rawamangun No. 89, Jakarta Timur' : record.alamat_domisili}
                </p>
                {record.id === 2 && (
                  <span className="inline-block mt-0.5 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded border border-rose-200">
                    Beda Wilayah (Rawamangun ≠ Tebet)
                  </span>
                )}
              </div>
            </div>

            {/* Syarat Minimal 1 Tahun KK */}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Masa Tinggal (≥12 Bln):</span>
              <div className="text-right">
                {record.lama_tinggal_bulan < 12 ? (
                  <span className="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200 inline-flex items-center gap-1 text-[11px]">
                    <XCircle className="w-3 h-3" /> 4 Bulan (Indikasi Numpang KK)
                  </span>
                ) : (
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> Memenuhi Syarat
                  </span>
                )}
              </div>
            </div>

            {/* Jarak Sebenarnya dari Rumah Asli */}
            <div className="flex items-start justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Jarak Riil Alamat:</span>
              <div className="text-right font-mono">
                <p className={`text-sm font-bold ${isCritical ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatDistance(record.jarak_resmi_meter)}
                </p>
              </div>
            </div>

            {/* Nilai Rapor Resmi di Dapodik */}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Nilai Dapodik:</span>
              <div className="text-right">
                <span className={`font-bold font-mono text-xs px-2 py-0.5 rounded border ${
                  Math.abs(record.klaim_nilai_rapor - record.dapodik_nilai_rapor) > 0.5
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {record.dapodik_nilai_rapor.toFixed(2)}
                </span>
                {Math.abs(record.klaim_nilai_rapor - record.dapodik_nilai_rapor) > 0.5 && (
                  <span className="block text-[10px] text-rose-600 font-bold mt-0.5">
                    Δ {(record.klaim_nilai_rapor - record.dapodik_nilai_rapor).toFixed(1)} Poin
                  </span>
                )}
              </div>
            </div>

            {/* Tindakan Sistem */}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <span className="text-slate-500 font-medium">Status Sistem:</span>
              <span className={`font-bold px-2.5 py-1 rounded-xl text-xs ${
                isCritical 
                  ? 'bg-[#EC4899] text-white shadow' 
                  : isWarning 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-[#10B981] text-white'
              }`}>
                {isCritical ? 'Tinjauan Faktual Lapangan' : isWarning ? 'Toleransi Koordinat' : 'Lolos Otomatis'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
