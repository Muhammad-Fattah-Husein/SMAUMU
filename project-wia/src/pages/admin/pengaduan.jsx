import { useState, useMemo } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { calculateSpamRiskScore } from '@/services/spamFilterService';
import { formatDateIndo } from '@/utils/formatters';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldOff, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  FileText, 
  Search, 
  Send, 
  Sparkles, 
  UserCheck, 
  ExternalLink,
  MessageSquare,
  Ban,
  Lock,
  ArrowRight,
  TrendingDown,
  RotateCcw
} from 'lucide-react';

export default function AdminPengaduanPage({ initialReports, initialPendaftaran }) {
  const [reports, setReports] = useState(initialReports);
  const [pendaftaranList, setPendaftaranList] = useState(initialPendaftaran);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'prioritas', 'investigasi', 'valid', 'spam'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Respon Resmi Petugas (Sinkron ke Token Pelapor)
  const [responseModal, setResponseModal] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [targetStatus, setTargetStatus] = useState('dalam_investigasi');

  // Hitung Skor Spam untuk Setiap Laporan
  const analyzedReports = useMemo(() => {
    return reports.map((r) => {
      const spamAnalysis = calculateSpamRiskScore(r, pendaftaranList);
      return {
        ...r,
        spamAnalysis
      };
    });
  }, [reports, pendaftaranList]);

  // Statistik Ringkasan KPI
  const stats = useMemo(() => {
    const total = analyzedReports.length;
    const investigasi = analyzedReports.filter(r => r.status === 'dalam_investigasi' || r.status === 'diterima').length;
    const valid = analyzedReports.filter(r => r.status === 'bukti_valid_terverifikasi').length;
    const spam = analyzedReports.filter(r => r.status === 'termitigasi_spam' || r.spamAnalysis.isSpam).length;
    const prioritas = analyzedReports.filter(r => r.spamAnalysis.score < 35 && r.status !== 'termitigasi_spam').length;
    return { total, investigasi, valid, spam, prioritas };
  }, [analyzedReports]);

  // Filter Data
  const filteredReports = useMemo(() => {
    return analyzedReports.filter((r) => {
      // 1. Filter Tab
      if (activeFilter === 'prioritas' && (r.spamAnalysis.score >= 35 || r.status === 'termitigasi_spam')) return false;
      if (activeFilter === 'investigasi' && r.status !== 'dalam_investigasi' && r.status !== 'diterima') return false;
      if (activeFilter === 'valid' && r.status !== 'bukti_valid_terverifikasi') return false;
      if (activeFilter === 'spam' && r.status !== 'termitigasi_spam' && !r.spamAnalysis.isSpam) return false;

      // 2. Filter Kategori
      if (categoryFilter !== 'all' && r.kategori !== categoryFilter) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (r.judul || '').toLowerCase().includes(q);
        const matchToken = (r.token_investigasi || '').toLowerCase().includes(q);
        const matchCode = (r.kode_laporan || '').toLowerCase().includes(q);
        const matchTicket = (r.tiket_terkait || '').toLowerCase().includes(q);
        if (!matchTitle && !matchToken && !matchCode && !matchTicket) return false;
      }

      return true;
    });
  }, [analyzedReports, activeFilter, categoryFilter, searchQuery]);

  // Handler Aksi Petugas
  const handleUpdateReportStatus = async (reportId, newStatus, customNote = null) => {
    const note = customNote || responseText || 'Laporan telah ditindaklanjuti oleh Posko Pengaduan Disdik.';
    
    // 1. Simpan ke Database API jika tersedia
    try {
      const res = await fetch('/api/whistleblower', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus, respon_petugas: note })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus, respon_petugas: note } : r));
          setResponseModal(null);
          setResponseText('');
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback local update for static export');
    }

    // 2. Fallback Lokal (100% Berfungsi di Mode Demo / Static Export)
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus, respon_petugas: note } : r));
    setResponseModal(null);
    setResponseText('');
  };

  const handleMarkAsSpam = (reportId) => {
    const note = 'Laporan otomatis dikarantina oleh sistem mitigasi dinas karena terindikasi aduan tanpa dasar bukti atau tiket fiktif.';
    handleUpdateReportStatus(reportId, 'termitigasi_spam', note);
  };

  const handleEscalateField = (reportId) => {
    const note = 'Eskalasi ke Tim Pengawas Lapangan. Petugas verifikasi faktual telah diterjunkan ke alamat terkait.';
    handleUpdateReportStatus(reportId, 'dalam_investigasi', note);
  };

  const handleApplySanction = (reportId, ticketNumber) => {
    const note = `Bukti pelanggaran terverifikasi otentik. Berkas calon siswa terkait (${ticketNumber || 'Pendaftar'}) resmi dibekukan dari kuota zonasi dan dicatat permanen pada Audit Log SHA-256.`;
    handleUpdateReportStatus(reportId, 'bukti_valid_terverifikasi', note);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Header Halaman */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#EC4899] text-white">
              <ShieldAlert className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">
              Civic Reporting & Anti-Spam Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Posko Pengaduan Warga & Mitigasi Laporan Palsu
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pusat kendali investigasi aduan anonim masyarakat PPDB. Dilengkapi algoritma multi-faktor untuk memitigasi aduan spam/hoax sehingga verifikator dinas fokus menindak kecurangan faktual.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 1. KARTU STATISTIK KPI AUDIT LAPORAN */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Aduan Masuk</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{stats.total}</span>
              <span className="text-[10px] text-blue-600 font-semibold">Semua Kategori</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Investigasi Lapangan</span>
              <span className="text-2xl font-black text-amber-900 mt-0.5 block">{stats.investigasi}</span>
              <span className="text-[10px] text-amber-600 font-semibold">Faktual di Lapangan</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Terbukti & Sanksi</span>
              <span className="text-2xl font-black text-emerald-900 mt-0.5 block">{stats.valid}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Berkas Dibekukan</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Termitigasi Spam</span>
              <span className="text-2xl font-black text-rose-900 mt-0.5 block">{stats.spam}</span>
              <span className="text-[10px] text-rose-600 font-semibold">Aduan Hoax Disaring</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ShieldOff className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. TOOLBAR FILTER & PENCARIAN */}
        {/* ============================================================== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Sub-Tab Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {[
                { id: 'all', label: `Semua (${stats.total})` },
                { id: 'prioritas', label: `⭐ Prioritas Valid (${stats.prioritas})` },
                { id: 'investigasi', label: `⏳ Sedang Investigasi (${stats.investigasi})` },
                { id: 'valid', label: `✓ Terbukti Sanksi (${stats.valid})` },
                { id: 'spam', label: `✕ Termitigasi Spam (${stats.spam})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    activeFilter === f.id
                      ? 'bg-[#1E3A8A] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Pencarian */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari token / judul / tiket..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Kategori Filter */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Kategori:
              </span>
              {[
                { id: 'all', label: 'Semua Kategori' },
                { id: 'manipulasi_koordinat', label: 'Manipulasi Jarak' },
                { id: 'numpang_kk', label: 'Numpang KK' },
                { id: 'sertifikat_palsu', label: 'Sertifikat Palsu' },
                { id: 'pungli_kursi', label: 'Pungli / Calo' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    categoryFilter === cat.id
                      ? 'bg-blue-100 text-[#1E3A8A] font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              Menampilkan <strong>{filteredReports.length}</strong> laporan aktif
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. DAFTAR KARTU AUDIT PENGADUAN */}
        {/* ============================================================== */}
        <div className="space-y-4 mb-10">
          {filteredReports.length > 0 ? (
            filteredReports.map((r) => {
              const analysis = r.spamAnalysis;
              const isSpam = r.status === 'termitigasi_spam' || analysis.isSpam;
              const isValid = r.status === 'bukti_valid_terverifikasi';
              const isInvestigating = r.status === 'dalam_investigasi' || r.status === 'diterima';

              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-sm transition-all space-y-4 ${
                    isSpam
                      ? 'border-rose-200 bg-rose-50/20 opacity-85'
                      : isValid
                      ? 'border-emerald-300 ring-2 ring-emerald-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {r.kode_laporan}
                        </span>
                        <span className="font-mono text-[11px] text-[#1E3A8A] bg-blue-50 px-2.5 py-0.5 rounded-md font-bold border border-blue-200">
                          Token Anonim: {r.token_investigasi}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {r.kategori?.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="font-black text-base text-slate-900 mt-2 leading-snug">
                        {r.judul}
                      </h3>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Pelapor Anonim: <strong className="text-slate-700">{r.nama_samaran || 'Warga'}</strong> • Tiket Terkait:{' '}
                        <strong className="text-slate-700 font-mono">{r.tiket_terkait || '-'}</strong> • {formatDateIndo(r.created_at)}
                      </p>
                    </div>

                    {/* Spam Risk Score Gauge */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Skor Risiko Spam:</span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black font-mono border ${analysis.badgeColor}`}>
                          {analysis.score}% ({analysis.riskLevel})
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isValid
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isSpam
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {isValid 
                          ? '✓ BUKTI VALID & TERVERIFIKASI'
                          : isSpam
                          ? '✕ TERMITIGASI SPAM / DIKARANTINA'
                          : '⏳ DALAM INVESTIGASI LAPANGAN'}
                      </span>
                    </div>
                  </div>

                  {/* Body Laporan */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Narasi Aduan & Bukti */}
                    <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs leading-relaxed">
                      <div>
                        <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                          Kronologi & Detail Laporan Warga:
                        </span>
                        <p className="text-slate-700">{r.deskripsi}</p>
                      </div>

                      {r.lampiran_bukti_url && (
                        <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#2563EB]" />
                          <span className="font-bold text-[11px] text-[#1E3A8A]">Lampiran Dokumen Bukti:</span>
                          <span className="font-mono text-[11px] text-slate-600 underline cursor-pointer hover:text-blue-600">
                            {r.lampiran_bukti_url}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Breakdown Faktor Penilaian Spam */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-[10px] uppercase text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Analisis Algoritma Anti-Spam:
                      </span>
                      <div className="space-y-1.5 text-[11px]">
                        {analysis.reasons.map((reason, idx) => (
                          <div key={idx} className="text-slate-600 leading-tight">
                            {reason}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
                        {analysis.rekomendasi}
                      </div>
                    </div>
                  </div>

                  {/* Respon Resmi & Tindak Lanjut Petugas (Tersinkron ke Token Pelapor) */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
                        <span className="font-bold text-[10px] uppercase text-[#1E3A8A]">
                          Tanggapan Resmi Dinas (Terhubung ke Token Pelapor):
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium">
                        {r.respon_petugas || 'Laporan telah dicatat sistem. Menunggu telaah tim verifikator dinas.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setResponseModal(r);
                        setResponseText(r.respon_petugas || '');
                        setTargetStatus(r.status);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Sunting Tanggapan Token</span>
                    </button>
                  </div>

                  {/* Tombol Aksi 1-Klik Petugas */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 flex-wrap">
                    {!isValid && (
                      <button
                        type="button"
                        onClick={() => handleApplySanction(r.id, r.tiket_terkait)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Validasi Bukti & Eksekusi Sanksi</span>
                      </button>
                    )}

                    {!isInvestigating && (
                      <button
                        type="button"
                        onClick={() => handleEscalateField(r.id)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Tugaskan Tim Lapangan</span>
                      </button>
                    )}

                    {!isSpam ? (
                      <button
                        type="button"
                        onClick={() => handleMarkAsSpam(r.id)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-xs transition flex items-center gap-1.5 border border-slate-200"
                      >
                        <ShieldOff className="w-3.5 h-3.5" />
                        <span>Karantina Spam / Aduan Palsu</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateReportStatus(r.id, 'dalam_investigasi', 'Laporan dipulihkan dari karantina spam untuk ditelaah ulang.')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 font-bold text-xs transition flex items-center gap-1.5 border border-slate-200"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Pulihkan dari Karantina</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-black text-slate-800 text-base">Tidak ada aduan yang sesuai filter</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Coba sesuaikan tab filter atau kata kunci pencarian Anda.
              </p>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* MODAL SUNTING TANGGAPAN TOKEN RESMI DINAS */}
        {/* ============================================================== */}
        {responseModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Sunting Tanggapan Resmi Petugas
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Laporan: <strong className="font-mono text-[#1E3A8A]">{responseModal.kode_laporan}</strong> • Token: <strong className="font-mono">{responseModal.token_investigasi}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setResponseModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Transparansi Tanpa Mengorbankan Identitas:
                </span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Tanggapan ini akan dapat dibaca langsung oleh pelapor di portal publik <code>/whistleblower</code> dengan memasukkan Token Investigasi mereka.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Status Investigasi Laporan:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="dalam_investigasi">⏳ Dalam Investigasi Lapangan</option>
                  <option value="bukti_valid_terverifikasi">✓ Terbukti Valid (Sanksi Diterapkan)</option>
                  <option value="termitigasi_spam">✕ Termitigasi Spam / Hoax</option>
                  <option value="diterima">● Diterima (Menunggu Antrean)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan Tindak Lanjut & Instruksi Dinas:
                </label>
                <textarea
                  rows="4"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tuliskan temuan investigasi lapangan, sanksi yang dijatuhkan, atau alasan penutupan aduan..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#2563EB]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResponseModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateReportStatus(responseModal.id, targetStatus, responseText)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1E3A8A] hover:bg-[#2563EB] text-white shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan & Terbitkan ke Token</span>
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

  return {
    props: {
      initialReports: JSON.parse(JSON.stringify(reports)),
      initialPendaftaran: JSON.parse(JSON.stringify(pendaftaran))
    }
  };
}
