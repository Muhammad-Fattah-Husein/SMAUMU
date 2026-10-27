/**
 * Initial mock data for SMAUMU.
 * Structured to closely match Firestore collections or Supabase tables:
 * - schools
 * - admission_quotas
 * - announcements
 * - users / school_admins
 */

export const INITIAL_SCHOOLS = [
  {
    id: 'sman1-jkt',
    name: 'SMAN 1 Jakarta (Budi Utomo)',
    npsn: '20101234',
    district: 'Sawah Besar',
    address: 'Jl. Budi Utomo No.7, Pasar Baru, Kec. Sawah Besar, Jakarta Pusat',
    phone: '(021) 3865001',
    email: 'info@sman1jakarta.sch.id',
    website: 'https://sman1jakarta.sch.id',
    adminUsername: 'admin_sman1',
    quota: {
      totalSeats: 360,
      filledSeats: 311,
      zonasiTotal: 180,
      zonasiFilled: 162,
      prestasiTotal: 108,
      prestasiFilled: 95,
      afirmasiTotal: 54,
      afirmasiFilled: 42,
      perpindahanTotal: 18,
      perpindahanFilled: 12,
      lastUpdated: new Date().toISOString(),
    },
    announcements: [
      {
        id: 'ann-1',
        title: 'Pendaftaran Jalur Zonasi Resmi Ditutup',
        content: 'Batas waktu pendaftaran daring untuk Jalur Zonasi telah ditutup per pukul 14:00 WIB. Pengumuman seleksi berkas fisik akan diunggah sore ini.',
        category: 'Zonasi',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ann-2',
        title: 'Verifikasi Berkas Jalur Prestasi Akademik',
        content: 'Calon peserta didik yang telah mengunggah sertifikat OSN/O2SN harap memantau status validasi rapor di menu portal PPDB resmi.',
        category: 'Prestasi',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      }
    ]
  },
  {
    id: 'sman8-jkt',
    name: 'SMAN 8 Jakarta (Delapan)',
    npsn: '20101235',
    district: 'Tebet',
    address: 'Jl. Taman Bukit Duri No.2, RT.2/RW.12, Bukit Duri, Kec. Tebet, Jakarta Selatan',
    phone: '(021) 8295455',
    email: 'humas@sman8jkt.sch.id',
    website: 'https://sman8jkt.sch.id',
    adminUsername: 'admin_sman8',
    quota: {
      totalSeats: 360,
      filledSeats: 347,
      zonasiTotal: 180,
      zonasiFilled: 175,
      prestasiTotal: 108,
      prestasiFilled: 105,
      afirmasiTotal: 54,
      afirmasiFilled: 50,
      perpindahanTotal: 18,
      perpindahanFilled: 17,
      lastUpdated: new Date().toISOString(),
    },
    announcements: [
      {
        id: 'ann-3',
        title: 'PENTING: Kuota Jalur Zonasi Sisa 5 Kursi',
        content: 'Daya tampung jalur zonasi tersisa 5 kursi. Seleksi berdasarkan jarak domisili terdekat dengan titik koordinat sekolah.',
        category: 'Penting',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      }
    ]
  },
  {
    id: 'sman3-bdg',
    name: 'SMAN 3 Bandung',
    npsn: '20219876',
    district: 'Bandung Wetan',
    address: 'Jl. Belitung No.8, Merdeka, Kec. Sumur Bandung, Kota Bandung',
    phone: '(022) 4235154',
    email: 'info@sman3bdg.sch.id',
    website: 'https://sman3bdg.sch.id',
    adminUsername: 'admin_sman3',
    quota: {
      totalSeats: 350,
      filledSeats: 265,
      zonasiTotal: 175,
      zonasiFilled: 140,
      prestasiTotal: 105,
      prestasiFilled: 80,
      afirmasiTotal: 50,
      afirmasiFilled: 35,
      perpindahanTotal: 20,
      perpindahanFilled: 10,
      lastUpdated: new Date().toISOString(),
    },
    announcements: [
      {
        id: 'ann-4',
        title: 'Informasi Verifikasi Afirmasi KETM & Disabilitas',
        content: 'Calon siswa dari keluarga ekonomi tidak mampu dapat membawa bukti fisik KIP/PKH ke meja posko PPDB SMAN 3 Bandung mulai pukul 08.00 WIB.',
        category: 'Afirmasi',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      }
    ]
  },
  {
    id: 'sman28-jkt',
    name: 'SMAN 28 Jakarta',
    npsn: '20101236',
    district: 'Pasar Minggu',
    address: 'Jl. Ragunan No.1, RT.1/RW.3, Jati Padang, Kec. Pasar Minggu, Jakarta Selatan',
    phone: '(021) 7805177',
    email: 'admin@sman28jkt.sch.id',
    website: 'https://sman28jkt.sch.id',
    adminUsername: 'admin_sman28',
    quota: {
      totalSeats: 288,
      filledSeats: 221,
      zonasiTotal: 144,
      zonasiFilled: 120,
      prestasiTotal: 86,
      prestasiFilled: 65,
      afirmasiTotal: 43,
      afirmasiFilled: 28,
      perpindahanTotal: 15,
      perpindahanFilled: 8,
      lastUpdated: new Date().toISOString(),
    },
    announcements: [
      {
        id: 'ann-5',
        title: 'Layanan Call Center PPDB SMAN 28 Jakarta',
        content: 'Konsultasi pertanyaan teknis zonasi dan titik koordinat dapat menghubungi WhatsApp posko PPDB kami di jam kerja.',
        category: 'Umum',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      }
    ]
  },
  {
    id: 'sman70-jkt',
    name: 'SMAN 70 Jakarta (Bulungan)',
    npsn: '20101237',
    district: 'Kebayoran Baru',
    address: 'Jl. Bulungan Blok C No.2, Kramat Pela, Kec. Kebayoran Baru, Jakarta Selatan',
    phone: '(021) 7222340',
    email: 'tatausaha@sman70.sch.id',
    website: 'https://sman70.sch.id',
    adminUsername: 'admin_sman70',
    quota: {
      totalSeats: 320,
      filledSeats: 294,
      zonasiTotal: 160,
      zonasiFilled: 150,
      prestasiTotal: 96,
      prestasiFilled: 90,
      afirmasiTotal: 48,
      afirmasiFilled: 40,
      perpindahanTotal: 16,
      perpindahanFilled: 14,
      lastUpdated: new Date().toISOString(),
    },
    announcements: [
      {
        id: 'ann-6',
        title: 'Sosialisasi Alur Daftar Ulang Peserta Lolos Zonasi',
        content: 'Bagi siswa yang telah dinyatakan diterima sementara pada pemeringkatan Zonasi, daftar ulang daring akan dibuka mulai lusa.',
        category: 'Zonasi',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      }
    ]
  },
  {
    id: 'sman5-sby',
    name: 'SMAN 5 Surabaya',
    npsn: '20532101',
    district: 'Genteng',
    address: 'Jl. Kusuma Bangsa No.21, Ketabang, Kec. Genteng, Kota Surabaya',
    phone: '(031) 5343442',
    email: 'admin@sman5sby.sch.id',
    website: 'https://sman5sby.sch.id',
    adminUsername: 'admin_sman5',
    quota: {
      totalSeats: 380,
      filledSeats: 284,
      zonasiTotal: 190,
      zonasiFilled: 160,
      prestasiTotal: 114,
      prestasiFilled: 85,
      afirmasiTotal: 57,
      afirmasiFilled: 30,
      perpindahanTotal: 19,
      perpindahanFilled: 9,
      lastUpdated: new Date().toISOString(),
    },
    announcements: [
      {
        id: 'ann-7',
        title: 'Pemberitahuan Seleksi Jalur Perpindahan Tugas Orang Tua',
        content: 'Verifikasi SK mutasi dinas bagi orang tua TNI/Polri/ASN dilayani di ruang rapat utama lantai 2.',
        category: 'Perpindahan',
        isActive: true,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ]
  }
];

export const DEMO_ADMINS = [
  {
    username: 'admin_sman1',
    password: 'password123',
    schoolId: 'sman1-jkt',
    name: 'Admin SMAN 1 Jakarta',
  },
  {
    username: 'admin_sman8',
    password: 'password123',
    schoolId: 'sman8-jkt',
    name: 'Admin SMAN 8 Jakarta',
  },
  {
    username: 'admin_sman3',
    password: 'password123',
    schoolId: 'sman3-bdg',
    name: 'Admin SMAN 3 Bandung',
  },
];
