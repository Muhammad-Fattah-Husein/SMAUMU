import Layout from '@/components/Layout';
import { Lock, ShieldCheck, EyeOff, FileText } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#F97316] text-white">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              Kepatuhan UU PDP (No. 27/2022)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Perlindungan integritas data pendaftar dan kerahasiaan identitas warga.
          </p>
        </div>

        <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-5 sm:p-6 shadow-sm space-y-4 text-xs text-slate-400 leading-relaxed">
          <section className="space-y-1">
            <h2 className="text-sm font-bold text-white">1. Data Minimal</h2>
            <p>
              SMAUMU hanya memproses data esensial PPDB (NIK, NISN, nilai rapor, dan koordinat domisili). Tidak ada data yang dijual atau dibagikan ke pihak ketiga komersial.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-sm font-bold text-white">2. Enkripsi & Penyamaran Identitas</h2>
            <p>
              Nomor tiket dienkripsi acak. NIK pada tampilan publik disamarkan (contoh: 317101******0001) guna melindungi privasi siswa di bawah umur.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-sm font-bold text-white">3. Anonimitas Pelapor</h2>
            <p>
              Saluran pengaduan tidak mencatat alamat IP atau identitas perangkat. Pemantauan tindak lanjut dilakukan sepenuhnya melalui token investigasi acak.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-sm font-bold text-white">4. Hak Verifikasi & Koreksi</h2>
            <p>
              Pendaftar berhak mengajukan klarifikasi berkas dan meninjau deviasi koordinat apabila terdapat kendala penetapan batas RT/wilayah.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
