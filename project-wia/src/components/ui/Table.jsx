import React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, children, ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-2xl border border-slate-200/90 shadow-xs bg-white">
      <table className={cn('w-full caption-bottom text-xs', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn('bg-slate-50/80 border-b border-slate-200', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-slate-100', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableFooter({ className, children, ...props }) {
  return (
    <tfoot className={cn('bg-slate-50 font-bold border-t border-slate-200', className)} {...props}>
      {children}
    </tfoot>
  );
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th
      className={cn(
        'h-10 px-4 text-left align-middle font-bold text-[11px] uppercase tracking-wider text-slate-500 whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn('p-4 align-middle text-slate-800 text-xs', className)} {...props}>
      {children}
    </td>
  );
}

export function TableCaption({ className, children, ...props }) {
  return (
    <caption className={cn('mt-3 text-xs text-slate-400', className)} {...props}>
      {children}
    </caption>
  );
}
