import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle({ variant = 'pill', isExpanded = false, className = '' }) {
  const { isLight, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showLightState = mounted && isLight;
  const label = showLightState ? 'Latar Hitam' : 'Latar Putih';
  const shortLabel = showLightState ? 'Hitam' : 'Putih';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={`Ganti Background ke ${showLightState ? 'Hitam (Obsidian)' : 'Putih'}`}
        aria-label={`Ganti Background ke ${showLightState ? 'Hitam' : 'Putih'}`}
        className={`w-9 h-9 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[#F97316] transition flex items-center justify-center shrink-0 ${className}`}
      >
        {showLightState ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'admin') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-[#F97316] border border-orange-500/30 text-xs font-bold transition ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="w-5 flex items-center justify-center shrink-0">
            {showLightState ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </span>
          <span className="truncate">{label}</span>
        </div>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/30">
          {showLightState ? 'Gelap' : 'Terang'}
        </span>
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={!isExpanded ? `Ganti Background: ${label}` : undefined}
        aria-label={`Ganti Background: ${label}`}
        className={`w-full h-11 px-1.5 flex items-center rounded-2xl bg-orange-500/15 hover:bg-orange-500/25 text-[#F97316] border border-orange-500/30 transition-colors overflow-hidden ${className}`}
      >
        <span className="w-11 h-11 flex items-center justify-center shrink-0">
          {showLightState ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </span>
        <div
          className={`min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ${
            isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="pl-2.5 pr-1.5 flex items-center justify-between whitespace-nowrap">
            <span className="text-xs font-bold truncate">{label}</span>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/30 shrink-0">
              {showLightState ? 'Gelap' : 'Terang'}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Ganti Background ke ${showLightState ? 'Hitam (#121212)' : 'Putih (#FFFFFF)'}`}
      aria-label={`Ganti Background ke ${showLightState ? 'Hitam' : 'Putih'}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[#F97316] text-[11px] font-bold transition shadow-xs cursor-pointer ${className}`}
    >
      {showLightState ? (
        <Moon className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <Sun className="w-3.5 h-3.5 shrink-0" />
      )}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
    </button>
  );
}
