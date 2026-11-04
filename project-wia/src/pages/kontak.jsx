import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Building, 
  Clock, 
  Headphones, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const POSKO_WILAYAH = [
    {
      wilayah: 'Posko Induk Disdik Provinsi DKI Jakarta',
      alamat: 'Gedung Dinas Pendidikan Lt. 1 & 2, Jl. Gatot Subroto Kav. 40-41, Kuningan Barat, Mampang Prapatan, Jakarta Selatan',
      telepon: '1500-164 / (021) 3865001',
      jam: '08.00 - 16.00 WIB (Senin - Jumat)'
    },
    {
      wilayah: 'Suku Dinas Pendidikan Wilayah I Jakarta Pusat',
      alamat: 'Kompleks Kantor Walikota Jakarta Pusat Blok C Lt. 4, Jl. Tanah Abang I No. 1, Petojo Selatan, Gambir',
      telepon: '(021) 3865881',
      jam: '08.00 - 16.00 WIB (Senin - Jumat)'
    },
    {
      wilayah: 'Suku Dinas Pendidikan Wilayah II Jakarta Pusat',
      alamat: 'Kompleks Kantor Walikota Jakarta Pusat Blok C Lt. 5, Jl. Tanah Abang I No. 1, Petojo Selatan, Gambir',
      telepon: '(021) 3865882',
      jam: '08.00 - 16.00 WIB (Senin - Jumat)'
    },
    {
      wilayah: 'Suku Dinas Pendidikan Wilayah I Jakarta Selatan',
      alamat: 'Kompleks Kantor Walikota Jakarta Selatan Blok A Lt. 11, Jl. Prapanca Raya No. 9, Kebayoran Baru',
      telepon: '(021) 72788501',
      jam: '08.00 - 16.00 WIB (Senin - Jumat)'
    },
    {
      wilayah: 'Suku Dinas Pendidikan Wilayah II Jakarta Selatan',
      alamat: 'Kompleks Kantor Walikota Jakarta Selatan Blok A Lt. 12, Jl. Prapanca Raya No. 9, Kebayoran Baru',
      telepon: '(021) 72788502',
      jam: '08.00 - 16.00 WIB (Senin - Jumat)'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `TIKET-DISDIK-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(id);
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <Headphones className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Layanan Pengaduan & Informasi
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Posko Layanan & Kontak Resmi PPDB
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
          Pusat bantuan tatap muka dan hotline resmi Dinas Pendidikan Provinsi DKI Jakarta untuk kendala verifikasi NIK Dukcapil, mutasi tugas orang tua, dan bantuan teknis.
        </p>
      </div>

      {/* Grid Kontak Utama & Formulir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
        
        {/* Kolom Kiri: Layanan Cepat Disdik */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-lg">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Helpdesk Aktif
              </div>
              <h3 className="font-black text-lg text-white">Sekretariat PPDB DKI Jakarta</h3>
              <p className="text-xs text-slate-300 mt-1">Dinas Pendidikan Provinsi DKI Jakarta</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Alamat Posko Induk:</p>
                  <p className="font-bold text-slate-100 mt-0.5 leading-relaxed">
                    Gedung Dinas Pendidikan Provinsi DKI Jakarta, Jl. Gatot Subroto Kav. 40-41, Kuningan Barat, Jakarta Selatan 12710
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Call Center Resmi:</p>
                  <p className="font-mono font-black text-base text-white mt-0.5">1500-164</p>
                  <p className="text-[11px] text-slate-400">Telepon Khusus: (021) 3865001 / (021) 5255382</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Email Korespondensi:</p>
                  <p className="font-mono font-bold text-white mt-0.5">ppdb.disdik@jakarta.go.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase">Jam Pelayanan Tatap Muka:</p>
                  <p className="font-bold text-slate-100 mt-0.5">Senin – Jumat: 08.00 – 16.00 WIB</p>
                  <p className="text-[10px] text-slate-400">Sabtu, Minggu & Hari Libur Nasional: Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Formulir Tiket Pengaduan / Pertanyaan */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          {submitted ? (
            <div className="text-center py-10 space-y-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl text-slate-900">Pesan Pengaduan Berhasil Diterima</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Pertanyaan Anda telah dicatat oleh sistem helpdesk Disdik DKI. Petugas akan menghubungi Anda melalui email dalam waktu maksimal 1x24 jam kerja.
              </p>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Nomor Tiket Aduan:</span>
                <span className="font-mono font-black text-base text-[#1E3A8A] block mt-0.5">{ticketId}</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Simpan nomor tiket ini untuk bukti korespondensi posko.</span>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1E3A8A] text-white hover:bg-blue-800 transition"
              >
                Kirim Pertanyaan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-black text-lg text-slate-900">Formulir Bantuan & Konsultasi Online</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isi data di bawah ini jika mengalami kesulitan teknis verifikasi berkas atau pertanyaan seputar kuota.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap Orang Tua / Siswa</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#2563EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    required
                    maxLength="16"
                    placeholder="16 digit NIK pendaftar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Email Aktif</label>
                  <input
                    type="email"
                    required
                    placeholder="email@anda.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#2563EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Permasalahan</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#2563EB] outline-none bg-white">
                  <option value="nik_tidak_ditemukan">NIK / Data Dukcapil Belum Sinkron</option>
                  <option value="zonasi_jarak">Titik Koordinat Domisili Tidak Sesuai Peta</option>
                  <option value="rapor_dapodik">Nilai Rapor Berbeda dengan Dapodik SMP</option>
                  <option value="mutasi_ortu">SK Pindah Tugas Orang Tua / Mutasi Luar Daerah</option>
                  <option value="afirmasi_kjp">Kendala Status Afirmasi / KJP Plus / PIP</option>
                  <option value="lainnya">Pertanyaan Umum Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rincian Pertanyaan / Kendala</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Uraikan kendala pendaftaran Anda dengan jelas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#2563EB] outline-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Tiket Konsultasi</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Daftar Posko Pelayanan Wilayah DKI Jakarta */}
      <section className="mb-14">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Lokasi Posko Pelayanan Tatap Muka Wilayah
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Masyarakat dapat mendatangi posko Suku Dinas Pendidikan setempat pada jam kerja resmi dengan membawa KTP dan KK asli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSKO_WILAYAH.map((posko, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm leading-snug">{posko.wilayah}</h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold inline-block mt-1">
                    Posko Resmi Aktif
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <p className="text-slate-600 text-[11px] leading-relaxed flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{posko.alamat}</span>
                </p>
                <p className="text-slate-600 text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-mono font-bold text-slate-800">{posko.telepon}</span>
                </p>
                <p className="text-slate-600 text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>{posko.jam}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
