import Navbar from './Navbar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import { ShieldCheck, Info } from 'lucide-react';

export default function Layout({ children, noContainer = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-[#E2E8F0] font-sans selection:bg-[#F97316] selection:text-white transition-colors duration-200">
      {/* Banner Ringkas di Paling Atas */}
      <div className="bg-[#18181B] text-[#E2E8F0] text-xs py-1.5 px-4 border-b border-white/10 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500/15 text-[#F97316] border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              WIA MIA 2026
            </span>
            <span className="text-slate-300 text-[11px] font-medium hidden sm:inline">
              Transparansi PPDB SMAN: Sisa kuota, jarak zonasi, dan audit publik terbuka.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-[#F97316] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
              <span>Real-Time</span>
            </div>
            <ThemeToggle variant="pill" />
          </div>
        </div>
      </div>

      {/* Floating Side Navbar (Desktop di Kiri, Mobile di Bawah) */}
      <Navbar />

      {/* Main Content Area dengan ruang leluasa di samping floating dock */}
      <div className="flex-1 lg:pl-28 pb-24 lg:pb-12 transition-all">
        <main className={`w-full ${noContainer ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}`}>
          {children}
        </main>
      </div>

      {/* Footer dengan ruang leluasa di samping floating dock */}
      <div className="lg:pl-28">
        <Footer />
      </div>
    </div>
  );
}
