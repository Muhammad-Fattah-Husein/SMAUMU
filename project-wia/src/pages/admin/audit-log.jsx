import AdminSidebar from '@/components/AdminSidebar';
import ImmutableAuditTable from '@/components/ImmutableAuditTable';
import { db } from '@/services/db';
import { Lock, ShieldCheck } from 'lucide-react';

export default function AdminAuditLogPage({ initialLogs }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-slate-900 text-white"><Lock className="w-3.5 h-3.5" /></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Audit Trail Kriptografis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Immutable Audit Log (Sesi Internal Instansi)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak setiap aksi operator verifikasi dan status pendaftaran dalam format rantai hash SHA-256 anti-manipulasi.
          </p>
        </div>

        <ImmutableAuditTable initialLogs={initialLogs} />
      </main>
    </div>
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
