import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = 'default',
    size = 'default',
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none shadow-xs active:scale-[0.98]';

  const variants = {
    default: 'bg-[#1E3A8A] text-white hover:bg-[#2563EB] focus-visible:ring-[#2563EB]',
    primary: 'bg-[#2563EB] text-white hover:bg-[#1E3A8A] focus-visible:ring-[#1E3A8A]',
    pink: 'bg-[#EC4899] text-white hover:bg-[#DB2777] focus-visible:ring-[#EC4899]',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 focus-visible:ring-slate-400',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400',
    ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900 shadow-none',
    destructive: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
    link: 'text-[#2563EB] underline-offset-4 hover:underline shadow-none p-0 h-auto'
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-[11px] rounded-lg',
    lg: 'h-11 px-6 text-sm rounded-2xl',
    icon: 'h-9 w-9 p-0'
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});
