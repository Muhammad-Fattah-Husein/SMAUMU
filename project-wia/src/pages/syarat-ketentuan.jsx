import Layout from '@/components/Layout';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SyaratKetentuanPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#1E3A8A] text-white">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              Regulasi PPDB 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Syarat & Ketentuan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ketentuan domisili zonasi, toleransi geospasial, dan sanksi pemalsuan dokumen.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">1. Masa Tinggal KK</h2>
            <p>
              Pendaftar jalur zonasi wajib berdomisili sesuai alamat Kartu Keluarga (KK) yang diterbitkan minimal 12 bulan (1 tahun) sebelum pendaftaran dibuka.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">2. Toleransi Geospasial</h2>
            <p>
              Toleransi pergeseran koordinat maksimal 150 meter. Deviasi di atas 500 meter dinyatakan sebagai anomali kritis yang memicu pembatalan otomatis.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">3. Sanksi Rekayasa Data</h2>
            <p>
              Pemalsuan dokumen, titip KK fiktif, atau rekayasa nilai berakibat pembatalan status kelulusan dan penuntutan sesuai peraturan perundang-undangan.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
