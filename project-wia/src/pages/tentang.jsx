import Layout from '@/components/Layout';
import { ShieldCheck, Target, Award, Users, Compass, Database, FileCheck2, BarChart3 } from 'lucide-react';

export default function TentangPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-[#F97316] text-xs font-bold mb-2 border border-orange-500/30">
            <span>Web In Action (WIA) MIA 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tentang SMAUMU (SMAN UntukMu)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Portal transparansi PPDB SMAN berbasis pengolahan data real-time, komparasi validitas formulir vs catatan resmi, dan log audit publik anti-manipulasi.
          </p>
        </div>

        {/* Latar Belakang & Masalah */}
        <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-5 sm:p-6 shadow-sm space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-[#F97316]" />
            Tiga Masalah Utama PPDB
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <strong className="text-white block mb-1">1. Ketertutupan Kuota</strong>
              <p className="text-slate-400">Ketidakjelasan sisa bangku riil per jalur seleksi.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <strong className="text-white block mb-1">2. Manipulasi Zonasi</strong>
              <p className="text-slate-400">Praktik numpang KK dan pergeseran pin GPS ilegal.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <strong className="text-white block mb-1">3. Tanpa Jejak Audit</strong>
              <p className="text-slate-400">Ketiadaan log publik atas keputusan verifikator.</p>
            </div>
          </div>
        </div>

        {/* Empat Subtema Integrasi */}
        <div className="bg-[#18181B] text-white rounded-3xl p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F43F5E]" />
            Empat Subtema Terintegrasi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <h4 className="font-bold text-orange-300 text-xs mb-0.5">1. Open Government Data</h4>
              <p className="text-slate-400">Live Quota Burn-Rate & laju pengisian kursi per jam.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <h4 className="font-bold text-[#10B981] text-xs mb-0.5">2. Public Service Tracking</h4>
              <p className="text-slate-400">Pendaftaran 4 langkah dengan tiket & tanda terima QR.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <h4 className="font-bold text-rose-300 text-xs mb-0.5">3. Civic Accountability</h4>
              <p className="text-slate-400">Whistleblower anonim & log audit berantai SHA-256.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#222227] border border-white/10">
              <h4 className="font-bold text-orange-300 text-xs mb-0.5">4. Decision Support</h4>
              <p className="text-slate-400">Heatmap spasial zonasi, passing grade, dan simulator lolos.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
