import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { getJalurLabel, formatPercentage } from '@/utils/formatters';
import { Database, Plus, Edit2, Save, Flame } from 'lucide-react';

export default function AdminMasterKuotaPage({ initialKuota }) {
  const [kuotaList, setKuotaList] = useState(initialKuota);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Data Master Kuota & Daya Tampung SMAN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pengaturan alokasi persentase kursi per jalur seleksi (Zonasi 50%, Afirmasi 20%, Prestasi 20%, Mutasi 10%).
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama SMAN</th>
                  <th className="py-3 px-4">Jalur Seleksi</th>
                  <th className="py-3 px-4">Persentase</th>
                  <th className="py-3 px-4">Total Kursi</th>
                  <th className="py-3 px-4">Terisi</th>
                  <th className="py-3 px-4">Sisa Kuota</th>
                  <th className="py-3 px-4">Burn-Rate / Jam</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {kuotaList.map((item) => {
                  const sisa = Math.max(0, item.total_kuota - item.kuota_terisi);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {item.sekolah_nama}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {getJalurLabel(item.jalur)}
                      </td>
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {item.persentase}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                        {item.total_kuota} kursi
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold whitespace-nowrap">
                        {item.kuota_terisi}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 font-bold whitespace-nowrap">
                        {sisa} kursi
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-700 font-bold whitespace-nowrap">
                        {item.burn_rate_per_jam} berkas/jam
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Aktif
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const kuota = db.getAllKuotaWithMetrics();
  return {
    props: {
      initialKuota: JSON.parse(JSON.stringify(kuota))
    }
  };
}
