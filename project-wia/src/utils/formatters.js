/**
 * Format teks & status dalam Bahasa Indonesia Sehari-hari untuk Warga Awam
 * SMAUMU - Web In Action (WIA) MIA 2026
 */

export function formatDistance(meters) {
  if (meters == null || isNaN(meters)) return '-';
  const m = parseFloat(meters);
  if (m < 1000) {
    return `${Math.round(m)} meter`;
  }
  return `${(m / 1000).toFixed(2)} km`;
}

export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
}

export function formatPercentage(num) {
  if (num == null) return '0%';
  return `${parseFloat(num).toFixed(1)}%`;
}

export function getJalurLabel(jalurKey) {
  const map = {
    zonasi: 'Jalur Jarak Rumah / Zonasi (50% Kursi)',
    afirmasi: 'Jalur Bantuan KJP & Inklusi (20% Kursi)',
    prestasi_akademik: 'Jalur Nilai Rapor Siswa (20% Kursi)',
    prestasi_non_akademik: 'Jalur Prestasi Lomba / Olahraga (5% Kursi)',
    perpindahan_tugas: 'Jalur Pindah Tugas Orang Tua / Guru (5% Kursi)',
  };
  return map[jalurKey] || jalurKey;
}

export function getStatusTahapanBadge(status) {
  const configs = {
    pilih_jalur: { label: 'Pilih Jalur & Sekolah', bg: 'bg-slate-100 text-slate-700 border-slate-300' },
    diajukan: { label: 'Berkas Diterima (Menunggu Cek)', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
    verifikasi_gis: { label: 'Sedang Dicek Titik Rumah', bg: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
    tinjauan_manual: { label: 'Perlu Dicek Petugas Lapangan', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    lolos_sementara: { label: 'Aman Sementara (Masuk Kuota)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    tergeser: { label: 'Kursi Tergeser Nilai/Jarak Lain', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
    diterima_resmi: { label: 'Selamat! Resmi Diterima', bg: 'bg-emerald-600 text-white border-emerald-700' },
  };
  return configs[status] || { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-300' };
}

export function getGeoAnomalyBadge(anomalyStatus) {
  if (anomalyStatus === 'aman') {
    return {
      label: 'Titik Rumah Pas & Sesuai Fakta',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'check',
      desc: 'Titik rumah yang ditandai cocok dengan alamat asli Kartu Keluarga di Dukcapil.'
    };
  }
  if (anomalyStatus === 'peringatan_toleransi') {
    return {
      label: 'Ada Selisih Titik GPS Ringan (150 - 500 Meter)',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'alert-triangle',
      desc: 'Ada sedikit perbedaan titik, petugas akan memastikan batas gang/RT domisili Anda.'
    };
  }
  return {
    label: 'Peringatan: Titik Rumah Beda Jauh (> 500 Meter)',
    bg: 'bg-pink-50 text-[#DB2777] border-pink-200',
    icon: 'shield-alert',
    desc: 'Titik rumah yang dipilih berjarak terlalu jauh dari alamat KK asli. Berkas ditahan sementara untuk diperiksa.'
  };
}
