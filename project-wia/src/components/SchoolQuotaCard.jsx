import { useState } from 'react';
import Link from 'next/link';
import { 
  School, 
  MapPin, 
  Flame, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  ArrowRight, 
  Compass, 
  Award, 
  ChevronDown, 
  ChevronUp,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { getJalurLabel, formatPercentage, formatDistance } from '@/utils/formatters';

export default function SchoolQuotaCard({ schoolData, onSimulateAdd }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSimJalur, setSelectedSimJalur] = useState('zonasi');

  const {
    school,
    jalurList,
    totalKuota,
    totalTerisi,
    totalPendaftar,
    avgBurnRate,
    remainingSeats,
    saturationPct
  } = schoolData;

  // Status Badge Keseluruhan Sekolah
  let statusBadge = {
    label: 'Tersedia',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'from-emerald-500 to-[#10B981]',
    icon: <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
  };

  if (saturationPct >= 100 || remainingSeats === 0) {
    statusBadge = {
      label: 'Kuota Penuh',
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      barColor: 'from-slate-500 to-slate-600',
      icon: <XCircle className="w-3.5 h-3.5 text-slate-500" />
    };
  } else if (saturationPct >= 85) {
    statusBadge = {
      label: 'Hampir Penuh',
      bg: 'bg-pink-50 text-[#DB2777] border-pink-200',
      barColor: 'from-[#EC4899] to-[#DB2777]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#EC4899] animate-pulse" />
    };
  } else if (saturationPct >= 65) {
    statusBadge = {
      label: 'Cepat Terisi',
      bg: 'bg-blue-50 text-[#1E3A8A] border-blue-200',
      barColor: 'from-[#2563EB] to-[#1E3A8A]',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
    };
  }

  // Warna tema untuk setiap jalur masuk
  const getJalurTheme = (jalur) => {
    switch (jalur) {
      case 'zonasi':
        return {
          barColor: 'from-blue-500 to-[#1E3A8A]',
          badgeBg: 'bg-blue-50 text-[#1E3A8A] border-blue-200',
          dot: 'bg-[#2563EB]'
        };
      case 'afirmasi':
        return {
          barColor: 'from-emerald-400 to-[#059669]',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-[#10B981]'
        };
      case 'prestasi_akademik':
      case 'prestasi':
        return {
          barColor: 'from-purple-500 to-[#6D28D9]',
          badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-[#8B5CF6]'
        };
      case 'perpindahan_tugas':
        return {
          barColor: 'from-amber-400 to-[#D97706]',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-[#F59E0B]'
        };
      default:
        return {
          barColor: 'from-slate-400 to-slate-600',
          badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
          dot: 'bg-slate-500'
        };
    }
  };

  const handleSimulate = async () => {
    if (!onSimulateAdd) return;
    setIsUpdating(true);
    await onSimulateAdd(school.id, selectedSimJalur);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* ============================================================== */}
        {/* 1. HEADER KARTU SEKOLAH */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#1E3A8A] to-slate-900 text-white relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-cyan-300 backdrop-blur border border-white/20 flex items-center justify-center font-black text-sm shrink-0 shadow-inner">
                {school.id}
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-white leading-snug">
                  {school.nama_sekolah}
                </h3>
                <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{school.kecamatan}, {school.kota}</span>
                </p>
              </div>
            </div>

            {/* Status Keseluruhan */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border shrink-0 ${statusBadge.bg}`}>
              {statusBadge.icon}
              {statusBadge.label}
            </span>
          </div>

          {/* Badge NPSN & Akreditasi */}
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-200 flex-wrap gap-2">
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/15">
              NPSN: {school.npsn}
            </span>
            <span className="font-semibold text-emerald-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {school.akreditasi}
            </span>
            <span className="text-slate-300 font-medium">
              Zonasi: Maks. {formatDistance(school.radius_max)}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MASTER TOTAL KUOTA TERISI (BAR BESAR) */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Kuota Terisi Sekolah
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  {totalTerisi}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  / {totalKuota} Kursi
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-base sm:text-lg text-[#1E3A8A]">
                {formatPercentage(saturationPct)}
              </span>
              <span className="block text-[11px] font-bold text-slate-500">
                Tersisa: <strong className="text-emerald-700">{remainingSeats}</strong> kursi
              </span>
            </div>
          </div>

          {/* Bar Total Kuota Terisi */}
          <div className="w-full h-3.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/60 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${statusBadge.barColor} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, saturationPct)}%` }}
            ></div>
          </div>

          {/* Quick Metrics (Laju & Total Pendaftar) */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Laju Pendaftaran</p>
                <p className="font-mono font-black text-slate-800 text-xs">
                  {avgBurnRate} / jam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-500/10 text-blue-600">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Total Pendaftar</p>
                <p className="font-mono font-black text-slate-800 text-xs">
                  {totalPendaftar} Siswa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. RINCIAN KUOTA TERISI PER-JALUR DALAM BENTUK BAR */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Rincian Keterisian Per Jalur:
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {jalurList.length} Jalur Seleksi
            </span>
          </div>

          <div className="space-y-3">
            {jalurList.map((item) => {
              const theme = getJalurTheme(item.jalur);
              const jalurSaturation = item.total_kuota > 0
                ? (item.kuota_terisi / item.total_kuota) * 100
                : 0;
              const jalurRemaining = Math.max(0, item.total_kuota - item.kuota_terisi);

              return (
                <div 
                  key={item.jalur}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100/90 hover:bg-slate-100/60 transition"
                >
                  {/* Jalur Label & Kuota Info */}
                  <div className="flex items-start justify-between gap-2 mb-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${theme.dot} shrink-0`}></span>
                      <span className="font-bold text-slate-900 leading-tight">
                        {getJalurLabel(item.jalur)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        ({item.persentase}%)
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900 text-[11px]">
                        {item.kuota_terisi} / {item.total_kuota} Kursi
                      </span>
                    </div>
                  </div>

                  {/* Bar Keterisian Per Jalur */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(100, jalurSaturation)}%` }}
                    ></div>
                  </div>

                  {/* Keterangan Angka Sisa & Persentase */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium">
                    <span>
                      Sisa: <strong className="text-slate-800 font-mono">{jalurRemaining}</strong> kursi
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                      {formatPercentage(jalurSaturation)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. FOOTER AKSI KARTU: SIMULASI & DAFTAR */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 space-y-2.5">
        {/* Tombol Simulasi Cepat Tambah Berkas */}
        {onSimulateAdd && (
          <div className="flex items-center gap-2">
            <select
              value={selectedSimJalur}
              onChange={(e) => setSelectedSimJalur(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 flex-1"
            >
              {jalurList.map((j) => (
                <option key={j.jalur} value={j.jalur}>
                  Simulasi: {getJalurLabel(j.jalur)}
                </option>
              ))}
            </select>

            <button
              onClick={handleSimulate}
              disabled={isUpdating}
              className="px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-[#1E3A8A] text-[11px] font-bold transition flex items-center gap-1 shrink-0 disabled:opacity-50"
              title="Tambahkan 1 pendaftar simulasi untuk uji coba bar kuota"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>+1 Berkas</span>
            </button>
          </div>
        )}

        {/* Action Link: Simulasi Peluang & Daftar Siswa */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/simulator"
            className="py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 text-center"
          >
            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Cek Zonasi</span>
          </Link>

          <Link
            href="/daftar"
            className="py-2 px-3 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs transition shadow-sm flex items-center justify-center gap-1.5 text-center"
          >
            <span>Daftar SMAN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
