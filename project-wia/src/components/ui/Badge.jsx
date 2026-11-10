import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}) {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight border transition-colors select-none';

  const variants = {
    default: 'bg-blue-50 text-[#1E3A8A] border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    destructive: 'bg-rose-50 text-rose-800 border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    pink: 'bg-pink-50 text-[#DB2777] border-pink-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    outline: 'bg-white text-slate-700 border-slate-300'
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
