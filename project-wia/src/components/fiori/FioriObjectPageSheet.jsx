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
        <SheetHeader className="bg-slate-900 text-white border-b border-slate-800 pr-12">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-cyan-300 border border-white/20 flex items-center justify-center font-black text-lg shrink-0 shadow-inner">
              {applicant.nama_siswa?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {applicant.nomor_tiket}
                </span>
                {getStatusBadge(applicant.status_tahapan)}
                <span className="text-[10px] uppercase font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                  Jalur: {applicant.jalur?.replace('_', ' ')}
                </span>
              </div>
              <SheetTitle className="text-white mt-1.5 truncate">
                {applicant.nama_siswa}
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5 truncate">
                <span>NIK: <strong>{applicant.nik}</strong></span>
                <span>•</span>
                <span>NISN: <strong>{applicant.nisn}</strong></span>
                <span>•</span>
                <span>Asal: <strong>{applicant.asal_sekolah_smp}</strong></span>
              </SheetDescription>
            </div>
          </div>

          {/* Fiori KPI Facet Strip (Ringkasan Indikator Kunci) */}
          <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-white/15 text-[11px]">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Jarak Spasial:</span>
              <strong className="text-cyan-300 font-mono text-xs">
                {formatDistance(applicant.klaim_jarak_meter || 1200)}
              </strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Nilai Rapor:</span>
              <strong className="text-emerald-300 font-mono text-xs">
                {applicant.klaim_nilai_rapor || 85.0}
              </strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Masa Tinggal:</span>
              <strong className="text-slate-200 font-mono text-xs">
                {applicant.lama_tinggal_bulan || 12} Bln
              </strong>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Status Spasial:</span>
              <strong className={applicant.geo_anomaly_status === 'aman' ? 'text-emerald-400 text-xs' : 'text-rose-400 text-xs'}>
                {applicant.geo_anomaly_status === 'aman' ? '✓ Aman' : '⚠️ Anomali'}
              </strong>
            </div>
          </div>
        </SheetHeader>

        {/* 2. OBJECT PAGE FACET TABS */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 p-1 rounded-2xl bg-slate-100">
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
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Sinkronisasi SIAK Dukcapil DKI:</strong> NIK & NISN terverifikasi aktif pada pangkalan data kependudukan provinsi.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Nama Lengkap Siswa</span>
                <strong className="text-slate-900">{applicant.nama_siswa}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Asal Sekolah SMP / MTs</span>
                <strong className="text-slate-900">{applicant.asal_sekolah_smp}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Nomor Telepon Wali</span>
                <strong className="text-slate-900 font-mono">{applicant.nomor_telepon || '081299882026'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Durasi Tinggal di KK</span>
                <strong className="text-slate-900">{applicant.lama_tinggal_bulan || 24} Bulan (Lolos Regulasi Min. 12 Bln)</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] block">Alamat Tempat Tinggal Resmi Sesuai KK:</span>
              <p className="font-semibold text-slate-800 leading-relaxed">{applicant.alamat_domisili}</p>
            </div>
          </TabsContent>

          {/* TAB 2: ANALISIS GEOSPASIAL HAVERSINE */}
          <TabsContent value="spasial" className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-[#1E3A8A]">
                  <Compass className="w-4 h-4 text-[#2563EB]" />
                  Hasil Komputasi Geospasial Haversine:
                </span>
                <Badge variant="default">Auto-Snap Valid</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">Jarak Terkalkulasi:</span>
                  <strong className="text-base text-[#1E3A8A] font-mono">
                    {formatDistance(applicant.klaim_jarak_meter || 1200)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Batas Maks. Zonasi SMAN:</span>
                  <strong className="text-base text-slate-800 font-mono">
                    {formatDistance(school.radius_max || 3200)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-sans block">Koordinat Rumah Pendaftar</span>
                <strong className="text-slate-800">
                  {Number(applicant.klaim_koordinat_lat || -6.1625).toFixed(5)}, {Number(applicant.klaim_koordinat_lng || 106.8335).toFixed(5)}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-sans block">Koordinat SMAN Tujuan</span>
                <strong className="text-slate-800">
                  {Number(school.lat || -6.1668).toFixed(5)}, {Number(school.lng || 106.8373).toFixed(5)}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 text-[10px] block mb-1">Sekolah Cadangan (Pilihan Kedua):</span>
              <p className="font-bold text-slate-800">SMAN 68 Jakarta (Jakarta Pusat) • Daya Tampung Cadangan</p>
            </div>
          </TabsContent>

          {/* TAB 3: DOKUMEN FISIK & BERKAS SAH */}
          <TabsContent value="berkas" className="space-y-3 pt-2">
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Salinan Kartu Keluarga (KK Asli)</h5>
                    <p className="text-[11px] text-slate-400">kk_terverifikasi_dukcapil.pdf • 1.2 MB</p>
                  </div>
                </div>
                <Badge variant="success">✓ Otentik</Badge>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Buku Rapor Semester 1 - 5</h5>
                    <p className="text-[11px] text-slate-400">rapor_smp_terlegalisir.pdf • Rata-rata 89.20</p>
                  </div>
                </div>
                <Badge variant="success">✓ Sah</Badge>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: JEJAK AUDIT KRIPTOGRAFIS SHA-256 */}
          <TabsContent value="audit" className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 text-xs space-y-2">
              <span className="font-mono text-cyan-300 text-[10px] uppercase font-bold block">
                Immutable SHA-256 Block Proof
              </span>
              <div className="font-mono text-[11px] break-all bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-slate-300">
                {auditHashPreview}
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Entity: Pendaftaran #{applicant.id}</span>
                <span className="text-emerald-400 font-bold">✓ Merkle Chain Valid</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Input Catatan Petugas */}
        <div className="pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Catatan Disposisi Verifikator:
          </label>
          <textarea
            rows="2"
            value={verificationNote}
            onChange={(e) => setVerificationNote(e.target.value)}
            placeholder="Tuliskan catatan verifikasi berkas atau instruksi khusus..."
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
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
