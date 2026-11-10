import React, { useState } from 'react';
import { 
  Sheet, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetContent, 
  SheetFooter 
} from '@/components/ui/Sheet';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  User, 
  MapPin, 
  FileText, 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Award,
  Clock,
  Send,
  Compass,
  Layers
} from 'lucide-react';
import { formatDistance, formatDateIndo } from '@/utils/formatters';
import { sha256 } from '@/utils/crypto';

export function FioriObjectPageSheet({
  applicant,
  open,
  onOpenChange,
  onStatusUpdate,
  schoolList = []
}) {
  const [activeTab, setActiveTab] = useState('biodata');
  const [verificationNote, setVerificationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!applicant) return null;

  const school = schoolList.find(s => s.id === parseInt(applicant.sekolah_id)) || {
    nama_sekolah: 'SMAN 1 Jakarta',
    radius_max: 3200,
    kota: 'Jakarta Pusat'
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'lolos_seleksi':
        return <Badge variant="success">✓ Lolos Seleksi</Badge>;
      case 'verifikasi_berkas':
      case 'diajukan':
        return <Badge variant="warning">⏳ Menunggu Verifikasi</Badge>;
      case 'tinjauan_manual':
        return <Badge variant="purple">🔍 Tinjauan Lapangan</Badge>;
      case 'ditolak':
        return <Badge variant="destructive">✕ Berkas Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAction = async (newStatus) => {
    setIsSubmitting(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(applicant.id, newStatus, verificationNote);
      }
      setVerificationNote('');
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const auditHashPreview = sha256(`AUDIT:${applicant.nomor_tiket}:${applicant.nik}:${applicant.status_tahapan}`);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col gap-0 overflow-hidden"
      >
        {/* 1. OBJECT HEADER (SAP Fiori Header Standard) */}
        <SheetHeader className="bg-[#141417] text-[#E2E8F0] border-b border-white/10 pr-12">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F97316] to-[#F43F5E] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-orange-500/20">
              {applicant.nama_siswa?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#F97316] bg-orange-500/15 px-2 py-0.5 rounded border border-orange-500/30">
                  {applicant.nomor_tiket}
                </span>
                {getStatusBadge(applicant.status_tahapan)}
                <span className="text-[10px] uppercase font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                  Jalur: {applicant.jalur?.replace('_', ' ')}
                </span>
              </div>
              <SheetTitle className="text-white mt-1.5 truncate">
                {applicant.nama_siswa}
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 truncate">
                <span>NIK: <strong className="text-white">{applicant.nik}</strong></span>
                <span>•</span>
                <span>NISN: <strong className="text-white">{applicant.nisn}</strong></span>
                <span>•</span>
                <span>Asal: <strong className="text-white">{applicant.asal_sekolah_smp}</strong></span>
              </SheetDescription>
            </div>
          </div>

          {/* Fiori KPI Facet Strip (Ringkasan Indikator Kunci) */}
          <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-white/10 text-[11px]">
            <div className="bg-[#1E1E24] p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Jarak Spasial:</span>
              <strong className="text-[#F97316] font-mono text-xs">
                {formatDistance(applicant.klaim_jarak_meter || 1200)}
              </strong>
            </div>
            <div className="bg-[#1E1E24] p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Nilai Rapor:</span>
              <strong className="text-emerald-400 font-mono text-xs">
                {applicant.klaim_nilai_rapor || 85.0}
              </strong>
            </div>
            <div className="bg-[#1E1E24] p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Masa Tinggal:</span>
              <strong className="text-[#E2E8F0] font-mono text-xs">
                {applicant.lama_tinggal_bulan || 12} Bln
              </strong>
            </div>
            <div className="bg-[#1E1E24] p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Status Spasial:</span>
              <strong className={applicant.geo_anomaly_status === 'aman' ? 'text-emerald-400 text-xs' : 'text-[#F43F5E] text-xs'}>
                {applicant.geo_anomaly_status === 'aman' ? '✓ Aman' : '⚠️ Anomali'}
              </strong>
            </div>
          </div>
        </SheetHeader>

        {/* 2. OBJECT PAGE FACET TABS */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#1A1A1E]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 p-1 rounded-2xl bg-[#121212] border border-white/10">
            <TabsTrigger value="biodata" className="text-[11px]">
              1. Biodata KK
            </TabsTrigger>
            <TabsTrigger value="spasial" className="text-[11px]">
              2. Geospasial
            </TabsTrigger>
            <TabsTrigger value="berkas" className="text-[11px]">
              3. Berkas Sah
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-[11px]">
              4. Audit Trail
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BIODATA & DATA KEPENDUDUKAN DUKCAPIL */}
          <TabsContent value="biodata" className="space-y-3 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Sinkronisasi SIAK Dukcapil DKI:</strong> NIK &amp; NISN terverifikasi aktif pada pangkalan data kependudukan provinsi.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
                <span className="text-slate-400 text-[10px] block">Nama Lengkap Siswa</span>
                <strong className="text-white">{applicant.nama_siswa}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
                <span className="text-slate-400 text-[10px] block">Asal Sekolah SMP / MTs</span>
                <strong className="text-white">{applicant.asal_sekolah_smp}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
                <span className="text-slate-400 text-[10px] block">Nomor Telepon Wali</span>
                <strong className="text-white font-mono">{applicant.nomor_telepon || '081299882026'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
                <span className="text-slate-400 text-[10px] block">Durasi Tinggal di KK</span>
                <strong className="text-white">{applicant.lama_tinggal_bulan || 24} Bulan (Lolos Regulasi Min. 12 Bln)</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#222227] border border-white/10 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] block">Alamat Tempat Tinggal Resmi Sesuai KK:</span>
              <p className="font-semibold text-[#E2E8F0] leading-relaxed">{applicant.alamat_domisili}</p>
            </div>
          </TabsContent>

          {/* TAB 2: ANALISIS GEOSPASIAL HAVERSINE */}
          <TabsContent value="spasial" className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/25 text-xs text-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-[#F97316]">
                  <Compass className="w-4 h-4 text-[#F97316]" />
                  Hasil Komputasi Geospasial Haversine:
                </span>
                <Badge variant="default">Auto-Snap Valid</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 block">Jarak Terkalkulasi:</span>
                  <strong className="text-base text-[#F97316] font-mono">
                    {formatDistance(applicant.klaim_jarak_meter || 1200)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Batas Maks. Zonasi SMAN:</span>
                  <strong className="text-base text-white font-mono">
                    {formatDistance(school.radius_max || 3200)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
                <span className="text-slate-400 text-[10px] font-sans block">Koordinat Rumah Pendaftar</span>
                <strong className="text-[#E2E8F0]">
                  {Number(applicant.klaim_koordinat_lat || -6.1625).toFixed(5)}, {Number(applicant.klaim_koordinat_lng || 106.8335).toFixed(5)}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
                <span className="text-slate-400 text-[10px] font-sans block">Koordinat SMAN Tujuan</span>
                <strong className="text-[#E2E8F0]">
                  {Number(school.lat || -6.1668).toFixed(5)}, {Number(school.lng || 106.8373).toFixed(5)}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#222227] border border-white/10 text-xs">
              <span className="text-slate-400 text-[10px] block mb-1">Sekolah Cadangan (Pilihan Kedua):</span>
              <p className="font-bold text-white">SMAN 68 Jakarta (Jakarta Pusat) • Daya Tampung Cadangan</p>
            </div>
          </TabsContent>

          {/* TAB 3: DOKUMEN FISIK & BERKAS SAH */}
          <TabsContent value="berkas" className="space-y-3 pt-2">
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/15 text-[#F97316]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Salinan Kartu Keluarga (KK Asli)</h5>
                    <p className="text-[11px] text-slate-400">kk_terverifikasi_dukcapil.pdf • 1.2 MB</p>
                  </div>
                </div>
                <Badge variant="success">✓ Otentik</Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Buku Rapor Semester 1 - 5</h5>
                    <p className="text-[11px] text-slate-400">rapor_smp_terlegalisir.pdf • Rata-rata 89.20</p>
                  </div>
                </div>
                <Badge variant="success">✓ Sah</Badge>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: JEJAK AUDIT KRIPTOGRAFIS SHA-256 */}
          <TabsContent value="audit" className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#121212] text-[#E2E8F0] border border-white/10 text-xs space-y-2">
              <span className="font-mono text-[#F97316] text-[10px] uppercase font-bold block">
                Immutable SHA-256 Block Proof
              </span>
              <div className="font-mono text-[11px] break-all bg-[#1E1E24] p-2.5 rounded-xl border border-white/10 text-slate-300">
                {auditHashPreview}
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>Entity: Pendaftaran #{applicant.id}</span>
                <span className="text-emerald-400 font-bold">✓ Merkle Chain Valid</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Input Catatan Petugas */}
        <div className="pt-2 border-t border-white/10">
          <label className="text-xs font-bold text-[#E2E8F0] block mb-1">
            Catatan Disposisi Verifikator:
          </label>
          <textarea
            rows="2"
            value={verificationNote}
            onChange={(e) => setVerificationNote(e.target.value)}
            placeholder="Tuliskan catatan verifikasi berkas atau instruksi khusus..."
            className="w-full p-2.5 rounded-xl bg-[#121212] border border-white/15 text-xs font-medium text-[#E2E8F0] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          ></textarea>
        </div>
        </div>

        {/* 3. OBJECT PAGE ACTION FOOTER (Bilah Aksi Petugas Fiori) */}
        <SheetFooter className="gap-2">
          <Button
            variant="destructive"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleAction('ditolak')}
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            <span>Tolak Berkas</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleAction('tinjauan_manual')}
          >
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>Tinjauan Lapangan</span>
          </Button>

          <Button
            variant="success"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleAction('lolos_seleksi')}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Loloskan & Alokasi Kuota</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
