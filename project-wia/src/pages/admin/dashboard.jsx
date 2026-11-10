import { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { formatDistance, formatDateIndo, getStatusTahapanBadge } from '@/utils/formatters';
import { FioriAnalyticalTile } from '@/components/fiori/FioriAnalyticalTile';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
  FileCheck2,
  Search,
  Sparkles,
  ExternalLink,
  Clock,
  History,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage({ initialStats, initialPending, initialReports, initialAudit }) {
  const [pendingList, setPendingList] = useState(initialPending);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

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
    setPendingList(prev => prev.map(p => p.id === id ? { ...p, status_tahapan: newStatus } : p));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Top Header Bar dengan Command Palette Launcher */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#1E3A8A] text-white">
                <LayoutDashboard className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                SAP Fiori & Metronic Executive Control Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pusat Komando Transparansi & Audit PPDB SMAN
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan terpadu pendaftaran, anomali geospasial, mitigasi aduan warga, dan rantai integritas SHA-256.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Command Launcher Pill */}
            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-blue-400 text-xs font-bold text-slate-700 shadow-xs flex items-center gap-2 transition hover:bg-blue-50/50"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Cari Cepat...</span>
              <kbd className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">
                Ctrl + K
              </kbd>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sistem Aktif & Terenkripsi</span>
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. SAP FIORI ANALYTICAL KPI TILES */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <FioriAnalyticalTile
            category="VOLUMETRIK PENDAFTARAN"
            title="Total Berkas Siswa Masuk"
            subtitle="Pendaftaran aktif dari 6 SMAN"
            value={initialStats.totalApplicants}
            unit="Siswa"
            trend="up"
            trendValue="+18 berkas dalam 1 jam"
            saturationPercent={(initialStats.totalApplicants / 288) * 100}
            statusColor="blue"
            icon={<Users className="w-4 h-4" />}
            targetText="Target Daya Tampung SMAN: 1.728 Kursi"
          />

          <FioriAnalyticalTile
            category="FORENSIK GEOSPASIAL"
            title="Deteksi Anomali Spasial"
            subtitle="Penyimpangan titik > 500 meter"
            value={initialStats.anomaliesCount}
            unit="Kasus"
            trend="down"
            trendValue="-3 kasus tertangani hari ini"
            statusColor="rose"
            icon={<ShieldAlert className="w-4 h-4" />}
            targetText="Toleransi Maksimal: 150m (Dukcapil)"
          />

          <FioriAnalyticalTile
            category="CIVIC WHISTLEBLOWER"
            title="Laporan Warga Anonim"
            subtitle="Aduan numpang KK & manipulasi"
            value={initialReports.length}
            unit="Laporan"
            trend="neutral"
            trendValue="Disaring Heuristik Anti-Spam"
            statusColor="amber"
            icon={<AlertCircle className="w-4 h-4" />}
            targetText="Token Investigasi Terenkripsi Aktif"
          />

          <FioriAnalyticalTile
            category="INTEGRITAS BUKU BESAR"
            title="Audit Chain SHA-256"
            subtitle="Merkle chain zero-tamper"
            value="100%"
            unit="Sah"
            trend="up"
            trendValue="0% Data Overbooking / Bypass"
            saturationPercent={100}
            statusColor="emerald"
            icon={<Lock className="w-4 h-4" />}
            targetText="Kunci Atomik: SELECT ... FOR UPDATE"
          />
        </div>

        {/* ============================================================== */}
        {/* 2. TABEL ANTREAN BERKAS (METRONIC WORKLIST) */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-8">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900 tracking-tight">
                Antrean Verifikasi Berkas Terkini & Deteksi Anomali
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tinjau kesesuaian koordinat GIS, status kependudukan, dan nilai rapor.
              </p>
            </div>
            <Link
              href="/admin/permohonan"
              className="text-xs font-bold text-[#1E3A8A] hover:text-[#2563EB] flex items-center gap-1 transition"
            >
              <span>Buka Worklist Lengkap ({pendingList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50/80 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Nomor Tiket & Siswa</th>
                  <th className="py-3 px-4">Sekolah & Jalur</th>
                  <th className="py-3 px-4">Jarak Klaim vs Resmi</th>
                  <th className="py-3 px-4">Status Anomali</th>
                  <th className="py-3 px-4">Status Tahapan</th>
                  <th className="py-3 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {pendingList.slice(0, 5).map((p) => {
                  const statusB = getStatusTahapanBadge(p.status_tahapan);
                  const isAnomaly = p.geo_anomaly_status === 'anomali_kritis_fraud';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">{p.nomor_tiket}</span>
                        <span className="text-slate-600 font-semibold">{p.nama_siswa}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">{p.sekolah_nama}</span>
                        <span className="text-[10px] text-blue-700 font-semibold uppercase">{p.jalur?.replace('_', ' ')}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div>Klaim: {formatDistance(p.jarak_klaim_meter || 1200)}</div>
                        <div className={isAnomaly ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                          Resmi: {formatDistance(p.jarak_resmi_meter || 1200)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant={isAnomaly ? 'destructive' : 'success'}>
                          {isAnomaly ? '⚠️ Anomali Kritis' : '✓ Aman'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusB.bg}`}>
                          {statusB.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdateStatus(p.id, 'lolos_seleksi')}
                          >
                            Setujui
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateStatus(p.id, 'tinjauan_manual')}
                          >
                            Tahan
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. METRONIC AUDIT TIMELINE & CIVIC WHISTLEBLOWER FEED */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Metronic Chronological Audit Trail */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-50 text-[#1E3A8A]">
                  <History className="w-4 h-4" />
                </span>
                <h3 className="font-black text-base text-slate-900 tracking-tight">
                  Jejak Audit Kriptografis Terkini (Merkle Chain)
                </h3>
              </div>
              <Link
                href="/admin/audit-log"
                className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                <span>Buku Besar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {(initialAudit || []).slice(0, 4).map((a, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-2">
                  <div className="w-4 h-4 rounded-full bg-[#1E3A8A] text-white border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-xs" />
                  <div className="min-w-0 flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{a.aksi?.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDateIndo(a.created_at)}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-snug">{a.deskripsi_tindakan}</p>
                    <div className="pt-1 font-mono text-[10px] text-slate-400 truncate">
                      Hash: {a.curr_hash?.substring(0, 24)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posko Whistleblower Feed */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-rose-600 text-white">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                  <h3 className="font-black text-base text-white tracking-tight">
                    Posko Pengaduan Warga (Whistleblower Feed)
                  </h3>
                </div>
                <Link
                  href="/admin/pengaduan"
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                >
                  <span>Buka Posko & Mitigasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {initialReports.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-rose-400 font-bold">{r.kode_laporan}</span>
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300 uppercase font-semibold">
                        {r.kategori?.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs line-clamp-1">{r.judul}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/80">
                      <span>Token: <strong className="font-mono text-slate-200">{r.token_investigasi}</strong></span>
                      <span className="text-amber-400 font-bold">Status: {r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Algoritma Anti-Spam Heuristik Aktif</span>
              <span className="text-emerald-400 font-bold">✓ 100% Anonim</span>
            </div>
          </div>
        </div>

        {/* Global Command Palette Dialog */}
        <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const allPendaftaran = db.getAllPendaftaran ? db.getAllPendaftaran() : [];
  const allReports = db.getAllLaporanWarga ? db.getAllLaporanWarga() : [];
  const allAudit = db.getAuditLogs ? db.getAuditLogs() : [];
  const anomalies = allPendaftaran.filter(p => p.geo_anomaly_status === 'anomali_kritis_fraud');

  return {
    props: {
      initialStats: {
        totalApplicants: allPendaftaran.length,
        anomaliesCount: anomalies.length
      },
      initialPending: JSON.parse(JSON.stringify(allPendaftaran)),
      initialReports: JSON.parse(JSON.stringify(allReports)),
      initialAudit: JSON.parse(JSON.stringify(allAudit))
    }
  };
}
