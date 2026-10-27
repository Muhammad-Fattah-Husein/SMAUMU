import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-smaumu-surface border-t border-gray-200 mt-auto text-gray-700 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-smaumu-primary flex items-center justify-center text-white font-heading font-black shadow-sm">
              S
            </div>
            <div>
              <p className="font-heading font-extrabold text-smaumu-primary text-base">
                SMAUMU (SMA UntukMu)
              </p>
              <p className="text-xs text-gray-500 font-body font-medium">
                Platform Transparansi Kuota &amp; PPDB SMAN untuk Siswa Kelas 9
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-600 font-semibold flex flex-wrap justify-center gap-6 font-body">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-smaumu-primary mr-1.5"></span>Zonasi (Min 50%)</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-smaumu-accent mr-1.5"></span>Afirmasi (Min 15%)</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>Prestasi</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>Perpindahan</span>
          </div>
          <div className="text-xs text-gray-500 font-body">
            &copy; 2026 SMAUMU Platform &bull; Edisi Nasional Merah Putih
          </div>
        </div>
      </div>
    </footer>
  );
};
