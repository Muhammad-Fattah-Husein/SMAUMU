/**
 * Konstanta Sistem SMAUMU
 * Bahasa Indonesia Sehari-hari untuk Warga Awam & Orang Tua Siswa
 * Web In Action (WIA) MIA 2026
 */

export const NAV_LINKS_PUBLIC = [
  { href: '/', label: 'Beranda', desc: 'Halaman Utama' },
  { href: '/kuota', label: 'Sisa Kuota', desc: 'Pantau Kuota Real-Time' },
  { href: '/daftar', label: 'Pendaftaran', desc: 'Alur 4 Langkah' },
  { href: '/simulator', label: 'Simulator', desc: 'Peluang Masuk SMAN' },
  { href: '/whistleblower', label: 'Whistleblower', desc: 'Pengaduan Anonim' },
  { href: '/audit-log', label: 'Audit Log', desc: 'Buku Besar SHA-256' },
];

export const NAV_LINKS_ADMIN = [
  { href: '/admin/dashboard', label: 'Dasbor' },
  { href: '/admin/permohonan', label: 'Berkas Masuk' },
  { href: '/admin/verifikasi-anomali', label: 'Verifikasi Anomali' },
  { href: '/admin/master-kuota', label: 'Master Kuota' },
  { href: '/admin/audit-log', label: 'Audit Log' },
  { href: '/admin/export', label: 'Export Data' },
  { href: '/admin/pengaturan', label: 'Pengaturan' },
];

export const FOOTER_LINKS_GENERAL = [
  { href: '/tentang', label: 'Tentang Aplikasi' },
  { href: '/kebijakan-privasi', label: 'Kebijakan Privasi' },
  { href: '/syarat-ketentuan', label: 'Syarat & Ketentuan' },
  { href: '/kontak', label: 'Kontak & Posko Bantuan' },
];

export const INITIAL_SEKOLAH = [
  {
    id: 1,
    npsn: '20101567',
    nama_sekolah: 'SMAN 1 Jakarta (Boedoet)',
    alamat: 'Jl. Budi Utomo No.7, Pasar Baru',
    kelurahan: 'Pasar Baru',
    kecamatan: 'Sawah Besar',
    kota: 'Jakarta Pusat',
    lat: -6.166881,
    lng: 106.837319,
    radius_max: 3200,
    kuota_total: 288,
    telepon: '(021) 3865001',
    akreditasi: 'A (Sangat Baik)'
  },
  {
    id: 2,
    npsn: '20102554',
    nama_sekolah: 'SMAN 8 Jakarta (Bukit Duri)',
    alamat: 'Jl. Taman Bukit Duri No.2, Bukit Duri',
    kelurahan: 'Bukit Duri',
    kecamatan: 'Tebet',
    kota: 'Jakarta Selatan',
    lat: -6.223400,
    lng: 106.858712,
    radius_max: 3500,
    kuota_total: 360,
    telepon: '(021) 8295455',
    akreditasi: 'A (Sangat Baik)'
  },
  {
    id: 3,
    npsn: '20103289',
    nama_sekolah: 'SMAN 34 Jakarta (Pondok Labu)',
    alamat: 'Jl. Margasatwa No.1, Pondok Labu',
    kelurahan: 'Pondok Labu',
    kecamatan: 'Cilandak',
    kota: 'Jakarta Selatan',
    lat: -6.311740,
    lng: 106.799320,
    radius_max: 3800,
    kuota_total: 324,
    telepon: '(021) 7502345',
    akreditasi: 'A (Sangat Baik)'
  },
  {
    id: 4,
    npsn: '20107812',
    nama_sekolah: 'SMAN 28 Jakarta (Pasar Minggu)',
    alamat: 'Jl. Ragunan No.14, Pasar Minggu',
    kelurahan: 'Pasar Minggu',
    kecamatan: 'Pasar Minggu',
    kota: 'Jakarta Selatan',
    lat: -6.289120,
    lng: 106.835420,
    radius_max: 3400,
    kuota_total: 288,
    telepon: '(021) 7800921',
    akreditasi: 'A (Sangat Baik)'
  },
  {
    id: 5,
    npsn: '20104112',
    nama_sekolah: 'SMAN 70 Jakarta (Bulungan)',
    alamat: 'Jl. Bulungan Blok C No.1, Kramat Pela',
    kelurahan: 'Kramat Pela',
    kecamatan: 'Kebayoran Baru',
    kota: 'Jakarta Selatan',
    lat: -6.241512,
    lng: 106.797821,
    radius_max: 3500,
    kuota_total: 360,
    telepon: '(021) 7221234',
    akreditasi: 'A (Sangat Baik)'
  },
  {
    id: 6,
    npsn: '20101601',
    nama_sekolah: 'SMAN 68 Jakarta (Salemba)',
    alamat: 'Jl. Salemba Raya No.18, Kenari',
    kelurahan: 'Kenari',
    kecamatan: 'Senen',
    kota: 'Jakarta Pusat',
    lat: -6.195211,
    lng: 106.852441,
    radius_max: 3300,
    kuota_total: 320,
    telepon: '(021) 3144123',
    akreditasi: 'A (Sangat Baik)'
  }
];

export const INITIAL_BLANK_SPOTS = [
  {
    id: 'BS-01',
    kecamatan: 'Cipayung (Jakarta Timur)',
    kelurahan: 'Ceger & Bambu Apus',
    lulusan_smp: 1840,
    kuota_sman_tersedia: 288,
    defisit_kursi: 1552,
    status_kerentanan: 'Sangat Kurang Sekolah SMA',
    rekomendasi: 'Perlu dibangun gedung SMA Negeri baru & kuota afirmasi warga sekitar ditambah'
  },
  {
    id: 'BS-02',
    kecamatan: 'Kalideres (Jakarta Barat)',
    kelurahan: 'Kamal & Tegal Alur',
    lulusan_smp: 2310,
    kuota_sman_tersedia: 576,
    defisit_kursi: 1734,
    status_kerentanan: 'Sangat Kurang Sekolah SMA',
    rekomendasi: 'Bantuan biaya sekolah swasta gratis & perluasan jangkauan kuota zonasi terdekat'
  },
  {
    id: 'BS-03',
    kecamatan: 'Koja (Jakarta Utara)',
    kelurahan: 'Rawabadak Selatan',
    lulusan_smp: 1420,
    kuota_sman_tersedia: 360,
    defisit_kursi: 1060,
    status_kerentanan: 'Kekurangan Kursi Sedang',
    rekomendasi: 'Penambahan jumlah kelas di SMA yang sudah ada'
  }
];
