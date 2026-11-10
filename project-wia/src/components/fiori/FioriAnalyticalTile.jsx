import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function FioriAnalyticalTile({
  category = 'OPERASIONAL PPDB',
  title,
  subtitle,
  value,
  unit = '',
  trend = 'neutral', // 'up', 'down', 'neutral'
  trendValue = '',
  targetText = '',
  saturationPercent = null,
  statusColor = 'blue', // 'blue', 'emerald', 'pink', 'amber', 'rose'
  icon = null,
  className
}) {
  const colorStyles = {
    blue: {
      bar: 'bg-gradient-to-r from-[#F97316] to-[#F43F5E]',
      bg: 'bg-orange-500/15',
      border: 'border-orange-500/30',
      text: 'text-[#F97316]',
      kpiText: 'text-white'
    },
    emerald: {
      bar: 'bg-emerald-500',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      kpiText: 'text-emerald-300'
    },
    pink: {
      bar: 'bg-gradient-to-r from-[#F43F5E] to-[#F97316]',
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      text: 'text-[#F43F5E]',
      kpiText: 'text-white'
    },
    amber: {
      bar: 'bg-amber-500',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      kpiText: 'text-amber-300'
    },
    rose: {
      bar: 'bg-[#F43F5E]',
      bg: 'bg-rose-500/15',
      border: 'border-rose-500/30',
      text: 'text-[#F43F5E]',
      kpiText: 'text-rose-300'
    }
  };

  const theme = colorStyles[statusColor] || colorStyles.blue;

  return (
    <div
      className={cn(
        'rounded-3xl border bg-[#1A1A1E] p-5 shadow-lg shadow-black/30 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden',
        theme.border,
        className
      )}
    >
      {/* Top Header Strip */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {category}
          </span>
          {icon && (
            <div className={cn('p-1.5 rounded-xl border', theme.bg, theme.border, theme.text)}>
              {icon}
            </div>
          )}
        </div>
        <h4 className="text-xs font-bold text-[#E2E8F0] mt-1 line-clamp-1">{title}</h4>
        {subtitle && <p className="text-[11px] text-slate-400 line-clamp-1">{subtitle}</p>}
      </div>

      {/* KPI Value & Trend Line */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className={cn('text-2xl sm:text-3xl font-black font-mono tracking-tight', theme.kpiText)}>
            {value}
          </span>
          {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
        </div>

        {/* Trend Indicator */}
        {trendValue && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-[#F43F5E]" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'}>
              {trendValue}
            </span>
          </div>
        )}
      </div>

      {/* Saturation Micro-Bar (Fiori Progress Indicator) */}
      {saturationPercent !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Saturasi Kuota</span>
            <span>{Math.round(saturationPercent)}%</span>
          </div>
          <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={cn('h-full rounded-full transition-all duration-700', theme.bar)}
              style={{ width: `${Math.min(100, Math.max(0, saturationPercent))}%` }}
            />
          </div>
        </div>
      )}

      {/* Target Comparison Footer */}
      {targetText && (
        <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 font-medium">
          {targetText}
        </div>
      )}
    </div>
  );
}
