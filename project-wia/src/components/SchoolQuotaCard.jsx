import Link from 'next/link';
import { 
  MapPin, 
  Flame, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  ArrowRight, 
  Award 
} from 'lucide-react';
import { getJalurLabel, formatPercentage, formatDistance } from '@/utils/formatters';

export default function SchoolQuotaCard({ schoolData }) {
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
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    barColor: 'from-emerald-500 to-[#10B981]',
    icon: <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
  };

  if (saturationPct >= 100 || remainingSeats === 0) {
    statusBadge = {
      label: 'Kuota Penuh',
      bg: 'bg-[#222227] text-slate-300 border-white/10',
      barColor: 'from-slate-500 to-slate-600',
      icon: <XCircle className="w-3.5 h-3.5 text-slate-400" />
    };
  } else if (saturationPct >= 85) {
    statusBadge = {
      label: 'Hampir Penuh',
      bg: 'bg-rose-500/10 text-[#F43F5E] border-rose-500/30',
      barColor: 'from-[#F97316] to-[#F43F5E]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#F43F5E] animate-pulse" />
    };
  } else if (saturationPct >= 65) {
    statusBadge = {
      label: 'Cepat Terisi',
      bg: 'bg-orange-500/10 text-[#F97316] border-orange-500/30',
      barColor: 'from-[#F97316] to-[#F43F5E]',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#F97316]" />
    };
  }

  // Warna tema untuk setiap jalur masuk
  const getJalurTheme = (jalur) => {
    switch (jalur) {
      case 'zonasi':
        return {
          barColor: 'from-[#F97316] to-[#EA580C]',
          badgeBg: 'bg-orange-500/10 text-[#F97316] border-orange-500/30',
          dot: 'bg-[#F97316]'
        };
      case 'afirmasi':
        return {
          barColor: 'from-emerald-400 to-[#059669]',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-[#10B981]'
        };
      case 'prestasi_akademik':
      case 'prestasi':
        return {
          barColor: 'from-purple-500 to-[#6D28D9]',
          badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-[#8B5CF6]'
        };
      case 'perpindahan_tugas':
        return {
          barColor: 'from-amber-400 to-[#D97706]',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-[#F59E0B]'
        };
      default:
        return {
          barColor: 'from-slate-400 to-slate-600',
          badgeBg: 'bg-[#222227] text-[#E2E8F0] border-white/10',
          dot: 'bg-slate-500'
        };
    }
  };

  return (
    <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* ============================================================== */}
        {/* 1. HEADER KARTU SEKOLAH */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#141417] via-[#221614] to-[#141417] text-white relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#F97316] backdrop-blur border border-white/20 flex items-center justify-center font-black text-sm shrink-0 shadow-inner">
                {school.id}
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-white leading-snug">
                  {school.nama_sekolah}
                </h3>
                <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F43F5E] shrink-0" />
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
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#222227]">
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Kuota Terisi Sekolah
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  {totalTerisi}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  / {totalKuota} Kursi
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-base sm:text-lg text-[#F97316]">
                {formatPercentage(saturationPct)}
              </span>
              <span className="block text-[11px] font-bold text-slate-400">
                Tersisa: <strong className="text-emerald-400">{remainingSeats}</strong> kursi
              </span>
            </div>
          </div>

          {/* Bar Total Kuota Terisi */}
          <div className="w-full h-3.5 bg-[#2A2A32] rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${statusBadge.barColor} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, saturationPct)}%` }}
            ></div>
          </div>

          {/* Quick Metrics (Laju & Total Pendaftar) */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Laju Pendaftaran</p>
                <p className="font-mono font-black text-[#E2E8F0] text-xs">
                  {avgBurnRate} / jam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-orange-500/10 text-[#F97316]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Total Pendaftar</p>
                <p className="font-mono font-black text-[#E2E8F0] text-xs">
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
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
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
                  className="p-3 rounded-2xl bg-[#222227] border border-white/10 hover:bg-white/10 transition"
                >
                  {/* Jalur Label & Kuota Info */}
                  <div className="flex items-start justify-between gap-2 mb-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${theme.dot} shrink-0`}></span>
                      <span className="font-bold text-white leading-tight">
                        {getJalurLabel(item.jalur)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        ({item.persentase}%)
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-white text-[11px]">
                        {item.kuota_terisi} / {item.total_kuota} Kursi
                      </span>
                    </div>
                  </div>

                  {/* Bar Keterisian Per Jalur */}
                  <div className="w-full h-2.5 bg-[#2A2A32] rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${theme.barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(100, jalurSaturation)}%` }}
                    ></div>
                  </div>

                  {/* Keterangan Angka Sisa & Persentase */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <span>Sisa:</span>
                      <strong className={`font-mono font-black px-1.5 py-0.5 rounded ${
                        jalurRemaining <= 5 
                          ? 'bg-rose-500/15 text-[#FB7185]' 
                          : jalurRemaining >= 25 
                          ? 'bg-emerald-500/15 text-emerald-400' 
                          : 'bg-orange-500/15 text-[#F97316]'
                      }`}>
                        {jalurRemaining} Kursi
                      </strong>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Pendaftar: <strong className="text-slate-300 font-mono">{item.pendaftar_total}</strong> siswa
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. FOOTER AKSI KARTU: DAFTAR */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-5 bg-[#222227] border-t border-white/10">
        <Link
          href="/daftar"
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] hover:opacity-90 text-white font-black text-xs transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 text-center hover:scale-[1.01]"
        >
          <span>Daftar SMAN</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
