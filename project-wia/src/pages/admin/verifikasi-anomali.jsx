import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { formatDistance, formatDateIndo } from '@/utils/formatters';
import { ShieldAlert, AlertCircle, CheckCircle2, XCircle, Send, MessageSquare } from 'lucide-react';

export default function AdminVerifikasiAnomaliPage({ initialAnomalies, initialReports }) {
  const [anomalies, setAnomalies] = useState(initialAnomalies);
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState('anomali'); // 'anomali' or 'whistleblower'

  const [responseModal, setResponseModal] = useState(null);
  const [responseText, setResponseText] = useState('');

  const handleResolveReport = async (reportId, newStatus) => {
    try {
      const res = await fetch('/api/whistleblower', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus, respon_petugas: responseText || 'Telah ditindaklanjuti oleh Tim Verifikator Disdik.' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus, respon_petugas: responseText || r.respon_petugas } : r));
          setResponseModal(null);
          setResponseText('');
          return;
        }
      }
    } catch (e) {
      console.warn('Updating locally for static export');
    }
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus, respon_petugas: responseText || r.respon_petugas } : r));
    setResponseModal(null);
    setResponseText('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#EC4899] text-white"><ShieldAlert className="w-3.5 h-3.5" /></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">Audit Forensik Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Verifikasi Anomali Geospasial & Laporan Warga
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Investigasi indikasi kecurangan zonasi, numpang KK fiktif, serta penanganan aduan anonim masyarakat.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('anomali')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'anomali' ? 'bg-[#EC4899] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Anomali Geospasial ({anomalies.length} Kasus)
            </button>
            <button
              onClick={() => setActiveTab('whistleblower')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'whistleblower' ? 'bg-[#1E3A8A] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Laporan Whistleblower ({reports.length} Aduan)
            </button>
          </div>
        </div>

        {activeTab === 'anomali' && (
          <div className="space-y-4">
            {anomalies.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{item.nama_siswa}</h3>
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.nomor_tiket}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.sekolah_nama} • NIK: {item.nik}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                    ANOMALI KRITIS GEOSPASIAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Alamat Klaim (Pendaftar):</span>
                    <p className="font-medium text-slate-800 mt-0.5">{item.alamat_domisili}</p>
                    <p className="font-mono text-brand-700 font-bold mt-1">Jarak Klaim: {formatDistance(item.jarak_klaim_meter)}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 block text-[10px]">Alamat Resmi (Centroid Dukcapil):</span>
                    <p className="font-medium text-slate-800 mt-0.5">Rawamangun / Pulo Gadung, Jakarta Timur</p>
                    <p className="font-mono text-rose-600 font-bold mt-1">Jarak Sebenarnya: {formatDistance(item.jarak_resmi_meter)}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                    <span className="text-rose-800 font-bold block text-[10px]">Selisih Deviasi (Manipulasi):</span>
                    <p className="font-mono font-black text-rose-700 text-lg mt-0.5">+{formatDistance(item.selisih_jarak_meter)}</p>
                    <p className="text-[11px] text-rose-700 mt-1">Masa tinggal KK: <strong>{item.lama_tinggal_bulan} Bulan (&lt;1 thn)</strong></p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">Status Tindakan: <strong className="text-amber-600">Berkas Ditangguhkan (Tinjauan Manual)</strong></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Surat Panggilan Klarifikasi Lapangan diterbitkan untuk ${item.nama_siswa}.`)}
                      className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition"
                    >
                      Kirim Panggilan Lapangan
                    </button>
                    <button
                      onClick={() => alert(`Tiket ${item.nomor_tiket} telah dibatalkan dari Jalur Zonasi.`)}
                      className="px-4 py-2 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-xs transition"
                    >
                      Batalkan Tiket (Diskualifikasi)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'whistleblower' && (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-rose-600">{r.kode_laporan}</span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{r.judul}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Dilaporkan oleh: {r.nama_samaran} • {formatDateIndo(r.created_at)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">{r.deskripsi}</p>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-[10px]">Tindak Lanjut Instansi:</span>
                    <span>{r.respon_petugas || 'Belum ada tanggapan resmi.'}</span>
                  </div>
                  <button
                    onClick={() => { setResponseModal(r); setResponseText(r.respon_petugas || ''); }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                  >
                    Respon Aduan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Respon Petugas */}
        {responseModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
              <h3 className="font-bold text-base text-slate-900">
                Tanggapi Laporan: {responseModal.kode_laporan}
              </h3>
              <p className="text-xs text-slate-500">
                Tanggapan ini akan dapat dibaca oleh pelapor anonim menggunakan Token Investigasi mereka.
              </p>
              <textarea
                rows="4"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Tuliskan hasil investigasi lapangan atau tindak lanjut dinas..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
              ></textarea>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setResponseModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleResolveReport(responseModal.id, 'bukti_valid_terverifikasi')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Simpan & Tandai Valid
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const pendaftaran = db.getAllPendaftaran();
  const reports = db.getAllLaporanWarga();
  const anomalies = pendaftaran.filter(p => p.geo_anomaly_status === 'anomali_kritis_fraud');

  return {
    props: {
      initialAnomalies: JSON.parse(JSON.stringify(anomalies)),
      initialReports: JSON.parse(JSON.stringify(reports))
    }
  };
}
