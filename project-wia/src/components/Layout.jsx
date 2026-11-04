import OfficialGovHeader from './OfficialGovHeader';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, noContainer = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header Resmi Pemerintahan RI & DKI Jakarta (Pita Merah Putih, Call Center, Marquee Pengumuman) */}
      <OfficialGovHeader />

      {/* 2. Primary Top Navigation Bar */}
      <Navbar />

      {/* 3. Main Content Area */}
      <div className="flex-1 transition-all pb-24 lg:pb-16">
        <main className={`w-full ${noContainer ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'}`}>
          {children}
        </main>
      </div>

      {/* 4. Footer Resmi Pemerintahan */}
      <Footer />
    </div>
  );
}
