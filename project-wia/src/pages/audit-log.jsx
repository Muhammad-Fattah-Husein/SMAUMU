import Layout from '@/components/Layout';
import ImmutableAuditTable from '@/components/ImmutableAuditTable';
import { db } from '@/services/db';
import { Lock, ShieldCheck, Database, FileSpreadsheet } from 'lucide-react';

export default function AuditLogPublicPage({ initialLogs }) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#F97316] text-white">
            <Lock className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
            Immutable Audit Ledger
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Buku Catatan Tindakan Petugas (SHA-256)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
          Perekaman seluruh verifikasi dan pembaruan kuota ke dalam rantai hash SHA-256 yang bebas manipulasi.
        </p>
      </div>

      <div className="mb-10">
        <ImmutableAuditTable initialLogs={initialLogs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#1A1A1E] border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-xs text-white">Mekanisme Kriptografi Rantai Hash</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Setiap blok mencatat <code>prev_hash</code> blok sebelumnya. Modifikasi 1 karakter akan merusak seluruh rantai validasi.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1A1E] border border-white/10 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <Database className="w-4 h-4 text-[#F97316]" />
            <h3 className="font-bold text-xs text-white">Aksesibilitas Audit Publik</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Masyarakat, jurnalis, dan Ombudsman dapat memverifikasi integritas log secara langsung tanpa birokrasi perizinan.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const initialLogs = db.getAuditLogs();
  return {
    props: {
      initialLogs: JSON.parse(JSON.stringify(initialLogs))
    }
  };
}
