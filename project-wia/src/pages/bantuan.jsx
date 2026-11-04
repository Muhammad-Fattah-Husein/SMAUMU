import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Compass, 
  FileText, 
  Award, 
  AlertTriangle,
  ArrowRight,
  Search
} from 'lucide-react';

export default function BantuanPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const ALL_FAQS = [
    {
      kategori: 'zonasi',
      kategoriLabel: 'Zonasi & Domisili',
      q: 'Bagaimana cara penentuan batas zonasi dan penghitungan jarak rumah ke SMAN?',
      a: 'Penghitungan jarak domisili pendaftar ke sekolah tujuan menggunakan formula geospasial Great-Circle (Haversine) yang ditarik garis lurus dari titik koordinat Kartu Keluarga (KK) yang terverifikasi Dukcapil ke titik gerbang utama sekolah yang terdaftar di Pusdatin Kemendikbudristek. Sistem tidak menggunakan perkiraan rute jalan raya melainkan koordinat geodesik presisi.'
    },
    {
      kategori: 'zonasi',
      kategoriLabel: 'Zonasi & Domisili',
      q: 'Apa yang dimaksud dengan Prioritas 1 dan Prioritas 2 pada Jalur Zonasi?',
      a: 'Zonasi Prioritas 1 diperuntukkan bagi calon peserta didik yang berdomisili di RT yang sama dengan RT sekolah atau RT yang berbatasan langsung dengan RT sekolah. Zonasi Prioritas 2 mencakup kelurahan yang sama dengan kelurahan sekolah atau kelurahan tetangga yang telah ditetapkan dalam Keputusan Kepala Dinas Pendidikan DKI Jakarta.'
    },
    {
      kategori: 'zonasi',
      kategoriLabel: 'Zonasi & Domisili',
      q: 'Berapa lama masa tinggal minimal pada Kartu Keluarga (KK) untuk dapat mendaftar?',
      a: 'Sesuai regulasi Pergub DKI No. 15 Tahun 2024, calon peserta didik baru wajib tercantum dalam Kartu Keluarga yang diterbitkan paling singkat 1 (satu) tahun (12 bulan) berturut-turut sebelum tanggal pendaftaran PPDB dimulai, dengan kepala keluarga adalah orang tua kandung atau wali yang sah.'
    },
    {
      kategori: 'pendaftaran',
      kategoriLabel: 'Alur Pendaftaran',
      q: 'Bagaimana alur pendaftaran 4 tahap di portal SMAUMU?',
      a: 'Tahap 1: Pengajuan Akun & Verifikasi NIK/NISN. Tahap 2: Pemilihan Jalur Pendaftaran & Sekolah Tujuan (SMAN Utama & Cadangan). Tahap 3: Unggah Dokumen Pendukung (KK, Rapor/Sertifikat Prestasi). Tahap 4: Konfirmasi & Cetak Tanda Bukti Pendaftaran Resmi ber-QR Code dan tanda tangan hash kriptografis SHA-256.'
    },
    {
      kategori: 'pendaftaran',
      kategoriLabel: 'Alur Pendaftaran',
      q: 'Bagaimana jika nama siswa atau NIK tidak ditemukan di sistem saat mendaftar?',
      a: 'Hal ini biasanya terjadi karena data kependudukan Dukcapil belum tersinkronisasi atau terdapat pembaharuan KK baru. Calon peserta didik dapat mengajukan penyesuaian melalui Posko Bantuan Suku Dinas Pendidikan setempat atau menghubungi Call Center 1500-164 dengan membawa KTP, KK, dan Akta Kelahiran asli.'
    },
    {
      kategori: 'kuota',
      kategoriLabel: 'Pemantauan Kuota',
      q: 'Bagaimana cara membaca Bar Keterisian Kuota di menu Pantau Kuota?',
      a: 'Setiap kartu sekolah menampilkan Master Progress Bar keterisian keseluruhan kapasitas dan bar khusus per-jalur (Zonasi, Afirmasi, Prestasi, dan Mutasi). Warna bar menunjukkan status: Hijau (<65% - Tersedia), Kuning (65-84% - Cepat Terisi), Oranye (≥85% - Hampir Penuh), dan Merah (100% - Kuota Penuh). Laju berkas per jam juga ditampilkan untuk mengukur kecepatan pendaftaran.'
    },
    {
      kategori: 'afirmasi',
      kategoriLabel: 'Afirmasi & KJP',
      q: 'Siapa saja yang berhak mendaftar melalui Jalur Afirmasi?',
      a: 'Jalur Afirmasi diperuntukkan bagi anak penerima KJP Plus yang masih aktif, anak pemegang Kartu Indonesia Pintar (KIP / PIP Kemdikbud), anak panti asuhan, anak penyandang disabilitas (berdasarkan rekomendasi asesmen psikolog), serta anak dari pengemudi mitra Transjakarta dan pekerja buruh yang terdaftar di Disnakertrans.'
    },
    {
      kategori: 'audit',
      kategoriLabel: 'Audit & Pengaduan',
      q: 'Apakah pelaporan kecurangan di Whistleblower System benar-benar rahasia?',
      a: 'Ya, 100% aman dan anonim. Sistem tidak mencatat nama, alamat email, maupun alamat IP perangkat pelapor. Pelapor akan diberikan Token Aduan unik (contoh: TOKEN-WBL-7821-XYZ) yang hanya dipegang oleh pelapor untuk memeriksa status investigasi oleh Inspektorat Disdik tanpa membuka identitas pelapor.'
    },
    {
      kategori: 'audit',
      kategoriLabel: 'Audit & Pengaduan',
      q: 'Mengapa catatan verifikasi petugas menggunakan penanda hash SHA-256?',
      a: 'Setiap aksi persetujuan, penolakan berkas, atau mutasi kuota diikat ke dalam rantai blok hash kriptografis (immutable audit ledger). Karena setiap blok memuat hash dari blok sebelumnya, data masa lalu tidak mungkin diubah, disisipi, atau dimanipulasi tanpa terdeteksi oleh sistem pengawas publik.'
    }
  ];

  const filteredFaqs = ALL_FAQS.filter(faq => {
    const matchCategory = activeTab === 'all' || faq.kategori === activeTab;
    const matchQuery = searchQuery === '' || 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto mb-14">
        
        {/* Header Resmi */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#1E3A8A] text-white">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              Pusat Informasi & FAQ
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Panduan & Pertanyaan Umum (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kumpulan panduan teknis, tata cara pendaftaran, mekanisme zonasi geospasial, dan regulasi resmi PPDB SMAN DKI Jakarta.
          </p>
        </div>

        {/* Kotak Pencarian Bantuan */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik bantuan (contoh: zonasi, syarat KK, KJP, token aduan, daya tampung)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition"
          />
        </div>

        {/* Tab Kategori */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'all'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Semua Topik ({ALL_FAQS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('zonasi')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'zonasi'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Zonasi & Domisili
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pendaftaran')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'pendaftaran'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Alur Pendaftaran
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kuota')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'kuota'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Data Kuota
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('afirmasi')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'afirmasi'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Afirmasi & KJP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl shrink-0 transition ${
              activeTab === 'audit'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Audit & Pengaduan
          </button>
        </div>

        {/* Daftar Pertanyaan (FAQ Accordion) */}
        <div className="space-y-3 mb-10">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left font-extrabold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      <div className="mb-2">
                        <span className="text-[10px] font-bold bg-blue-100 text-[#1E3A8A] px-2 py-0.5 rounded">
                          {faq.kategoriLabel}
                        </span>
                      </div>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
            </div>
          )}
        </div>

        {/* Banner Kontak Bantuan Bawah */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-black text-slate-900 text-base">Masih Memiliki Pertanyaan Lain?</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Hubungi petugas posko pelayanan kami atau ajukan tiket bantuan secara online.
            </p>
          </div>
          <Link
            href="/kontak"
            className="px-5 py-3 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold text-xs shrink-0 transition flex items-center gap-2 shadow"
          >
            <span>Buka Posko & Kontak</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </Layout>
  );
}
