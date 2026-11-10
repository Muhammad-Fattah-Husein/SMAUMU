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
        className={`p-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-[#F97316] transition flex items-center justify-center ${className}`}
      >
        {showLightState ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    );
  }

  if (variant === 'sidebar') {
    if (!isExpanded) {
      return (
        <button
          type="button"
          onClick={toggleTheme}
          title={`Ganti Background: ${label}`}
          aria-label={`Ganti Background: ${label}`}
          className={`w-full flex items-center justify-center p-2.5 rounded-2xl bg-orange-500/15 hover:bg-orange-500/25 text-[#F97316] border border-orange-500/30 transition relative group ${className}`}
        >
          {showLightState ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1E1E24] text-[#E2E8F0] text-[11px] font-semibold rounded-xl shadow-xl border border-white/15 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            {label}
          </div>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-orange-500/15 hover:bg-orange-500/25 text-[#F97316] border border-orange-500/30 text-xs font-bold transition ${className}`}
      >
        <div className="flex items-center gap-2">
          {showLightState ? <Moon className="w-4 h-4 shrink-0" /> : <Sun className="w-4 h-4 shrink-0" />}
          <span className="truncate">{label}</span>
        </div>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/30">
          {showLightState ? 'Gelap' : 'Terang'}
        </span>
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
