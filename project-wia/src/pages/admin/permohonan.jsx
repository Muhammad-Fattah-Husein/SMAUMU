import { useState, useMemo } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { formatDistance, formatDateIndo } from '@/utils/formatters';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { FioriObjectPageSheet } from '@/components/fiori/FioriObjectPageSheet';
import { 
  FileCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Layers, 
  School, 
  Eye, 
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react';

export default function AdminPermohonanPage({ initialList, initialSchools }) {
  const [list, setList] = useState(initialList);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');

  // State untuk SAP Fiori Object Page Sheet Drawer
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter Data Multi-Kriteria (Metronic Toolbar Standard)
  const filtered = useMemo(() => {
    return list.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch = 
        !q || 
        (p.nomor_tiket || '').toLowerCase().includes(q) || 
        (p.nama_siswa || '').toLowerCase().includes(q) || 
        (p.nik || '').includes(q) ||
        (p.sekolah_nama || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || p.status_tahapan === statusFilter;
      const matchSchool = schoolFilter === 'all' || p.sekolah_id === parseInt(schoolFilter);
      const matchTrack = trackFilter === 'all' || p.jalur === trackFilter;

      return matchSearch && matchStatus && matchSchool && matchTrack;
    });
  }, [list, search, statusFilter, schoolFilter, trackFilter]);

  // Statistik Cepat KPI
  const stats = useMemo(() => {
    const total = list.length;
    const lolos = list.filter(p => p.status_tahapan === 'lolos_seleksi' || p.status_tahapan === 'diterima_resmi').length;
    const pending = list.filter(p => p.status_tahapan === 'diajukan' || p.status_tahapan === 'verifikasi_berkas' || p.status_tahapan === 'verifikasi_gis').length;
    const review = list.filter(p => p.status_tahapan === 'tinjauan_manual').length;
    const rejected = list.filter(p => p.status_tahapan === 'ditolak').length;
    return { total, lolos, pending, review, rejected };
  }, [list]);

  // Handler Buka Lembar Inspeksi Fiori
  const handleOpenFioriSheet = (applicant) => {
    setSelectedApplicant(applicant);
    setIsSheetOpen(true);
  };

  // Handler Pembaruan Status Verifikasi
  const handleUpdate = async (id, newStatus, customNote = null) => {
    const defaultNote = `Status diubah menjadi ${newStatus} oleh Tim Verifikator Disdik.`;
    const note = customNote || defaultNote;

    try {
      const res = await fetch('/api/verifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, catatan: note })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setList(prev => prev.map(item => item.id === id ? { ...item, status_tahapan: newStatus } : item));
          if (selectedApplicant && selectedApplicant.id === id) {
            setSelectedApplicant(prev => ({ ...prev, status_tahapan: newStatus }));
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Updating locally for static export fallback');
    }

    // Local Fallback (Static Export Mode)
    setList(prev => prev.map(item => item.id === id ? { ...item, status_tahapan: newStatus } : item));
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant(prev => ({ ...prev, status_tahapan: newStatus }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'lolos_seleksi':
      case 'diterima_resmi':
        return <Badge variant="success">✓ Lolos Seleksi</Badge>;
      case 'diajukan':
      case 'verifikasi_berkas':
      case 'verifikasi_gis':
        return <Badge variant="warning">⏳ Menunggu Verifikasi</Badge>;
      case 'tinjauan_manual':
        return <Badge variant="purple">🔍 Tinjauan Lapangan</Badge>;
      case 'ditolak':
        return <Badge variant="destructive">✕ Berkas Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Header Halaman GovTech */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-[#1E3A8A] text-white">
                <FileCheck className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                SAP Fiori Worklist • Verifikasi Berkas Terpadu
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Kelola Seluruh Berkas Pendaftaran Siswa SMAN
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik baris calon siswa untuk membuka <strong>SAP Fiori Object Page Sheet</strong> guna memeriksa kecocokan data KK, jarak Haversine, dan rantai audit kriptografis.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <span className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              Total Berkas: <strong className="text-slate-900 font-mono">{stats.total}</strong>
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. METRONIC KPI SUMMARY CHIPS */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Menunggu Antrean</span>
              <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">{stats.pending}</span>
              <span className="text-[10px] text-amber-600 font-medium">Perlu Validasi</span>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Lolos Seleksi</span>
              <span className="text-xl font-black text-emerald-700 font-mono mt-0.5 block">{stats.lolos}</span>
              <span className="text-[10px] text-emerald-600 font-medium">Alokasi Kursi Sah</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Tinjauan Lapangan</span>
              <span className="text-xl font-black text-purple-700 font-mono mt-0.5 block">{stats.review}</span>
              <span className="text-[10px] text-purple-600 font-medium">Faktual Domisili</span>
            </div>
            <Eye className="w-5 h-5 text-purple-500" />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Berkas Ditolak</span>
              <span className="text-xl font-black text-rose-700 font-mono mt-0.5 block">{stats.rejected}</span>
              <span className="text-[10px] text-rose-600 font-medium">Syarat Tidak Terpenuhi</span>
            </div>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. METRONIC ADVANCED FILTER TOOLBAR */}
        {/* ============================================================== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            {/* Input Pencarian */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama siswa, NIK, nomor tiket, atau SMP asal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-slate-800 font-medium"
              />
            </div>

            {/* Filter Dropdown Sekolah */}
            <div className="flex items-center gap-2">
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="all">Semua SMAN</option>
                {INITIAL_SEKOLAH.map((s) => (
                  <option key={s.id} value={s.id}>{s.nama_sekolah}</option>
                ))}
              </select>

              {/* Filter Dropdown Jalur */}
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="all">Semua Jalur</option>
                <option value="zonasi">Zonasi (50%)</option>
                <option value="afirmasi">Afirmasi KJP (20%)</option>
                <option value="prestasi_akademik">Prestasi Nilai (20%)</option>
                <option value="perpindahan_tugas">Pindah Tugas (5%)</option>
              </select>
            </div>
          </div>

          {/* Sub-Tabs Status Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: `Semua (${stats.total})` },
                { id: 'diajukan', label: `Antrean Baru (${stats.pending})` },
                { id: 'lolos_seleksi', label: `Lolos Seleksi (${stats.lolos})` },
                { id: 'tinjauan_manual', label: `Tinjauan Lapangan (${stats.review})` },
                { id: 'ditolak', label: `Ditolak (${stats.rejected})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              Ditemukan <strong>{filtered.length}</strong> dari {list.length} permohonan
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. SHADCN / METRONIC HIGH-DENSITY WORKLIST TABLE */}
        {/* ============================================================== */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Tiket</TableHead>
              <TableHead>Siswa & NIK</TableHead>
              <TableHead>SMAN Pilihan & Jalur</TableHead>
              <TableHead>Jarak Haversine</TableHead>
              <TableHead>Nilai Rapor</TableHead>
              <TableHead>Status Verifikasi</TableHead>
              <TableHead className="text-right">Aksi Pemeriksaan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleOpenFioriSheet(item)}
                  className="cursor-pointer hover:bg-blue-50/40 transition group"
                >
                  <TableCell className="font-mono font-bold text-slate-900 whitespace-nowrap">
                    <span className="group-hover:text-[#2563EB] transition">
                      {item.nomor_tiket}
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <p className="font-bold text-slate-900 group-hover:text-[#1E3A8A] transition">{item.nama_siswa}</p>
                    <p className="text-[10px] text-slate-400 font-mono">NIK: {item.nik}</p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <p className="font-semibold text-slate-800">{item.sekolah_nama}</p>
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {item.jalur?.replace('_', ' ')}
                    </span>
                  </TableCell>

                  <TableCell className="font-mono whitespace-nowrap">
                    <span className="font-bold text-slate-800">
                      {formatDistance(item.klaim_jarak_meter || item.jarak_klaim_meter || 1200)}
                    </span>
                  </TableCell>

                  <TableCell className="font-mono font-bold whitespace-nowrap text-emerald-700">
                    {item.klaim_nilai_rapor || 85.0}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {getStatusBadge(item.status_tahapan)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenFioriSheet(item)}
                        className="text-[11px] flex items-center gap-1 group-hover:border-blue-400 group-hover:bg-blue-50"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Fiori Sheet</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  Tidak ada permohonan yang sesuai dengan filter pencarian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ============================================================== */}
        {/* 4. SAP FIORI OBJECT PAGE SHEET DRAWER */}
        {/* ============================================================== */}
        <FioriObjectPageSheet
          applicant={selectedApplicant}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onStatusUpdate={handleUpdate}
          schoolList={INITIAL_SEKOLAH}
        />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const initialList = db.getAllPendaftaran();
  return {
    props: {
      initialList: JSON.parse(JSON.stringify(initialList)),
      initialSchools: JSON.parse(JSON.stringify(INITIAL_SEKOLAH))
    }
  };
}
