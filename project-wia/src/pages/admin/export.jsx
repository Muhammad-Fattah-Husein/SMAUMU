import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function AdminExportPage({ kuotaList, pendaftaranList, auditLogs }) {
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const triggerDownload = (filename, content, mime = 'text/csv') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloadSuccess(`File "${filename}" berhasil diunduh.`);
    setTimeout(() => setDownloadSuccess(''), 4000);
  };

  const exportKuotaCSV = () => {
    let csv = "ID,Sekolah,Jalur,Total Kuota,Kuota Terisi,Pendaftar Total,Burn Rate Per Jam\n";
    kuotaList.forEach(k => {
      csv += `${k.id},"${k.sekolah_nama}","${k.jalur}",${k.total_kuota},${k.kuota_terisi},${k.pendaftar_total},${k.burn_rate_per_jam}\n`;
    });
    triggerDownload(`SMAUMU_Rekap_Kuota_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const exportPendaftaranCSV = () => {
    let csv = "Nomor Tiket,Nama Siswa,NIK,Sekolah Pilihan,Jalur,Jarak Klaim (m),Jarak Resmi (m),Status Anomali,Status Tahapan\n";
    pendaftaranList.forEach(p => {
      csv += `"${p.nomor_tiket}","${p.nama_siswa}","${p.nik}","${p.sekolah_nama}","${p.jalur}",${p.jarak_klaim_meter},${p.jarak_resmi_meter},"${p.geo_anomaly_status}","${p.status_tahapan}"\n`;
    });
    triggerDownload(`SMAUMU_Daftar_Pendaftar_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const exportAuditJSON = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    triggerDownload(`SMAUMU_Immutable_Audit_Chain_${new Date().toISOString().slice(0, 10)}.json`, jsonStr, 'application/json');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Export Data Laporan & Rekapitulasi Terbuka
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unduh berkas rekapitulasi PPDB SMAN untuk arsip pengawasan internal, DPRD, dan Ombudsman Publik.
          </p>
        </div>

        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Rekapitulasi Kuota & Burn-Rate</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Format CSV berisikan data kuota daya tampung, jumlah kursi terisi, dan laju pengisian per jam per SMAN.
              </p>
            </div>
            <button
              onClick={exportKuotaCSV}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Kuota SMAN</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Daftar Pemohon & Validasi GIS</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Format CSV memuat nomor tiket, NIK, nama siswa, jarak ukur resmi, status Dual-Truth, dan putusan verifikasi.
              </p>
            </div>
            <button
              onClick={exportPendaftaranCSV}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Pendaftar</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold mb-3">
                <Download className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Buku Besar Audit Log Kriptografi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Format JSON lengkap mencakup timestamp, previous hash, current SHA-256 hash, dan rincian mutasi berkas.
              </p>
            </div>
            <button
              onClick={exportAuditJSON}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Audit Chain (JSON)</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const kuota = db.getAllKuotaWithMetrics();
  const pendaftaran = db.getAllPendaftaran();
  const auditLogs = db.getAuditLogs();

  return {
    props: {
      kuotaList: JSON.parse(JSON.stringify(kuota)),
      pendaftaranList: JSON.parse(JSON.stringify(pendaftaran)),
      auditLogs: JSON.parse(JSON.stringify(auditLogs))
    }
  };
}
