import { useState } from 'react';
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <Mail className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Layanan Komunikasi & Posko
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kontak & Posko Bantuan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
          Posko layanan PPDB dan helpdesk verifikasi data kependudukan.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-base text-white">Sekretariat WIA MIA 2026</h3>
            <p className="text-xs text-slate-300 mt-1">Gedung Dinas Pendidikan Lt. 4, Jakarta</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-[10px]">Alamat Posko:</p>
                <p className="font-semibold text-slate-200">Jl. Jenderal Gatot Subroto Kav. 40-42, Jakarta Selatan</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-[10px]">Layanan Telepon:</p>
                <p className="font-semibold text-slate-200">(021) 5255388 / 0800-1-SMAUMU</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-[10px]">Email Korespondensi:</p>
                <p className="font-semibold text-slate-200">kontak@smaumu.go.id</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Pesan Berhasil Terkirim!</h3>
              <p className="text-xs text-slate-500">Tim helpdesk kami akan membalas melalui email dalam kurun waktu 1x24 jam kerja.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h3 className="font-bold text-base text-slate-900">Kirim Pesan Langsung</h3>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Anda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Pesan / Pertanyaan</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan pertanyaan atau permohonan informasi..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Kirimkan Pertanyaan</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
