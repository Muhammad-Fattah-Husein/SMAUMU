import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-tight transition-colors select-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
        secondary: 'bg-white/10 text-[#E2E8F0] border-white/15',
        success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        destructive: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        pink: 'bg-rose-500/20 text-[#FB7185] border-rose-500/35',
        purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        outline: 'bg-transparent text-[#E2E8F0] border-white/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export default Badge;
