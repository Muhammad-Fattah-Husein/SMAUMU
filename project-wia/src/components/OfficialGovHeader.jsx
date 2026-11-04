import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Volume2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function OfficialGovHeader() {
  const [textSize, setTextSize] = useState('normal'); // 'small', 'normal', 'large'

  const handleTextSize = (size) => {
    setTextSize(size);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (size === 'small') {
        root.style.fontSize = '14px';
      } else if (size === 'large') {
        root.style.fontSize = '18px';
      } else {
        root.style.fontSize = '16px';
      }
    }
  };

  return (
    <header className="w-full bg-[#0F172A] text-slate-200 text-xs border-b border-slate-800">
      {/* 1. Pita Merah Putih Kenegaraan */}
      <div className="w-full h-1 bg-gradient-to-r from-[#DC2626] via-[#DC2626] to-white" />

      {/* 2. Top Bar Resmi Pemerintahan */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
          {/* Sisi Kiri: Identitas Resmi Pemprov & Kemdikbud */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Logo Pemprov DKI Jakarta */}
              <div className="w-6 h-6 relative shrink-0">
                <img 
                  src="/images/logo-pemprov-dki.svg" 
                  alt="Lambang Pemprov DKI Jakarta" 
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Logo Kemdikbud */}
              <div className="w-6 h-6 relative shrink-0">
                <img 
                  src="/images/logo-kemdikbud.svg" 
                  alt="Tut Wuri Handayani Kemendikbudristek" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-[11px] leading-tight">
              <span className="font-bold text-white uppercase tracking-wider">
                Pemerintah Provinsi DKI Jakarta
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="text-slate-300 font-medium">
                Dinas Pendidikan
              </span>
              <span className="hidden lg:inline text-slate-500">•</span>
              <span className="hidden lg:inline text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                Situs Resmi Terakreditasi BSSN
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Call Center Resmi & Aksesibilitas Warga */}
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Center:</span>
              <span className="font-mono font-bold text-white">1500-164</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-slate-300">(021) 3865001</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Senin–Jumat: 08.00–16.00 WIB</span>
            </div>

            {/* Aksesibilitas Ukuran Huruf (Standar Portal Pemerintah RI) */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Teks:</span>
              <button
                type="button"
                onClick={() => handleTextSize('small')}
                title="Perkecil Ukuran Teks"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  textSize === 'small' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleTextSize('normal')}
                title="Ukuran Teks Standar"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  textSize === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleTextSize('large')}
                title="Perbesar Ukuran Teks"
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  textSize === 'large' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Ticker Pengumuman Resmi PPDB 2026 */}
      <div className="bg-[#1E3A8A] border-t border-blue-800/60 text-white py-1.5 px-4 text-xs overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
              <AlertCircle className="w-3 h-3" />
              PENGUMUMAN RESMI
            </span>
            <span className="text-[11px] font-bold text-blue-200 hidden md:inline">
              PPDB SMAN TP 2026/2027:
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="inline-block animate-marquee text-[11px] text-slate-100">
              Pendaftaran PPDB Bersama jenjang SMA Negeri se-DKI Jakarta dilaksanakan 100% transparan dan BEBAS BIAYA (GRATIS). Waspadai segala bentuk pungutan liar dan calo. Laporkan kecurangan melalui Whistleblower System resmi Disdik DKI Jakarta. Call Center: 1500-164.
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0 text-[11px]">
            <Link 
              href="/bantuan" 
              className="text-blue-200 hover:text-white underline font-semibold transition"
            >
              Panduan Resmi
            </Link>
            <span className="text-blue-400">•</span>
            <Link 
              href="/kontak" 
              className="text-blue-200 hover:text-white underline font-semibold transition"
            >
              Posko Bantuan
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
