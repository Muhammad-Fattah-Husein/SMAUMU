import { useState } from 'react';
import Layout from '@/components/Layout';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

const FAQS = [
  {
    q: 'Bagaimana cara memantau sisa kuota dan laju pendaftaran?',
    a: 'Buka menu Cek Sisa Kursi. Dasbor menampilkan sisa daya tampung per jalur seleksi, laju berkas masuk per jam, dan estimasi waktu kuota penuh.'
  },
  {
    q: 'Bagaimana sistem mendeteksi anomali zonasi domisili?',
    a: 'Sistem membandingkan koordinat GPS pendaftar dengan alamat resmi Dukcapil menggunakan formula Haversine. Deviasi >150 meter otomatis memicu peninjauan faktual.'
  },
  {
    q: 'Apa fungsi fitur Komparasi Data (Dual-Truth)?',
    a: 'Menyandingkan data formulir dengan arsip kependudukan Dukcapil dan rapor Dapodik secara berdampingan untuk mendeteksi ketidaksesuaian nilai atau masa KK.'
  },
  {
    q: 'Apakah pengaduan di whistleblower benar-benar anonim?',
    a: 'Ya, 100% anonim tanpa pencatatan nama maupun alamat IP. Pelapor diberikan token investigasi unik untuk memantau progres tindak lanjut petugas.'
  },
  {
    q: 'Bagaimana buku catatan petugas dijamin bebas manipulasi?',
    a: 'Setiap tindakan petugas diikat dalam rantai hash kriptografi SHA-256. Upaya pengubahan catatan masa lalu otomatis memutus rantai dan memicu alarm manipulasi.'
  }
];

export default function BantuanPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Pusat Bantuan
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pertanyaan Umum (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
          Jawaban ringkas seputar kuota, validasi zonasi, simulasi, dan pelaporan warga.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 mb-12">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-[#1E3A8A] transition"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Desk Contact Options */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0F172A] rounded-3xl p-8 text-white">
        <h3 className="font-bold text-base mb-2">Butuh Bantuan Langsung dari Helpdesk Dinas?</h3>
        <p className="text-xs text-slate-300 mb-6 max-w-xl">
          Tim Posko Layanan Pengaduan PPDB SMAUMU siap membantu kendala teknis verifikasi data kependudukan dan tiket pendaftaran Anda.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-3">
            <Phone className="w-5 h-5 text-brand-300" />
            <div>
              <p className="text-slate-400 text-[10px]">Hotline Bebas Pulsa</p>
              <p className="font-bold text-white">0800-1-SMAUMU (762868)</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-3">
            <Mail className="w-5 h-5 text-emerald-300" />
            <div>
              <p className="text-slate-400 text-[10px]">Email Bantuan Resmi</p>
              <p className="font-bold text-white">bantuan@smaumu.go.id</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-cyan-300" />
            <div>
              <p className="text-slate-400 text-[10px]">WhatsApp Pengaduan</p>
              <p className="font-bold text-white">+62 812-9988-2026</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
