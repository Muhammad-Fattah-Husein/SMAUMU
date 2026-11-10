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
      bar: 'bg-blue-600',
      bg: 'bg-blue-50/60',
      border: 'border-blue-200/80',
      text: 'text-[#1E3A8A]',
      kpiText: 'text-slate-900'
    },
    emerald: {
      bar: 'bg-emerald-600',
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200/80',
      text: 'text-emerald-700',
      kpiText: 'text-emerald-950'
    },
    pink: {
      bar: 'bg-[#EC4899]',
      bg: 'bg-pink-50/60',
      border: 'border-pink-200/80',
      text: 'text-[#DB2777]',
      kpiText: 'text-slate-900'
    },
    amber: {
      bar: 'bg-amber-500',
      bg: 'bg-amber-50/60',
      border: 'border-amber-200/80',
      text: 'text-amber-800',
      kpiText: 'text-amber-950'
    },
    rose: {
      bar: 'bg-rose-600',
      bg: 'bg-rose-50/60',
      border: 'border-rose-200/80',
      text: 'text-rose-800',
      kpiText: 'text-rose-950'
    }
  };

  const theme = colorStyles[statusColor] || colorStyles.blue;

  return (
    <div
      className={cn(
        'rounded-3xl border bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative overflow-hidden',
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
        <h4 className="text-xs font-bold text-slate-700 mt-1 line-clamp-1">{title}</h4>
        {subtitle && <p className="text-[11px] text-slate-400 line-clamp-1">{subtitle}</p>}
      </div>

      {/* KPI Value & Trend Line */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className={cn('text-2xl sm:text-3xl font-black font-mono tracking-tight', theme.kpiText)}>
            {value}
          </span>
          {unit && <span className="text-xs font-bold text-slate-500">{unit}</span>}
        </div>

        {/* Trend Indicator */}
        {trendValue && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold">
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={trend === 'up' ? 'text-emerald-700' : trend === 'down' ? 'text-rose-700' : 'text-slate-500'}>
              {trendValue}
            </span>
          </div>
        )}
      </div>

      {/* Saturation Micro-Bar (Fiori Progress Indicator) */}
      {saturationPercent !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Saturasi Kuota</span>
            <span>{Math.round(saturationPercent)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={cn('h-full rounded-full transition-all duration-700', theme.bar)}
              style={{ width: `${Math.min(100, Math.max(0, saturationPercent))}%` }}
            />
          </div>
        </div>
      )}

      {/* Target Comparison Footer */}
      {targetText && (
        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
          {targetText}
        </div>
      )}
    </div>
  );
}
