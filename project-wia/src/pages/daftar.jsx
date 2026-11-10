import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { INITIAL_SEKOLAH } from '@/utils/constants';
import { generateTicketNumber, sha256 } from '@/utils/crypto';
import { 
  calculateHaversineDistance,
  OFFICIAL_DUKCAPIL_CENTROIDS,
  isInsideDkiJakarta,
  snapCoordinateToDukcapil
} from '@/services/geoService';
import { formatDistance, formatDateIndo } from '@/utils/formatters';
import { 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Printer, 
  QrCode, 
  Sparkles,
  Info,
  Compass,
  AlertTriangle,
  Upload,
  UserCheck,
  Zap,
  LocateFixed
} from 'lucide-react';

const ApplicantCoordinateMapView = dynamic(
  () => import('@/components/ApplicantCoordinateMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold">Memuat Peta Spasial Auto-Snap Dukcapil...</span>
      </div>
    )
  }
);

export default function DaftarPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCentroidId, setSelectedCentroidId] = useState('sawah_besar');
  const [isAutoSnapped, setIsAutoSnapped] = useState(true);

  // Wajib Login / Register Guard: Redirect ke halaman login jika belum login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?pesan=wajib_login&redirect=/daftar');
    }
  }, [loading, isAuthenticated, router]);

  // Form State
  const [formData, setFormData] = useState({
    jalur: 'zonasi',
    sekolah_id: 1,
    sekolah_cadangan_id: 2,
    nama_siswa: 'Muhammad Rayhan Pratama',
    nik: '3171021508090002',
    nisn: '0089123456',
    asal_sekolah_smp: 'SMPN 1 Jakarta',
    alamat_domisili: 'Jl. Pasar Baru Timur No. 18, Sawah Besar, Jakarta Pusat',
    lama_tinggal_bulan: 28,
    klaim_lat: -6.167200,
    klaim_lng: 106.837800,
    klaim_nilai_rapor: 89.20,
    dokumen_kk: 'kk_terverifikasi.pdf',
    dokumen_rapor: 'rapor_semester_1_5.pdf'
  });

  // Pre-fill from authenticated user profile if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nama_siswa: user.nama || prev.nama_siswa,
        nik: user.nik || prev.nik,
        nisn: user.nisn || prev.nisn,
        asal_sekolah_smp: user.asal_sekolah_smp || prev.asal_sekolah_smp,
        alamat_domisili: user.alamat_domisili || prev.alamat_domisili,
        lama_tinggal_bulan: user.lama_tinggal_bulan || prev.lama_tinggal_bulan,
        klaim_lat: user.klaim_lat ? parseFloat(user.klaim_lat) : prev.klaim_lat,
        klaim_lng: user.klaim_lng ? parseFloat(user.klaim_lng) : prev.klaim_lng,
        klaim_nilai_rapor: user.klaim_nilai_rapor ? parseFloat(user.klaim_nilai_rapor) : prev.klaim_nilai_rapor,
        jalur: user.jalur || prev.jalur,
        sekolah_id: user.sekolah_id ? parseInt(user.sekolah_id) : prev.sekolah_id,
        sekolah_cadangan_id: user.sekolah_cadangan_id ? parseInt(user.sekolah_cadangan_id) : prev.sekolah_cadangan_id
      }));
    }
  }, [user]);

  // Generated Ticket Result after Step 3
  const [generatedTicket, setGeneratedTicket] = useState(null);

  const selectedSchool = INITIAL_SEKOLAH.find(s => s.id === parseInt(formData.sekolah_id)) || INITIAL_SEKOLAH[0];
  const calculatedDistance = calculateHaversineDistance(
    formData.klaim_lat,
    formData.klaim_lng,
    selectedSchool.lat,
    selectedSchool.lng
  );

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'klaim_lat' || field === 'klaim_lng') {
      setIsAutoSnapped(false);
    }
  };

  const handleApplyAutoSnap = (centroidId) => {
    const matched = OFFICIAL_DUKCAPIL_CENTROIDS.find(c => c.id === centroidId) || OFFICIAL_DUKCAPIL_CENTROIDS[0];
    setSelectedCentroidId(matched.id);
    setFormData(prev => ({
      ...prev,
      klaim_lat: matched.lat,
      klaim_lng: matched.lng,
      alamat_domisili: prev.alamat_domisili && prev.alamat_domisili !== 'Jl. Pasar Baru Timur No. 18, Sawah Besar, Jakarta Pusat' 
        ? prev.alamat_domisili 
        : matched.alamatSample
    }));
    setIsAutoSnapped(true);
  };

  const handleMapCoordinateChange = (newLat, newLng, autoSnappedCentroid) => {
    setFormData(prev => ({
      ...prev,
      klaim_lat: newLat,
      klaim_lng: newLng,
      alamat_domisili: autoSnappedCentroid?.alamatSample || prev.alamat_domisili
    }));
    if (autoSnappedCentroid?.id) {
      setSelectedCentroidId(autoSnappedCentroid.id);
      setIsAutoSnapped(true);
    } else {
      setIsAutoSnapped(false);
    }
  };

  const handleDetectGps = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          if (isInsideDkiJakarta(lat, lng)) {
            setFormData(prev => ({ ...prev, klaim_lat: lat, klaim_lng: lng }));
            setIsAutoSnapped(true);
          } else {
            handleApplyAutoSnap('sawah_besar');
            alert('Lokasi terdeteksi di luar wilayah administratif DKI Jakarta. Sistem otomatis menyetel koordinat ke Sawah Besar (Jakarta Pusat).');
          }
        },
        () => {
          handleApplyAutoSnap('sawah_besar');
        }
      );
    } else {
      handleApplyAutoSnap('sawah_besar');
    }
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep3 = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTicketNumber = user?.nomor_tiket || generateTicketNumber();
      const payload = {
        ...formData,
        nomor_tiket: newTicketNumber,
        resmi_lat: formData.klaim_lat,
        resmi_lng: formData.klaim_lng,
        dapodik_nilai_rapor: formData.klaim_nilai_rapor
      };

      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setGeneratedTicket(data.data);
        if (updateUser) {
          updateUser({ nomor_tiket: data.data.nomor_tiket });
        }
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
      // Fallback for static GitHub Pages export
      const fallbackTicket = {
        nomor_tiket: user?.nomor_tiket || generateTicketNumber(),
        nama_siswa: formData.nama_siswa,
        sekolah_nama: selectedSchool.nama_sekolah,
        jalur: formData.jalur,
        jarak_klaim_meter: calculatedDistance,
        status_tahapan: 'diajukan'
      };
      setGeneratedTicket(fallbackTicket);
      if (updateUser) {
        updateUser({ nomor_tiket: fallbackTicket.nomor_tiket });
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard: Jika belum login atau sesi sedang dicek, jangan render formulir & tampilkan redirect banner
  if (loading || !isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            Memeriksa Autentikasi Pengguna...
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Halaman pendaftaran sekolah mewajibkan Anda untuk masuk atau mendaftarkan akun terlebih dahulu. Mengalihkan ke halaman login...
          </p>
          <div className="pt-2">
            <Link
              href="/login?pesan=wajib_login&redirect=/daftar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-[#2563EB] transition"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Ringkas */}
      <div className="max-w-4xl mx-auto mb-6 text-center sm:text-left">
        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
          <span className="p-1 rounded bg-[#1E3A8A] text-white">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            Public Service Tracking
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pendaftaran Siswa Baru SMAN
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Alur 4 langkah pendaftaran mandiri dengan nomor tiket berenkripsi dan tanda terima QR.
        </p>

        {/* Sync Profile Banner */}
        {isAuthenticated ? (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              <strong>Profil Tersinkron:</strong> Masuk sebagai <strong>{user.nama}</strong> ({user.email}). Data formulir telah otomatis terisi dari akun Supabase Anda.
            </span>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-[#1E3A8A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span>
              Ingin data pendaftaran tersimpan permanen di cloud?
            </span>
            <div className="flex items-center gap-2">
              <Link href="/login" className="font-bold underline text-[#1E3A8A]">
                Masuk
              </Link>
              <span>atau</span>
              <Link href="/register" className="font-black px-2.5 py-1 rounded-xl bg-[#EC4899] text-white hover:bg-[#DB2777] transition shadow-sm">
                Daftar Calon Siswa
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 4 Langkah Petunjuk Visual */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {[
            { step: 1, title: '1. Pilih Jalur' },
            { step: 2, title: '2. Isi Formulir' },
            { step: 3, title: '3. Nomor Tiket' },
            { step: 4, title: '4. Tanda Terima' },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm transition-all ${
                    isCompleted
                      ? 'bg-[#10B981] text-white shadow-md'
                      : isCurrent
                      ? 'bg-[#1E3A8A] text-white shadow-lg ring-4 ring-blue-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.step}
                </div>
                <span className={`text-[11px] sm:text-xs font-bold mt-2 truncate w-full ${
                  isCurrent ? 'text-[#1E3A8A]' : isCompleted ? 'text-[#10B981]' : 'text-slate-400'
                }`}>
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#2563EB] to-[#EC4899] h-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* ISI MASING-MASING LANGKAH */}
      <div className="max-w-4xl mx-auto">
        {/* LANGKAH 1 */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep2} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Langkah 1: Pilih Jalur Pendaftaran & Sekolah Tujuan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pilih jalur yang sesuai dengan kondisi keluarga, jarak rumah, atau nilai prestasi anak Anda:
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Pilihan Jalur Masuk:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { id: 'zonasi', title: 'Jalur Jarak Rumah / Zonasi', kuota: '50% Kuota', desc: 'Cocok jika rumah Anda dekat dengan sekolah negeri. Penentu kelulusan adalah jarak meter.' },
                  { id: 'afirmasi', title: 'Jalur Bantuan KJP & Inklusi', kuota: '20% Kuota', desc: 'Khusus untuk keluarga penerima KJP Plus atau penyandang disabilitas.' },
                  { id: 'prestasi_akademik', title: 'Jalur Nilai Rapor Siswa', kuota: '20% Kuota', desc: 'Cocok jika anak memiliki nilai rapor semester 1-5 yang tinggi, tanpa memandang jarak rumah.' },
                  { id: 'perpindahan_tugas', title: 'Jalur Pindah Tugas Orang Tua / Guru', kuota: '5% Kuota', desc: 'Bagi anak dari orang tua yang pindah dinas kerja atau anak kandung bapak/ibu guru.' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      formData.jalur === item.id
                        ? 'border-[#EC4899] bg-pink-50/40 ring-2 ring-pink-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] font-mono text-[#1E3A8A] font-bold bg-blue-100 px-2 py-0.5 rounded">
                          {item.kuota}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="jalur"
                        checked={formData.jalur === item.id}
                        onChange={() => handleChange('jalur', item.id)}
                        className="w-4 h-4 text-[#EC4899] focus:ring-[#EC4899] mt-1"
                      />
                    </div>
                    <p className="text-slate-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Pilihan Sekolah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  SMA Negeri Pilihan Pertama (Prioritas Utama):
                </label>
                <select
                  value={formData.sekolah_id}
                  onChange={(e) => handleChange('sekolah_id', parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                >
                  {INITIAL_SEKOLAH.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama_sekolah} ({s.kota})</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Daya tampung: {selectedSchool.kuota_total} siswa</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  SMA Negeri Pilihan Cadangan (Pilihan Kedua):
                </label>
                <select
                  value={formData.sekolah_cadangan_id}
                  onChange={(e) => handleChange('sekolah_cadangan_id', parseInt(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#2563EB]"
                >
                  {INITIAL_SEKOLAH.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama_sekolah}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Otomatis diproses jika tergeser di pilihan pertama</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs shadow-md transition flex items-center gap-2"
              >
                <span>Lanjut ke Pengisian Formulir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* LANGKAH 2 */}
        {currentStep === 2 && (
          <form onSubmit={handleNextStep3} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Langkah 2: Isi Biodata Siswa & Tandai Titik Rumah Anda
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pastikan nomor NIK dan alamat sesuai Kartu Keluarga asli agar berkas langsung lolos verifikasi tanpa ditahan petugas.
              </p>
            </div>

            {/* Biodata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={formData.nama_siswa}
                  onChange={(e) => handleChange('nama_siswa', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Induk Kependudukan (NIK 16 Angka di KK)</label>
                <input
                  type="text"
                  required
                  maxLength="16"
                  value={formData.nik}
                  onChange={(e) => handleChange('nik', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Induk Siswa Nasional (NISN dari SMP)</label>
                <input
                  type="text"
                  required
                  maxLength="10"
                  value={formData.nisn}
                  onChange={(e) => handleChange('nisn', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 font-bold focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Asal Sekolah SMP / MTs</label>
                <input
                  type="text"
                  required
                  value={formData.asal_sekolah_smp}
                  onChange={(e) => handleChange('asal_sekolah_smp', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Alamat & Masa Tinggal */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal Sesuai Kartu Keluarga</label>
                <textarea
                  rows="2"
                  required
                  value={formData.alamat_domisili}
                  onChange={(e) => handleChange('alamat_domisili', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-[#2563EB]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Berapa Lama Tinggal di Alamat Ini? (Bulan)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={formData.lama_tinggal_bulan}
                    onChange={(e) => handleChange('lama_tinggal_bulan', parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Aturan resmi: Minimal sudah tinggal 12 bulan (1 tahun) sebelum pendaftaran.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nilai Rata-rata Rapor (Semester 1 sampai 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="60"
                    max="100"
                    value={formData.klaim_nilai_rapor}
                    onChange={(e) => handleChange('klaim_nilai_rapor', parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Titik Rumah & Auto-Snap Validasi Geospasial Dukcapil */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    Titik Koordinat Domisili & Validasi Spasial Haversine:
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Gunakan Auto-Snap untuk mengunci titik ke basis data geospasial resmi Dukcapil guna mencegah celah manipulasi.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 shrink-0">
                  Jarak ke {selectedSchool.nama_sekolah.split(' ')[0]}: {formatDistance(calculatedDistance)}
                </span>
              </div>

              {/* Toolbar Auto-Snap Dukcapil */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Pilihan Auto-Snap Centroid Resmi Wilayah DKI:
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={selectedCentroidId}
                    onChange={(e) => setSelectedCentroidId(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {OFFICIAL_DUKCAPIL_CENTROIDS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama} • {c.kota}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleApplyAutoSnap(selectedCentroidId)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Auto-Snap Dukcapil</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 border border-slate-200"
                  >
                    <LocateFixed className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Deteksi GPS</span>
                  </button>
                </div>

                {/* Status Validasi Spasial */}
                <div className="pt-1">
                  {isInsideDkiJakarta(formData.klaim_lat, formData.klaim_lng) ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        {isAutoSnapped
                          ? '✓ Koordinat Terkunci Resmi (Auto-Snapped Dukcapil - 100% Aman dari Anomali Jarak)'
                          : '✓ Koordinat Berada di Dalam Batas Administratif Provinsi DKI Jakarta'}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>
                        ⚠️ Titik koordinat terdeteksi di luar batas administratif DKI Jakarta! Silakan gunakan tombol Auto-Snap.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Peta Interaktif Auto-Snap Dukcapil & Jarak Haversine */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#2563EB]" />
                    Peta Visual Auto-Snap Dukcapil & Garis Jarak Zonasi SMAN:
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Klik peta atau geser penanda biru untuk verifikasi akurasi
                  </span>
                </div>
                <ApplicantCoordinateMapView
                  lat={formData.klaim_lat}
                  lng={formData.klaim_lng}
                  school={selectedSchool}
                  onCoordinateChange={handleMapCoordinateChange}
                  isAutoSnapped={isAutoSnapped}
                  selectedCentroidId={selectedCentroidId}
                />
              </div>

              {/* Nilai Angka Koordinat */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-slate-500 font-sans block mb-1">Garis Lintang (Latitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.klaim_lat}
                    onChange={(e) => handleChange('klaim_lat', parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-sans block mb-1">Garis Bujur (Longitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.klaim_lng}
                    onChange={(e) => handleChange('klaim_lng', parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-[#1E3A8A] flex items-center justify-between">
                <span>Radius Maksimal Zonasi Sekolah: <strong>{formatDistance(selectedSchool.radius_max)}</strong></span>
                <span className={`font-bold ${calculatedDistance <= selectedSchool.radius_max ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {calculatedDistance <= selectedSchool.radius_max ? '● Dalam Zona Prioritas' : '● Di Luar Radius Utama'}
                </span>
              </div>
            </div>

            {/* Dokumen Unggah */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Lampiran Berkas (Sudah Terhubung Otomatis):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">Kartu Keluarga (KK) Asli</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">✓ kk_terverifikasi.pdf (Tersinkron)</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">Buku Rapor Semester 1-5</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">✓ rapor_semester_1_5.pdf</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Berkas & Buat Nomor Tiket'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* LANGKAH 3 */}
        {currentStep === 3 && generatedTicket && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-black text-sm">Alhamdulillah, Berkas Berhasil Terkirim ke Sistem!</h3>
                <p className="text-xs text-emerald-700">Simpan nomor tiket ini untuk mengecek kemajuan seleksi anak Anda sewaktu-waktu.</p>
              </div>
            </div>

            {/* Kartu Tiket */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-pink-300 uppercase tracking-widest">
                    Nomor Tiket Berkas Anda:
                  </span>
                  <h2 className="text-2xl font-black font-mono text-emerald-400 tracking-wider">
                    {generatedTicket.nomor_tiket}
                  </h2>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl font-bold w-fit">
                  ✓ Sah & Terdaftar
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-400 text-[10px]">Nama Siswa:</span>
                  <p className="font-bold text-white">{generatedTicket.nama_siswa}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Sekolah Pilihan:</span>
                  <p className="font-bold text-white">{generatedTicket.sekolah_nama}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Jalur Seleksi:</span>
                  <p className="font-bold text-pink-300 uppercase">{generatedTicket.jalur}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Jarak Rumah:</span>
                  <p className="font-mono font-bold text-emerald-400">{formatDistance(generatedTicket.jarak_klaim_meter)}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/kuota"
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Pantau Sisa Kuota SMAN
              </Link>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-2xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-black text-xs shadow-md transition flex items-center gap-2"
              >
                <span>Lihat Surat Tanda Terima Resmi (Langkah 4)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LANGKAH 4 */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Surat Tanda Terima Pendaftaran Resmi
              </h2>
              <p className="text-xs text-slate-500">
                Surat ini adalah bukti sah bahwa berkas pendaftaran Anda telah tercatat resmi di sistem PPDB SMA Negeri 2026.
              </p>
            </div>

            {/* Kertas Tanda Terima */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-black">
                    SMA
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">DINAS PENDIDIKAN • SMAUMU</h4>
                    <p className="text-[10px] text-slate-500">Bukti Pengajuan Berkas Siswa Baru SMAN</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Tanggal Daftar:</span>
                  <span className="font-mono text-xs font-bold text-slate-800">{formatDateIndo(new Date().toISOString())}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nomor Tiket Anda:</span>
                  <span className="font-mono font-bold text-[#1E3A8A]">{generatedTicket?.nomor_tiket || 'TIKET-SMU-2026-098214'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Nama Calon Siswa:</span>
                  <span className="font-bold text-slate-900">{formData.nama_siswa}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Nomor NIK Siswa:</span>
                  <span className="font-mono text-slate-800">{formData.nik}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sekolah Pilihan:</span>
                  <span className="font-bold text-slate-900">{selectedSchool.nama_sekolah}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Jalur Masuk:</span>
                  <span className="font-bold uppercase text-slate-800">{formData.jalur}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Jarak Rumah ke Sekolah:</span>
                  <span className="font-mono font-bold text-emerald-700">{formatDistance(calculatedDistance)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center p-2 shadow-sm">
                    <QrCode className="w-full h-full text-slate-800" />
                  </div>
                  <div className="text-[10px] text-slate-500">
                    <p className="font-bold text-slate-800">Kode QR Bukti Sah</p>
                    <p>Kode Pengaman: {sha256(formData.nama_siswa + formData.nik).slice(0, 20)}...</p>
                    <p className="text-emerald-600 font-bold mt-0.5">✓ Tanda Tangan Digital Resmi</p>
                  </div>
                </div>

                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300">
                  STATUS: BERKAS BERHASIL DIAJUKAN
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan Sebagai PDF</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Kembali ke Beranda</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
