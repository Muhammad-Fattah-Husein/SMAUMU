import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { formatDistance } from '@/utils/formatters';
import { 
  School, 
  MapPin, 
  Phone, 
  Globe, 
  Award, 
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  ArrowRight,
  Compass,
  BarChart3
} from 'lucide-react';

export default function SekolahPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKota, setSelectedKota] = useState('all');

  const filteredSchools = INITIAL_SEKOLAH.filter((school) => {
    const matchKota = selectedKota === 'all' || school.kota.toLowerCase() === selectedKota.toLowerCase();
    const matchQuery =
      school.nama_sekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.npsn.includes(searchQuery) ||
      school.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKota && matchQuery;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <School className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Direktori Resmi Sekolah
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Daftar SMA Negeri Binaan DKI Jakarta
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
          Profil resmi satuan pendidikan, batas jangkauan radius zonasi, akreditasi BAN-S/M, daya tampung kuota, dan kontak layanan sekolah.
        </p>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari SMAN, NPSN, atau kecamatan..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#2563EB] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedKota}
            onChange={(e) => setSelectedKota(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#2563EB] w-full sm:w-auto"
          >
            <option value="all">Semua Wilayah</option>
            <option value="Jakarta Pusat">Jakarta Pusat</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
          </select>
        </div>
      </div>

      {/* Grid Kartu Sekolah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredSchools.map((school) => (
          <div 
            key={school.id} 
            className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold shadow-sm">
                  <School className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 block">
                    NPSN: {school.npsn}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                    Akreditasi {school.akreditasi}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-base leading-snug">{school.nama_sekolah}</h3>
                <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{school.alamat}, Kec. {school.kecamatan}, {school.kota}</span>
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Radius Zonasi Resmi:</span>
                  <span className="font-mono font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded">
                    {formatDistance(school.radius_max)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Daya Tampung:</span>
                  <span className="font-mono font-bold text-slate-900">{school.kuota_total} Kursi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Kontak Sekolah:</span>
                  <span className="font-medium text-slate-800">{school.telepon}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                href={`/simulator`}
                className="py-2 px-3 text-xs font-bold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Uji Zonasi</span>
              </Link>
              <Link
                href={`/kuota`}
                className="py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Cek Kuota</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
