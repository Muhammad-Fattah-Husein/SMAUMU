import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { db } from '@/services/db';
import { formatDistance, formatDateIndo, getStatusTahapanBadge } from '@/utils/formatters';
import { FileCheck, Search, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminPermohonanPage({ initialList }) {
  const [list, setList] = useState(initialList);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = list.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.nomor_tiket.toLowerCase().includes(q) || p.nama_siswa.toLowerCase().includes(q) || p.sekolah_nama.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status_tahapan === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdate = async (id, newStatus) => {
    try {
      const res = await fetch('/api/verifikasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, catatan: `Diverifikasi status ${newStatus} oleh Admin Instansi.` })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setList(list.map(item => item.id === id ? { ...item, status_tahapan: newStatus } : item));
          return;
        }
      }
    } catch (err) {
      console.warn('Updating locally for static export');
    }
    setList(prev => prev.map(item => item.id === id ? { ...item, status_tahapan: newStatus } : item));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kelola Seluruh Permohonan Pendaftaran SMAN
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar lengkap berkas pemohon, status verifikasi berkas, dan histori seleksi.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa, nomor tiket, atau SMAN tujuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-bold text-slate-600 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto p-2 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
            >
              <option value="all">Semua Status Tahapan</option>
              <option value="diajukan">Diajukan</option>
              <option value="verifikasi_gis">Verifikasi GIS</option>
              <option value="tinjauan_manual">Tinjauan Manual</option>
              <option value="lolos_sementara">Lolos Sementara</option>
              <option value="diterima_resmi">Diterima Resmi</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Nama & NIK</th>
                  <th className="py-3 px-4">SMAN & Jalur</th>
                  <th className="py-3 px-4">Jarak GIS</th>
                  <th className="py-3 px-4">Nilai Rapor</th>
                  <th className="py-3 px-4">Status Saat Ini</th>
                  <th className="py-3 px-4 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((item) => {
                  const b = getStatusTahapanBadge(item.status_tahapan);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.nomor_tiket}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{item.nama_siswa}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.nik}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{item.sekolah_nama}</p>
                        <span className="text-[10px] text-brand-700 font-bold uppercase">{item.jalur}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {formatDistance(item.jarak_klaim_meter)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
                        {item.klaim_nilai_rapor}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${b.bg}`}>
                          {b.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleUpdate(item.id, 'diterima_resmi')}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                          >
                            Loloskan
                          </button>
                          <button
                            onClick={() => handleUpdate(item.id, 'tinjauan_manual')}
                            className="px-2 py-1 rounded bg-amber-500 text-white font-bold text-[10px] hover:bg-amber-600"
                          >
                            Tahan
                          </button>
                        </div>
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
  const initialList = db.getAllPendaftaran();
  return {
    props: {
      initialList: JSON.parse(JSON.stringify(initialList))
    }
  };
}
