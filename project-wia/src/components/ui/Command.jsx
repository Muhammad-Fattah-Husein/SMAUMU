import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog';

const Command = React.forwardRef(function Command({ className, ...props }, ref) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-3xl bg-[#1A1A1E] text-[#E2E8F0]',
        className
      )}
      {...props}
    />
  );
});
Command.displayName = CommandPrimitive.displayName;

function CommandDialog({ children, ...props }) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-xl border border-white/10" hideClose>
        <DialogTitle className="sr-only">Pencarian Cepat SMAUMU</DialogTitle>
        <DialogDescription className="sr-only">
          Cari menu layanan publik, halaman admin, atau data SMA Negeri di DKI Jakarta.
        </DialogDescription>
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-slate-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-4 [&_[cmdk-input-wrapper]_svg]:w-4 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

const CommandInput = React.forwardRef(function CommandInput({ className, ...props }, ref) {
  return (
    <div className="flex items-center border-b border-white/10 bg-[#141417] px-4" cmdk-input-wrapper="">
      <Search className="mr-2.5 h-4 w-4 shrink-0 text-[#F97316]" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-md bg-transparent py-3 text-xs sm:text-sm font-semibold text-[#E2E8F0] outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
      <span className="hidden sm:inline ml-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 shrink-0">
        ESC
      </span>
    </div>
  );
});
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef(function CommandList({ className, ...props }, ref) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn('max-h-[380px] overflow-y-auto overflow-x-hidden py-2', className)}
      {...props}
    />
  );
});
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef(function CommandEmpty(props, ref) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className="py-8 text-center text-xs text-slate-400"
      {...props}
    />
  );
});
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef(function CommandGroup({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'overflow-hidden p-1 text-[#E2E8F0] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-slate-400',
        className
      )}
      {...props}
    />
  );
});
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef(function CommandSeparator({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-white/10', className)}
      {...props}
    />
  );
});
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef(function CommandItem({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#E2E8F0] outline-none transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-orange-500/15 data-[selected=true]:text-[#F97316] data-[disabled=true]:opacity-50',
        className
      )}
      {...props}
    />
  );
});
CommandItem.displayName = CommandPrimitive.Item.displayName;

function CommandShortcut({ className, ...props }) {
  return (
    <span
      className={cn('ml-auto text-[10px] font-mono tracking-widest text-slate-400', className)}
      {...props}
    />
  );
}
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
