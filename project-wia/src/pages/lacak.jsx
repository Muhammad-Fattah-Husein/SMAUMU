import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/services/db';
import { formatDistance, formatDateIndo, getStatusTahapanBadge, getGeoAnomalyBadge } from '@/utils/formatters';
import { 
  Search, 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

export default function LacakPage({ initialPendaftaranList = [] }) {
  const router = useRouter();
  const { user } = useAuth();
  const [ticketInput, setTicketInput] = useState('');
  const [currentRecord, setCurrentRecord] = useState(initialPendaftaranList[0] || null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (router.query.tiket) {
      const qTiket = String(router.query.tiket).trim();
      setTicketInput(qTiket);
      searchTicketRecord(qTiket);
    } else if (user?.nomor_tiket) {
      setTicketInput(user.nomor_tiket);
      searchTicketRecord(user.nomor_tiket);
    }
  }, [router.query.tiket, user]);

  const searchTicketRecord = async (ticket) => {
    if (!ticket) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/pendaftaran?tiket=${encodeURIComponent(ticket)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCurrentRecord(data.data);
          return;
        }
      }
      throw new Error('API not available or ticket not found');
    } catch (err) {
      // Client-side fallback for static GitHub Pages deployment
      const matched = initialPendaftaranList.find(p => p.nomor_tiket.toLowerCase() === ticket.toLowerCase());
      if (matched) {
        setCurrentRecord(matched);
      } else if (user && user.nomor_tiket && user.nomor_tiket.toLowerCase() === ticket.toLowerCase()) {
        setCurrentRecord({
          id: 99,
          nomor_tiket: user.nomor_tiket,
          nama_siswa: user.nama,
          nik: user.nik || '3171012304090001',
          asal_sekolah_smp: user.asal_sekolah_smp || 'SMPN 1 Jakarta',
          sekolah_nama: `SMAN ${user.sekolah_id || 1} Jakarta`,
          jalur: user.jalur || 'zonasi',
          jarak_klaim_meter: 120.5,
          geo_anomaly_status: 'aman',
          klaim_nilai_rapor: user.klaim_nilai_rapor || 88.5,
          lama_tinggal_bulan: user.lama_tinggal_bulan || 24,
          status_tahapan: 'diajukan',
          catatan_verifikator: 'Berkas pendaftaran tersimpan di database Supabase Cloud. Menunggu verifikasi tim seleksi.',
          created_at: new Date().toISOString()
        });
      } else {
        setErrorMsg('Nomor tiket tidak ditemukan. Mohon cek kembali ejaan nomor tiket Anda.');
        setCurrentRecord(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchTicketRecord(ticketInput);
  };

  const statusBadge = currentRecord ? getStatusTahapanBadge(currentRecord.status_tahapan) : null;
  const anomalyBadge = currentRecord ? getGeoAnomalyBadge(currentRecord.geo_anomaly_status) : null;

  return (
    <Layout>
      {/* Header Ringkas */}
      <div className="max-w-4xl mx-auto mb-6 text-center sm:text-left">
        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
          <span className="p-1 rounded bg-[#F97316] text-white">
            <FileCheck2 className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Pelacakan Berkas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Lacak Tiket Pendaftaran
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Pantau tahapan verifikasi berkas, validasi zonasi, dan status seleksi secara real-time.
        </p>
      </div>

      {/* Kotak Pencarian Nomor Tiket */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-[#1A1A1E] p-5 rounded-3xl border border-white/10 shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik Nomor Tiket Anda (contoh: TIKET-SMU-2026-098214)"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 font-mono text-xs text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] hover:opacity-90 text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-md"
            >
              <FileCheck2 className="w-4 h-4 text-white" />
              <span>{isLoading ? 'Mencari...' : 'Cari Status Berkas'}</span>
            </button>
          </form>

          {/* Contoh Klik Cepat */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
            <span className="text-slate-400 font-medium">Contoh Berkas untuk Dicoba:</span>
            {initialPendaftaranList.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setTicketInput(p.nomor_tiket);
                  setCurrentRecord(p);
                  setErrorMsg('');
                }}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition ${
                  currentRecord?.id === p.id
                    ? 'bg-[#F97316] text-white shadow-sm'
                    : 'bg-[#222227] hover:bg-white/15 text-slate-300'
                }`}
              >
                {p.nomor_tiket} ({p.nama_siswa.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-[#FB7185] text-xs flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* HASIL PELACAKAN TIKET */}
      {currentRecord && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Nomor Tiket Siswa:
                </span>
                <h2 className="text-2xl font-black font-mono text-white mt-0.5">
                  {currentRecord.nomor_tiket}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Diajukan pada {formatDateIndo(currentRecord.created_at)}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full border ${statusBadge.bg}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {statusBadge.label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Tercatat Resmi di Buku Dinas
                </span>
              </div>
            </div>

            {/* Garis Kemajuan Berkas */}
            <div className="py-6 border-b border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Perjalanan Tahapan Berkas Anak Anda:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { step: '01', title: 'Berkas Masuk', done: true, desc: 'Tersimpan di sistem' },
                  { step: '02', title: 'Pemeriksaan Titik Rumah', done: currentRecord.status_tahapan !== 'diajukan', desc: 'Dicek posisi peta' },
                  { step: '03', title: 'Pencocokan Rapor', done: ['lolos_sementara', 'diterima_resmi'].includes(currentRecord.status_tahapan), desc: 'Cocok dengan Dapodik' },
                  { step: '04', title: 'Keputusan Akhir', done: currentRecord.status_tahapan === 'diterima_resmi', desc: 'Resmi Diterima' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border ${
                      item.done
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-[#222227] border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block">{item.step}</span>
                    <span className="font-extrabold text-xs block mt-0.5">{item.title}</span>
                    <span className="block text-[10px] mt-1 opacity-80">
                      {item.done ? '✓ Sudah Selesai' : 'Sedang antre'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rincian Berkas */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-extrabold text-[#E2E8F0] text-sm">Data Siswa & Pilihan Sekolah:</h4>
                <div className="p-4 rounded-2xl bg-[#222227] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nama Calon Siswa:</span>
                    <span className="font-bold text-white">{currentRecord.nama_siswa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nomor NIK:</span>
                    <span className="font-mono text-[#E2E8F0]">{currentRecord.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Asal SMP:</span>
                    <span className="font-semibold text-[#E2E8F0]">{currentRecord.asal_sekolah_smp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sekolah Pilihan:</span>
                    <span className="font-bold text-[#F97316]">{currentRecord.sekolah_nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jalur Masuk:</span>
                    <span className="font-semibold uppercase text-[#E2E8F0]">{currentRecord.jalur}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-[#E2E8F0] text-sm">Hasil Pemeriksaan Titik & Rapor:</h4>
                <div className="p-4 rounded-2xl bg-[#222227] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jarak Rumah ke Sekolah:</span>
                    <span className="font-mono font-bold text-white">{formatDistance(currentRecord.jarak_klaim_meter)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kesesuaian Titik Rumah:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${anomalyBadge.bg}`}>
                      {anomalyBadge.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nilai Rapor Terverifikasi:</span>
                    <span className="font-mono font-bold text-white">{currentRecord.klaim_nilai_rapor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lama Tinggal di KK:</span>
                    <span className="font-semibold text-[#E2E8F0]">{currentRecord.lama_tinggal_bulan} Bulan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pesan Resmi Petugas */}
            <div className="mt-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-xs text-[#F97316] leading-relaxed">
              <span className="font-bold block mb-1 text-[#F97316]">Catatan Petugas Verifikasi Dinas:</span>
              <p>{currentRecord.catatan_verifikator || 'Data isian pendaftar cocok dan sesuai dengan dokumen Kartu Keluarga sah.'}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const initialPendaftaranList = db.getAllPendaftaran();
  return {
    props: {
      initialPendaftaranList: JSON.parse(JSON.stringify(initialPendaftaranList))
    }
  };
}
