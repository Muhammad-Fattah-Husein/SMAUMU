import { useId } from 'react';

/**
 * Logo resmi SMAUMU (Konsep 05 — "Langkah Bersama Menuju SMA").
 * Memadukan figur pendamping & siswa yang berpegangan membentuk huruf "U" (UntukMu)
 * menghadap bintang harapan, adaptif di tema Sunset Obsidian maupun Light Mode.
 */
export default function BrandLogo({ className = 'w-9 h-9', iconClassName = 'w-6 h-6' }) {
  const uid = useId().replace(/:/g, '');
  const leftGradId = `smaumu-left-${uid}`;
  const rightGradId = `smaumu-right-${uid}`;

  return (
    <div
      className={`rounded-xl bg-[#121212] border border-orange-500/35 text-[#E2E8F0] flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClassName}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={leftGradId} x1="16" y1="20" x2="40" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
          <linearGradient id={rightGradId} x1="64" y1="22" x2="40" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>

        {/* Bintang Harapan di Puncak */}
        <path
          d="M40 12L42.5 18.5L49 21L42.5 23.5L40 30L37.5 23.5L31 21L37.5 18.5L40 12Z"
          fill="currentColor"
        />

        {/* Figur Pendamping / Sekolah (Sayap Kiri huruf U) */}
        <circle cx="24" cy="24" r="5.5" fill="#F97316" />
        <path
          d="M18 33C18 48 25.5 64 40 65.5C33.5 58 29.5 47.5 29.5 34.5C29.5 31.8 26.8 30.2 23.8 30.5C20.5 30.8 18 31.8 18 33Z"
          fill={`url(#${leftGradId})`}
        />

        {/* Figur Siswa Penuh Harapan (Sayap Kanan huruf U) */}
        <circle cx="56" cy="26" r="5" fill="#F43F5E" />
        <path
          d="M62 35C62 49.5 54.5 64 40 65.5C46.5 58 50.5 48.5 50.5 36.5C50.5 33.8 53.2 32.2 56.2 32.5C59.5 32.8 62 33.8 62 35Z"
          fill={`url(#${rightGradId})`}
        />

        {/* Jembatan Genggaman Tangan & Senyum */}
        <path
          d="M29.5 45.5C33 49 36.5 50.5 40 50.5C43.5 50.5 47 49 50.5 45.5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
