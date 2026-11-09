import { useState } from 'react';
import Layout from '@/components/Layout';
import { db } from '@/services/db';
import { generateWhistleToken } from '@/utils/crypto';
import { formatDateIndo } from '@/utils/formatters';
import { 
  AlertCircle, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  EyeOff, 
  Upload 
} from 'lucide-react';

export default function WhistleblowerPage({ initialReports }) {
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState('laporkan'); // 'laporkan' or 'pantau'
  const [tokenInput, setTokenInput] = useState('');
  const [trackedReport, setTrackedReport] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    kategori: 'manipulasi_koordinat',
    tiket_terkait: '',
    judul: '',
    deskripsi: '',
    nama_samaran: 'Warga Peduli Kejujuran 2026',
    is_anonim: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/whistleblower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmissionSuccess(data);
          const refreshRes = await fetch('/api/whistleblower');
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.success) setReports(refreshData.data);
          }
          return;
        }
      }
      throw new Error('Fallback static submission');
    } catch (err) {
      // Local fallback for static GitHub Pages export
      const token = `TOKEN-WBL-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      const newReport = {
        id: reports.length + 1,
        kode_laporan: `WBL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        kategori: formData.kategori,
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        nama_samaran: formData.nama_samaran || 'Warga Peduli Kejujuran 2026',
        token_investigasi: token,
        status: 'diterima_menunggu_telaah',
        respon_petugas: 'Laporan Anda telah berhasil masuk ke antrean verifikasi tim pengawas dinas.',
        created_at: new Date().toISOString()
      };
      setReports(prev => [newReport, ...prev]);
      setSubmissionSuccess({
        message: 'Laporan berhasil dicatat',
        token_investigasi: token,
        data: newReport
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!tokenInput) return;
    setTrackError('');
    try {
      const res = await fetch(`/api/whistleblower?token=${encodeURIComponent(tokenInput)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setTrackedReport(data.data);
          return;
        }
      }
      throw new Error('API not available, fallback to client');
    } catch (err) {
      const matched = reports.find(r => r.token_investigasi.toLowerCase() === tokenInput.trim().toLowerCase());
      if (matched) {
        setTrackedReport(matched);
      } else {
        setTrackError('Token laporan tidak ditemukan. Mohon periksa kembali ejaan token rahasia Anda.');
        setTrackedReport(null);
      }
    }
  };

  return (
    <Layout>
      {/* Header Ringkas */}
      <div className="max-w-4xl mx-auto mb-6 text-center sm:text-left">
        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
          <span className="p-1 rounded bg-[#EC4899] text-white">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
            Whistleblower Anonim
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lapor Kecurangan & Anomali PPDB
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
          Pengaduan warga 100% rahasia tanpa pencatatan IP. Pantau progres audit dinas via token.
        </p>

        {/* Tab Pilihan */}
        <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
          <button
            onClick={() => setActiveTab('laporkan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'laporkan'
                ? 'bg-[#EC4899] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Form Pengaduan
          </button>
          <button
            onClick={() => setActiveTab('pantau')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'pantau'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pantau Token Laporan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {activeTab === 'laporkan' && (
          <div>
            {submissionSuccess ? (
              <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Laporan Anda Sudah Masuk ke Tim Pengawas Dinas!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Identitas Anda dirahasiakan 100%. Simpan Token Rahasia berikut untuk mengecek apa tindakan yang sudah diambil oleh petugas:
                </p>
                <div className="p-4 rounded-2xl bg-[#0F172A] text-white max-w-md mx-auto">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Token Rahasia Anda:</span>
                  <span className="text-xl font-mono font-black text-pink-400 tracking-wider">
                    {submissionSuccess.token_investigasi}
                  </span>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setTokenInput(submissionSuccess.token_investigasi);
                      setActiveTab('pantau');
                      setSubmissionSuccess(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#2563EB] transition"
                  >
                    Buka Pemantauan Laporan
                  </button>
                  <button
                    onClick={() => setSubmissionSuccess(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Kirim Laporan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                <div className="p-4 rounded-2xl bg-[#0F172A] text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EC4899] text-white shrink-0">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Jaminan 100% Rahasia untuk Warga</h4>
                    <p className="text-[11px] text-slate-300">
                      Sistem kami tidak mencatat nama asli, nomor HP, maupun alamat internet (IP) Anda. Anda dilindungi undang-undang pelapor kecurangan publik.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Apa Dugaan Kecurangan yang Terjadi?
                    </label>
                    <select
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#EC4899]"
                    >
                      <option value="manipulasi_koordinat">Memajukan Titik Rumah di Peta agar Dekat Sekolah</option>
                      <option value="numpang_kk">Numpang Kartu Keluarga (KK Baru &lt; 1 Tahun)</option>
                      <option value="sertifikat_palsu">Piagam Lomba / Sertifikat Juara Palsu</option>
                      <option value="pungli_kursi">Dugaan Jual-Beli Bangku / Jalur Belakang</option>
                      <option value="anomali_jarak_tidak_masuk_akal">Jarak Rumah Tidak Masuk Akal / Fiktif</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Sekolah yang Dilaporkan / Nomor Tiket (Jika Tahu):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: SMAN 8 Jakarta atau TIKET-SMU-2026-098215"
                      value={formData.tiket_terkait}
                      onChange={(e) => setFormData({ ...formData, tiket_terkait: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#EC4899]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Judul Pengaduan:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ada siswa beralamat di Rawamangun tapi titik petanya dibuat di Tebet"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#EC4899]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ceritakan Fakta yang Anda Ketahui:
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Jelaskan alamat rumah yang sebenarnya, nama anak, atau bukti yang Anda miliki..."
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-[#EC4899]"
                  ></textarea>
                </div>

                <div className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>Lampirkan Foto Rumah / Tangkapan Layar / Dokumen Pendukung (Maks 10 MB)</span>
                  </div>
                  <span className="text-[10px] text-[#1E3A8A] font-bold bg-blue-100 px-2 py-0.5 rounded">
                    Tersimpan Aman
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Laporan Pengaduan'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === 'pantau' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Masukkan Token Rahasia Anda (contoh: TOKEN-WBL-7719-XPQ)"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition"
                >
                  Cek Tindak Lanjut
                </button>
              </form>

              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Contoh Token Pengaduan:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput('TOKEN-WBL-7719-XPQ');
                    const matched = reports.find(r => r.token_investigasi === 'TOKEN-WBL-7719-XPQ');
                    if (matched) setTrackedReport(matched);
                  }}
                  className="font-mono text-[11px] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-slate-700 font-bold"
                >
                  TOKEN-WBL-7719-XPQ (Investigasi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput('TOKEN-WBL-8820-KLP');
                    const matched = reports.find(r => r.token_investigasi === 'TOKEN-WBL-8820-KLP');
                    if (matched) setTrackedReport(matched);
                  }}
                  className="font-mono text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold"
                >
                  TOKEN-WBL-8820-KLP (Valid & Sanksi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput('TOKEN-WBL-3311-SPM');
                    const matched = reports.find(r => r.token_investigasi === 'TOKEN-WBL-3311-SPM');
                    if (matched) setTrackedReport(matched);
                  }}
                  className="font-mono text-[11px] bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg font-bold"
                >
                  TOKEN-WBL-3311-SPM (Termitigasi Spam)
                </button>
              </div>
            </div>

            {trackError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {trackError}
              </div>
            )}

            {trackedReport && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Nomor Kasus Pengaduan:</span>
                    <h3 className="font-black text-slate-900 text-base">{trackedReport.kode_laporan} - {trackedReport.judul}</h3>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                    Status: {trackedReport.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 space-y-1">
                    <span className="text-slate-500 font-bold">Laporan yang Anda Kirim:</span>
                    <p className="text-slate-800 leading-relaxed">{trackedReport.deskripsi}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900">
                    <span className="font-bold flex items-center gap-1.5 mb-1 text-blue-950">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Tanggapan Resmi Tim Pengawas Dinas Pendidikan:
                    </span>
                    <p className="text-xs leading-relaxed opacity-90">
                      {trackedReport.respon_petugas || 'Laporan Anda sudah masuk dalam antrean pemeriksaan lapangan tim dinas.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const initialReports = db.getAllLaporanWarga();
  return {
    props: {
      initialReports: JSON.parse(JSON.stringify(initialReports))
    }
  };
}
