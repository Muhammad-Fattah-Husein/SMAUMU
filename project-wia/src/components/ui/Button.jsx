import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] disabled:pointer-events-none disabled:opacity-50 select-none shadow-xs active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#F97316] text-white hover:bg-[#EA580C] focus-visible:ring-[#F97316] shadow-orange-500/20',
        primary: 'bg-gradient-to-r from-[#F97316] to-[#F43F5E] text-white hover:from-[#EA580C] hover:to-[#E11D48] focus-visible:ring-[#F97316] shadow-orange-500/20',
        pink: 'bg-[#F43F5E] text-white hover:bg-[#E11D48] focus-visible:ring-[#F43F5E]',
        secondary: 'bg-[#222227] text-[#E2E8F0] hover:bg-[#2A2A32] border border-white/10 focus-visible:ring-slate-500',
        outline: 'border border-white/15 bg-[#1A1A1E] text-[#E2E8F0] hover:bg-white/10 hover:text-white focus-visible:ring-[#F97316]',
        ghost: 'hover:bg-white/10 text-slate-300 hover:text-[#E2E8F0] shadow-none',
        destructive: 'bg-[#F43F5E] text-white hover:bg-[#E11D48] focus-visible:ring-[#F43F5E]',
        success: 'bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500',
        link: 'text-[#F97316] underline-offset-4 hover:underline shadow-none p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-[11px] rounded-lg',
        lg: 'h-11 px-6 text-sm rounded-2xl',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(function Button(
  { className, variant, size, asChild = false, type = 'button', ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      {...(!asChild ? { type } : {})}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;
