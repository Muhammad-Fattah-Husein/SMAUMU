import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  School, 
  FileText, 
  Award, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Crosshair,
  Compass,
  Database,
  Cloud
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isSupabaseReady } = useAuth();

  // Comprehensive Form State: Contains ALL data needed across all features
  const [formData, setFormData] = useState({
    // 1. Akun & Kontak
    nama_siswa: 'Muhammad Rayhan Pratama',
    email: 'rayhan.pratama@gmail.com',
    password: '',
    password_confirm: '',
    nomor_telepon: '081234567890',
    nama_wali: 'Bambang Pratama',

    // 2. Kependudukan & SMP
    nik: '3171021508090002',
    nisn: '0089123456',
    asal_sekolah_smp: 'SMPN 1 Jakarta',

    // 3. Domisili & Geospasial (Zonasi & Validasi Domisili)
    alamat_domisili: 'Jl. Pasar Baru Timur No. 18, Sawah Besar, Jakarta Pusat',
    lama_tinggal_bulan: 28,
    klaim_lat: -6.167200,
    klaim_lng: 106.837800,

    // 4. Akademik & Prestasi (Passing-Grade Simulator & Seleksi Rapor)
    klaim_nilai_rapor: 89.20,
    sertifikat_prestasi: '10', // +10 Kota/Kabupaten

    // 5. Preferensi Pilihan SMAN & Jalur Masuk (Live Quota Burn-Rate)
    jalur: 'zonasi',
    sekolah_id: 1, // SMAN 1
    sekolah_cadangan_id: 2 // SMAN 8
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Preset location helper
  const handleApplyPresetLocation = (type) => {
    if (type === 'pasar_baru') {
      setFormData(prev => ({
        ...prev,
        alamat_domisili: 'Jl. Pasar Baru Timur No. 18, Sawah Besar, Jakarta Pusat',
        klaim_lat: -6.167200,
        klaim_lng: 106.837800,
        lama_tinggal_bulan: 28
      }));
    } else if (type === 'bukit_duri') {
      setFormData(prev => ({
        ...prev,
        alamat_domisili: 'Jl. Taman Bukit Duri No. 10, Tebet, Jakarta Selatan',
        klaim_lat: -6.224100,
        klaim_lng: 106.859200,
        lama_tinggal_bulan: 16
      }));
    } else if (type === 'pondok_labu') {
      setFormData(prev => ({
        ...prev,
        alamat_domisili: 'Jl. Margasatwa Raya No. 25, Pondok Labu, Jakarta Selatan',
        klaim_lat: -6.311500,
        klaim_lng: 106.799800,
        lama_tinggal_bulan: 24
      }));
    }
  };

  // Get live GPS coordinate
  const handleGetLiveGPS = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            klaim_lat: parseFloat(pos.coords.latitude.toFixed(6)),
            klaim_lng: parseFloat(pos.coords.longitude.toFixed(6))
          }));
        },
        () => {
          alert('Izin lokasi tidak diberikan. Koordinat default Jakarta tetap digunakan.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Kata sandi wajib diisi minimal 6 karakter demi keamanan akun.');
      return;
    }
    if (formData.password !== formData.password_confirm) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }
    if (formData.nik.length !== 16) {
      setErrorMsg('Nomor NIK harus tepat 16 angka sesuai Kartu Keluarga sah.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        setSuccessData(result.user);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal mendaftarkan akun. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-8">
        {/* Header Identitas & Subtema */}
        <div className="text-center sm:text-left mb-6">
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <span className="p-1 rounded bg-[#1E3A8A] text-white">
              <UserPlus className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
              Pendaftaran Akun Calon Siswa / Wali Murid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registrasi Pendaftar PPDB SMAN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Lengkapi data pendaftar sekali untuk seluruh fitur: pemantauan kuota, kalkulasi simulasi lolos, validasi zonasi dual-truth, dan penerbitan tiket sah.
          </p>

          {/* Backend Connection Indicator */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-[#1E3A8A]">
            <Cloud className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>
              Backend Terkoneksi: <strong>{isSupabaseReady ? 'Supabase PostgreSQL Cloud' : 'Supabase Client (Mode Demo / Siap Produksi)'}</strong>
            </span>
          </div>
        </div>

        {/* Success Screen after Registration */}
        {successData ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-lg space-y-6 animate-fade-in text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#10B981] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                  ✓ Akun Siswa Baru Berhasil Dibuat
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  Selamat Datang, {successData.nama}!
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Akun Anda telah terdaftar di database Supabase dengan nomor tiket pendaftaran resmi.
                </p>
              </div>
            </div>

            {/* Ticket Card Preview */}
            <div className="p-6 rounded-3xl bg-[#0F172A] text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-pink-300 uppercase tracking-widest">
                    Nomor Tiket Anda:
                  </span>
                  <h3 className="text-2xl font-black font-mono text-[#10B981] tracking-wider">
                    {successData.nomor_tiket || 'TIKET-SMU-2026-TERDAFTAR'}
                  </h3>
                </div>
                <span className="text-xs bg-[#1E3A8A] text-white px-3 py-1 rounded-xl font-bold w-fit">
                  Peran: Calon Siswa (Masyarakat)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px]">Nama Lengkap:</span>
                  <p className="font-bold text-white">{successData.nama}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Email Akun:</span>
                  <p className="font-bold text-white truncate">{successData.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Sekolah Pilihan:</span>
                  <p className="font-bold text-white">SMAN {successData.sekolah_id || 1} Jakarta</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Jalur Pendaftaran:</span>
                  <p className="font-bold text-pink-300 uppercase">{successData.jalur || 'Zonasi'}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/daftar"
                className="px-5 py-3 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 text-center"
              >
                <span>Lihat Tanda Terima Resmi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kuota"
                className="px-5 py-3 rounded-2xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition flex items-center justify-center gap-2 text-center shadow-md"
              >
                <span>Pantau Kuota SMAN</span>
              </Link>
              <Link
                href="/simulator"
                className="px-5 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 text-center"
              >
                <span>Uji Simulator Peluang</span>
              </Link>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-[#DB2777] text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Strict Notice: NO ADMIN REGISTRATION */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-[#1E3A8A]">
              <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Ketentuan Peran Akun (Kebijakan Transparansi):</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">
                  Formulir ini <strong>khusus untuk Masyarakat, Calon Siswa Baru, dan Orang Tua/Wali</strong>. Demi menjaga netralitas dan akuntabilitas publik, <em>tidak ada pendaftaran akun Admin Instansi secara mandiri</em>. Seluruh akun verifikator dinas diterbitkan melalui otoritas resmi administrator.
                </p>
              </div>
            </div>

            {/* BAGIAN 1: AKUN & AUTENTIKASI SUPABASE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-6 h-6 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h3 className="font-black text-sm text-slate-900">
                  Data Akun & Autentikasi Pengguna
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Calon Siswa</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_siswa}
                    onChange={(e) => handleChange('nama_siswa', e.target.value)}
                    placeholder="Contoh: Muhammad Rayhan Pratama"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Aktif (Akun Supabase)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kata Sandi (Password Akun)</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Konfirmasi Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={formData.password_confirm}
                    onChange={(e) => handleChange('password_confirm', e.target.value)}
                    placeholder="Ketik ulang kata sandi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp / HP Aktif</label>
                  <input
                    type="tel"
                    required
                    value={formData.nomor_telepon}
                    onChange={(e) => handleChange('nomor_telepon', e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_wali}
                    onChange={(e) => handleChange('nama_wali', e.target.value)}
                    placeholder="Nama orang tua/wali siswa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN 2: DATA KEPENDUDUKAN & ASAL SEKOLAH */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-6 h-6 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h3 className="font-black text-sm text-slate-900">
                  Data Identitas Kependudukan & SMP Asal
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    required
                    maxLength="16"
                    value={formData.nik}
                    onChange={(e) => handleChange('nik', e.target.value)}
                    placeholder="16 angka di KK"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Sesuai data resmi Dukcapil</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Induk Siswa Nasional (NISN)</label>
                  <input
                    type="text"
                    required
                    maxLength="10"
                    value={formData.nisn}
                    onChange={(e) => handleChange('nisn', e.target.value)}
                    placeholder="10 digit NISN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Tersinkron dengan Dapodik</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Asal Sekolah SMP / MTs</label>
                  <input
                    type="text"
                    required
                    value={formData.asal_sekolah_smp}
                    onChange={(e) => handleChange('asal_sekolah_smp', e.target.value)}
                    placeholder="Contoh: SMPN 1 Jakarta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN 3: DOMISILI & GEOSPASIAL (Zonasi & Validasi Domisili) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <h3 className="font-black text-sm text-slate-900">
                    Alamat Domisili & Titik Geospasial (Validasi Zonasi)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleGetLiveGPS}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1E3A8A] font-bold text-[11px] hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1"
                >
                  <Crosshair className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Dapatkan GPS Real-time</span>
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-xs mb-1">
                  Alamat Lengkap Tempat Tinggal Sesuai Kartu Keluarga:
                </label>
                <textarea
                  rows="2"
                  required
                  value={formData.alamat_domisili}
                  onChange={(e) => handleChange('alamat_domisili', e.target.value)}
                  placeholder="Nama jalan, RT/RW, kelurahan, kecamatan, kota..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Garis Lintang (Latitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.klaim_lat}
                    onChange={(e) => handleChange('klaim_lat', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Garis Bujur (Longitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.klaim_lng}
                    onChange={(e) => handleChange('klaim_lng', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lama Tinggal di KK (Bulan)</label>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    required
                    value={formData.lama_tinggal_bulan}
                    onChange={(e) => handleChange('lama_tinggal_bulan', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Syarat zonasi sah: minimal 12 bulan (1 tahun)</p>
                </div>
              </div>

              {/* Lokasi Cepat Preset */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium">Contoh Presisi Domisili:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLocation('pasar_baru')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-[11px]"
                >
                  Pasar Baru (Dekat SMAN 1)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLocation('bukit_duri')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-[11px]"
                >
                  Tebet / Bukit Duri (Dekat SMAN 8)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetLocation('pondok_labu')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-[11px]"
                >
                  Pondok Labu (Dekat SMAN 34)
                </button>
              </div>
            </div>

            {/* BAGIAN 4: AKADEMIK & PRESTASI (Simulator & Seleksi Rapor) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-6 h-6 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xs">
                  4
                </span>
                <h3 className="font-black text-sm text-slate-900">
                  Data Akademik & Prestasi (Untuk Passing-Grade Simulator)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nilai Rata-rata Rapor (Semester 1 - 5):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="60"
                    max="100"
                    required
                    value={formData.klaim_nilai_rapor}
                    onChange={(e) => handleChange('klaim_nilai_rapor', parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Dicocokkan otomatis dengan basis data Dapodik Pusat</p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sertifikat / Piagam Prestasi Tambahan:
                  </label>
                  <select
                    value={formData.sertifikat_prestasi}
                    onChange={(e) => handleChange('sertifikat_prestasi', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="0">Tidak Ada Piagam Tambahan (+0 Poin)</option>
                    <option value="10">Tingkat Kota / Kabupaten (+10 Poin)</option>
                    <option value="20">Tingkat Provinsi (+20 Poin)</option>
                    <option value="30">Tingkat Nasional / Internasional (+30 Poin)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BAGIAN 5: PREFERENSI JALUR & PILIHAN SMAN */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-6 h-6 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xs">
                  5
                </span>
                <h3 className="font-black text-sm text-slate-900">
                  Target SMAN & Jalur Masuk yang Diminati
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jalur Pendaftaran Utama:</label>
                  <select
                    value={formData.jalur}
                    onChange={(e) => handleChange('jalur', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="zonasi">Zonasi (50% Kuota)</option>
                    <option value="afirmasi">Afirmasi / KJP (20% Kuota)</option>
                    <option value="prestasi_akademik">Prestasi Nilai Rapor (20% Kuota)</option>
                    <option value="prestasi_non_akademik">Prestasi Non-Akademik (5% Kuota)</option>
                    <option value="perpindahan_tugas">Perpindahan Tugas Orang Tua (5% Kuota)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMAN Pilihan Pertama (Prioritas 1):</label>
                  <select
                    value={formData.sekolah_id}
                    onChange={(e) => handleChange('sekolah_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {INITIAL_SEKOLAH.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.nama_sekolah} ({sch.kota})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SMAN Pilihan Cadangan (Prioritas 2):</label>
                  <select
                    value={formData.sekolah_cadangan_id}
                    onChange={(e) => handleChange('sekolah_cadangan_id', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {INITIAL_SEKOLAH.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.nama_sekolah}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Sudah memiliki akun terdaftar?{' '}
                <Link href="/login" className="font-bold text-[#1E3A8A] hover:underline">
                  Masuk di sini
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>{isLoading ? 'Menyimpan Data ke Supabase...' : 'Daftar Akun & Simpan Profil Lengkap'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
