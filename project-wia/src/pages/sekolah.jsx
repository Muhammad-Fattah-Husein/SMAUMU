import Layout from '@/components/Layout';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { formatDistance } from '@/utils/formatters';
import { School, MapPin, Phone, Globe, Award, Users, BookOpen } from 'lucide-react';

export default function SekolahPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Daftar SMA Negeri & Zonasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
          Profil daya tampung kuota, batas radius zonasi resmi, dan tautan sekolah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {INITIAL_SEKOLAH.map((school) => (
          <div key={school.id} className="bg-[#1A1A1E] rounded-2xl border border-white/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-[#F97316] flex items-center justify-center font-bold">
                  <School className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#222227] text-slate-300 px-2 py-0.5 rounded border border-white/10">
                  NPSN: {school.npsn}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-sm sm:text-base">{school.nama_sekolah}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{school.alamat}, {school.kecamatan}</span>
                </p>
              </div>

              <div className="space-y-1.5 pt-2.5 border-t border-white/10 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Radius Zonasi:</span>
                  <span className="font-mono font-bold text-[#F97316]">{formatDistance(school.radius_max)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daya Tampung:</span>
                  <span className="font-mono font-bold text-white">{school.kuota_total} Kursi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Akreditasi:</span>
                  <span className="font-semibold text-[#10B981] bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/30 text-[11px]">
                    {school.akreditasi}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kontak:</span>
                  <span className="font-medium text-[#E2E8F0]">{school.telepon}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/10">
              <a
                href={school.website || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 px-3 text-xs font-bold text-[#F97316] bg-orange-500/10 hover:bg-orange-500/15 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website Resmi</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
