import Layout from '@/components/Layout';
import { ShieldCheck, Target, Award, Users, Compass, Database, FileCheck2, BarChart3 } from 'lucide-react';

export default function TentangPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-bold mb-2 border border-blue-200">
            <span>Web In Action (WIA) MIA 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tentang SMAUMU (SMAN UntukMu)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Portal transparansi PPDB SMAN berbasis pengolahan data real-time, komparasi validitas formulir vs catatan resmi, dan log audit publik anti-manipulasi.
          </p>
        </div>

        {/* Latar Belakang & Masalah */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2563EB]" />
            Tiga Masalah Utama PPDB
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block mb-1">1. Ketertutupan Kuota</strong>
              <p className="text-slate-500">Ketidakjelasan sisa bangku riil per jalur seleksi.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block mb-1">2. Manipulasi Zonasi</strong>
              <p className="text-slate-500">Praktik numpang KK dan pergeseran pin GPS ilegal.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block mb-1">3. Tanpa Jejak Audit</strong>
              <p className="text-slate-500">Ketiadaan log publik atas keputusan verifikator.</p>
            </div>
          </div>
        </div>

        {/* Empat Subtema Integrasi */}
        <div className="bg-[#0F172A] text-white rounded-3xl p-5 sm:p-6 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-pink-400" />
            Empat Subtema Terintegrasi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="font-bold text-blue-300 text-xs mb-0.5">1. Open Government Data</h4>
              <p className="text-slate-400">Live Quota Burn-Rate & laju pengisian kursi per jam.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="font-bold text-[#10B981] text-xs mb-0.5">2. Public Service Tracking</h4>
              <p className="text-slate-400">Pendaftaran 4 langkah dengan tiket & tanda terima QR.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="font-bold text-pink-300 text-xs mb-0.5">3. Civic Accountability</h4>
              <p className="text-slate-400">Whistleblower anonim & log audit berantai SHA-256.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <h4 className="font-bold text-blue-200 text-xs mb-0.5">4. Decision Support</h4>
              <p className="text-slate-400">Komparator data, radar deviasi, dan simulator lolos.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
