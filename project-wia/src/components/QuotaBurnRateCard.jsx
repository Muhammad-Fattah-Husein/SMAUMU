import { useState } from 'react';
import { Flame, Clock, TrendingUp, Users, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { getJalurLabel, formatPercentage } from '@/utils/formatters';

export default function QuotaBurnRateCard({ kuotaItem, onSimulateAdd }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { jalur, total_kuota, kuota_terisi, pendaftar_total, burn_rate_per_jam, metrics } = kuotaItem;

  const saturation = metrics ? metrics.saturationPercentage : ((kuota_terisi / total_kuota) * 100);
  const remaining = Math.max(0, total_kuota - kuota_terisi);
  const hoursLeft = metrics ? metrics.hoursUntilFull : null;

  // Status kartu dalam bahasa ringkas
  let statusBadge = {
    label: 'Tersedia',
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    barColor: 'from-emerald-500 to-[#10B981]',
    icon: <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
  };

  if (saturation >= 100 || remaining === 0) {
    statusBadge = {
      label: 'Penuh',
      bg: 'bg-[#222227] text-slate-300 border-white/10',
      barColor: 'from-slate-500 to-slate-600',
      icon: <XCircle className="w-3.5 h-3.5 text-slate-400" />
    };
  } else if (saturation >= 85 || (hoursLeft !== null && hoursLeft <= 2)) {
    statusBadge = {
      label: 'Hampir Penuh',
      bg: 'bg-rose-500/10 text-[#F43F5E] border-rose-500/30',
      barColor: 'from-[#F97316] to-[#F43F5E]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#F43F5E] animate-pulse" />
    };
  } else if (saturation >= 65 || (hoursLeft !== null && hoursLeft <= 6)) {
    statusBadge = {
      label: 'Cepat Terisi',
      bg: 'bg-orange-500/10 text-[#F97316] border-orange-500/30',
      barColor: 'from-[#F97316] to-[#F43F5E]',
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#F97316]" />
    };
  }

  const handleSimulate = async () => {
    if (!onSimulateAdd) return;
    setIsUpdating(true);
    await onSimulateAdd(kuotaItem.sekolah_id, kuotaItem.jalur);
    setIsUpdating(false);
  };

  return (
    <div className="bg-[#1A1A1E] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header Jalur & Status Sisa Kursi */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-extrabold text-white text-base leading-snug">
              {getJalurLabel(jalur)}
            </h3>
          </div>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}>
            {statusBadge.icon}
            {statusBadge.label}
          </span>
        </div>

        {/* Progress Keterisian Kursi */}
        <div className="mt-2 mb-4">
          <div className="flex items-baseline justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-400 font-semibold">
              {kuota_terisi} / {total_kuota} Kursi
            </span>
            <span className="font-mono font-bold text-white">
              {formatPercentage(saturation)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#222227] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${statusBadge.barColor} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, saturation)}%` }}
            ></div>
          </div>
        </div>

        {/* Kotak Kecepatan Penuh & Perkiraan Waktu */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#222227] border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Laju Masuk</p>
              <p className="font-bold font-mono text-[#E2E8F0] text-xs">
                {burn_rate_per_jam}/jam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-orange-500/10 text-[#F97316]">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Estimasi Penuh</p>
              <p className="font-bold font-mono text-[#E2E8F0] text-xs">
                {hoursLeft !== null ? `${hoursLeft} jam` : 'Aman'}
              </p>
            </div>
          </div>
        </div>

        {/* Total yang sudah mendaftar */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Users className="w-3 h-3 text-slate-400" />
            Pendaftar:
          </span>
          <span className="font-mono font-bold text-[#E2E8F0] text-[11px]">
            {pendaftar_total}
          </span>
        </div>
      </div>

      {/* Tombol Simulasi Uji Coba */}
      {onSimulateAdd && (
        <div className="mt-3 pt-2.5 border-t border-dashed border-white/10">
          <button
            onClick={handleSimulate}
            disabled={isUpdating || remaining === 0}
            className="w-full text-center py-1.5 px-3 rounded-xl text-[11px] font-bold text-[#F97316] bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/30 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <TrendingUp className="w-3 h-3 text-[#F97316]" />
            <span>+1 Berkas (Simulasi)</span>
          </button>
        </div>
      )}
    </div>
  );
}
