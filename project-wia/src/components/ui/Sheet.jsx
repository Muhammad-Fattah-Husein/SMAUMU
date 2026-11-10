import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sheet({
  open,
  onOpenChange,
  children,
  side = 'right',
  className
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onOpenChange) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop Overlay */}
      <div
        onClick={() => onOpenChange && onOpenChange(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Container */}
      <div
        className={cn(
          'fixed inset-y-0 z-50 flex h-full flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out',
          side === 'right' && 'right-0 w-full sm:max-w-2xl border-l border-slate-200',
          side === 'left' && 'left-0 w-full sm:max-w-2xl border-r border-slate-200',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className, children, onClose, ...props }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 pb-4 bg-slate-50/60',
        className
      )}
      {...props}
    >
      <div className="space-y-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          title="Tutup (Esc)"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Tutup</span>
        </button>
      )}
    </div>
  );
}

export function SheetTitle({ className, children, ...props }) {
  return (
    <h2
      className={cn('text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SheetDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-xs text-slate-500 font-medium', className)} {...props}>
      {children}
    </p>
  );
}

export function SheetContent({ className, children, ...props }) {
  return (
    <div className={cn('flex-1 overflow-y-auto p-5 sm:p-6 space-y-5', className)} {...props}>
      {children}
    </div>
  );
}

export function SheetFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-slate-100 p-4 sm:p-5 bg-slate-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
