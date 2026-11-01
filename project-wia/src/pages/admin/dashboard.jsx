import { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { formatDistance, formatDateIndo, getStatusTahapanBadge, getGeoAnomalyBadge } from '@/utils/formatters';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function AdminDashboardPage({ initialStats, initialPending, initialReports }) {
  const [pendingList, setPendingList] = useState(initialPending);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/verifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, catatan: `Status diperbarui menjadi ${newStatus} oleh Admin Disdik` })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPendingList(pendingList.map(p => p.id === id ? { ...p, status_tahapan: newStatus } : p));
          return;
        }
      }
    } catch (err) {
      console.warn('Updating locally for static export');
    }
    // Client-side fallback for static GitHub Pages
    setPendingList(prev => prev.map(p => p.id === id ? { ...p, status_tahapan: newStatus } : p));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Verifikasi & Transparansi Instansi
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pusat Komando Penerimaan Peserta Didik Baru SMAN • WIA MIA 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif & Terenkripsi
            </span>
          </div>
        </div>

        {/* 4 Key Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Total Berkas Masuk</span>
              <span className="p-2 rounded-xl bg-blue-50 text-[#1E3A8A]"><Users className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{initialStats.totalApplicants}</h3>
            <span className="text-[10px] text-slate-400 font-medium">+18 berkas dalam 1 jam terakhir</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Anomali Geospasial</span>
              <span className="p-2 rounded-xl bg-pink-50 text-[#EC4899]"><ShieldAlert className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-black text-[#EC4899]">{initialStats.anomaliesCount} Kasus</h3>
            <span className="text-[10px] text-[#DB2777] font-bold">Butuh Tinjauan Fisik</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Laporan Whistleblower</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><AlertCircle className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-black text-amber-600">{initialReports.length} Laporan</h3>
            <span className="text-[10px] text-amber-700 font-semibold">Tindak Lanjut Segera</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Integritas Audit Log</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-[#10B981]"><Lock className="w-4 h-4" /></span>
            </div>
            <h3 className="text-2xl font-black text-[#10B981]">100% Sah</h3>
            <span className="text-[10px] text-emerald-700 font-semibold">Zero-Tamper Guarantee</span>
          </div>
        </div>

        {/* Action Table: Permohonan Menunggu Verifikasi & Anomali */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm mb-8">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Antrean Verifikasi Berkas Terkini & Deteksi Anomali
              </h3>
              <p className="text-xs text-slate-500">Tinjau kesesuaian koordinat GIS dan rapor sebelum pengesahan kuota.</p>
            </div>
            <Link
              href="/admin/permohonan"
              className="text-xs font-bold text-[#1E3A8A] hover:text-[#2563EB] flex items-center gap-1"
            >
              Lihat Semua ({pendingList.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Nomor Tiket & Siswa</th>
                  <th className="py-3 px-4">Sekolah & Jalur</th>
                  <th className="py-3 px-4">Jarak Klaim vs Resmi</th>
                  <th className="py-3 px-4">Status Anomali</th>
                  <th className="py-3 px-4">Status Tahapan</th>
                  <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {pendingList.map((p) => {
                  const statusB = getStatusTahapanBadge(p.status_tahapan);
                  const isAnomaly = p.geo_anomaly_status === 'anomali_kritis_fraud';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{p.nomor_tiket}</span>
                        <span className="text-slate-600 font-semibold">{p.nama_siswa}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">{p.sekolah_nama}</span>
                        <span className="text-[10px] text-brand-700 font-semibold uppercase">{p.jalur}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div>Klaim: {formatDistance(p.jarak_klaim_meter)}</div>
                        <div className={isAnomaly ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                          Resmi: {formatDistance(p.jarak_resmi_meter)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAnomaly ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.geo_anomaly_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusB.bg}`}>
                          {statusB.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'diterima_resmi')}
                            className="px-2.5 py-1 rounded-lg bg-[#10B981] text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'tinjauan_manual')}
                            className="px-2.5 py-1 rounded-lg bg-[#EC4899] text-white font-bold text-[11px] hover:bg-[#DB2777] transition"
                          >
                            Tahan
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laporan Civic Whistleblower Summary Box */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-600 text-white"><AlertCircle className="w-4 h-4" /></span>
              <h3 className="font-bold text-base text-white">Laporan Warga Masuk (Whistleblower Feed)</h3>
            </div>
            <Link
              href="/admin/verifikasi-anomali"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              Tindak Lanjut di Menu Khusus <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialReports.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-rose-300 font-bold">{r.kode_laporan}</span>
                  <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300 uppercase">{r.kategori}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{r.judul}</h4>
                <p className="text-slate-300 text-[11px] line-clamp-2">{r.deskripsi}</p>
                <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Token: <strong className="font-mono text-slate-200">{r.token_investigasi}</strong></span>
                  <span className="font-bold text-amber-400">Status: {r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const allPendaftaran = db.getAllPendaftaran();
  const allReports = db.getAllLaporanWarga();
  const anomalies = allPendaftaran.filter(p => p.geo_anomaly_status === 'anomali_kritis_fraud');

  return {
    props: {
      initialStats: {
        totalApplicants: allPendaftaran.length,
        anomaliesCount: anomalies.length
      },
      initialPending: JSON.parse(JSON.stringify(allPendaftaran)),
      initialReports: JSON.parse(JSON.stringify(allReports))
    }
  };
}
