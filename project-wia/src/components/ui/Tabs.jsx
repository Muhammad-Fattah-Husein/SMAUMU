import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value !== undefined ? value : internalValue;

  const handleSelect = (val) => {
    if (onValueChange) onValueChange(val);
    if (value === undefined) setInternalValue(val);
  };

  return (
    <TabsContext.Provider value={{ activeValue, handleSelect }}>
      <div className={cn('space-y-3', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-slate-600 border border-slate-200/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, disabled, ...props }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      disabled={disabled}
      aria-selected={isActive}
      onClick={() => context.handleSelect(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none',
        isActive
          ? 'bg-white text-slate-900 shadow-xs font-black'
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('animate-fade-in focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
