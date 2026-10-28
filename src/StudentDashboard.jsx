import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { useAuth } from './context/AuthContext';
import {
  GraduationCap,
  School,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Hash,
  Compass,
  Calendar,
  Sparkles,
  RefreshCw,
  Info,
  Lock,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  UserCheck,
  Building2,
  BadgeAlert,
  ArrowRight,
  File,
  Check,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

// Default mock schools for dropdown fallback if Supabase is offline
const MOCK_SCHOOLS_LIST = [
  { id: 'sch-1', name: 'SMAN 1 Jakarta', district: 'Jakarta Pusat', address: 'Jl. Budi Utomo No. 7, Pasar Baru' },
  { id: 'sch-2', name: 'SMAN 8 Jakarta', district: 'Jakarta Selatan', address: 'Jl. Taman Bukit Duri, Tebet' },
  { id: 'sch-3', name: 'SMAN 3 Bandung', district: 'Bandung Wetan', address: 'Jl. Belitung No. 8, Merdeka' },
  { id: 'sch-4', name: 'SMAN 5 Surabaya', district: 'Genteng', address: 'Jl. Kusuma Bangsa No. 21' },
  { id: 'sch-5', name: 'SMAN 68 Jakarta', district: 'Jakarta Pusat', address: 'Jl. Salemba Raya No. 18' },
  { id: 'sch-6', name: 'SMAN 70 Jakarta', district: 'Jakarta Selatan', address: 'Jl. Bulungan Blok C No. 1' }
];

// Initial demo registration for local interactive preview
const INITIAL_DEMO_STUDENT_REGISTRATIONS = [
  {
    id: 'reg-demo-1',
    school_id: 'sch-1',
    school_name: 'SMAN 1 Jakarta',
    student_name: 'Muhammad Fattah Husein',
    nisn: '1351515315',
    username: 'fattah_husein',
    path_type: 'Zonasi',
    status: 'Menunggu Verifikasi',
    documents: [
      { name: 'Kartu_Keluarga_Fattah.pdf', type: 'Kartu Keluarga', size: '1.2 MB' },
      { name: 'Ijazah_SKL_SMP.pdf', type: 'Ijazah / SKL', size: '2.4 MB' },
      { name: 'Bukti_Domisili_RT.pdf', type: 'Dokumen Jalur Zonasi', size: '980 KB' }
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
];

const PATH_OPTIONS = [
  {
    id: 'Zonasi',
    title: 'Jalur Zonasi',
    quotaBadge: 'Min. 50%',
    desc: 'Berdasarkan radius jarak domisili pada Kartu Keluarga (KK) ke sekolah tujuan.'
  },
  {
    id: 'Prestasi',
    title: 'Jalur Prestasi',
    quotaBadge: 'Kuota Tersedia',
    desc: 'Berdasarkan sertifikat kejuaraan akademik/non-akademik atau rerata nilai rapor.'
  },
  {
    id: 'Afirmasi',
    title: 'Jalur Afirmasi',
    quotaBadge: 'Min. 15%',
    desc: 'Khusus bagi siswa dari keluarga ekonomi afirmasi pemegang KIP / KJP / PKH.'
  },
  {
    id: 'Mutasi Orang Tua',
    title: 'Jalur Mutasi Orang Tua',
    quotaBadge: 'Maks. 5%',
    desc: 'Untuk siswa yang mengikuti perpindahan penugasan dinas resmi orang tua/wali.'
  }
];

/**
 * Format ISO Date string to Indonesian format
 */
const formatIndonesianDate = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timePart = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${datePart}, ${timePart} WIB`;
  } catch (e) {
    return isoString;
  }
};

export const StudentDashboard = ({ initialTab }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from prop, pathname, or search query
  const determineTab = () => {
    if (initialTab) return initialTab;
    if (location.pathname.includes('/register-school') || location.pathname.includes('/pendaftaran')) return 'pendaftaran';
    if (location.pathname.includes('/profile') || location.pathname.includes('/akun')) return 'akun';
    if (location.pathname.includes('/info') || location.pathname.includes('/status')) return 'status';
    return searchParams.get('tab') || 'status';
  };

  const activeTab = determineTab();

  const setActiveTab = (tab) => {
    if (tab === 'pendaftaran') {
      navigate('/student/register-school');
    } else if (tab === 'akun') {
      navigate('/student/profile');
    } else {
      navigate('/student/info');
    }
  };

  // State Data
  const [schools, setSchools] = useState(MOCK_SCHOOLS_LIST);
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);

  // Student Account Info (Immutable)
  const studentFullName = user?.user_metadata?.full_name || 'Muhammad Fattah Husein';
  const studentNisn = user?.user_metadata?.nisn || '1351515315';
  const studentUsername = user?.user_metadata?.username || user?.email?.split('@')[0] || 'fattah_husein';
  const studentEmail = user?.email || `${studentNisn}@siswa.smaumu.id`;

  // Form State
  const [schoolId, setSchoolId] = useState('');
  const [pathType, setPathType] = useState('Zonasi');
  const [kkFile, setKkFile] = useState(null);
  const [sklFile, setSklFile] = useState(null);
  const [pathDocFile, setPathDocFile] = useState(null);
  const [agreedIntegrity, setAgreedIntegrity] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * 1. Fetch Schools List for Dropdown
   */
  const fetchSchools = async () => {
    setIsLoadingSchools(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('schools')
          .select('id, name, district, address')
          .order('name');

        if (!error && data && data.length > 0) {
          setSchools(data);
          return;
        }
      }
      setSchools(MOCK_SCHOOLS_LIST);
    } catch (err) {
      console.warn('[StudentDashboard] Using fallback schools list:', err);
      setSchools(MOCK_SCHOOLS_LIST);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  /**
   * 2. Fetch Student Registrations (to check 1-student 1-application rule)
   */
  const fetchRegistrations = async () => {
    setIsLoadingRegistrations(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Enrich with school name if foreign key schools is missing
          const enriched = data.map((item) => {
            const foundSchool = schools.find((s) => s.id === item.school_id);
            return {
              ...item,
              school_name: item.school_name || foundSchool?.name || 'SMAN Pilihan'
            };
          });
          setRegistrations(enriched);
          return;
        }
      }

      // Local storage fallback for offline/demo mode
      const cached = localStorage.getItem('smaumu_student_registrations');
      setRegistrations(cached ? JSON.parse(cached) : INITIAL_DEMO_STUDENT_REGISTRATIONS);
    } catch (err) {
      console.warn('[StudentDashboard] Using cached registrations fallback:', err);
      const cached = localStorage.getItem('smaumu_student_registrations');
      setRegistrations(cached ? JSON.parse(cached) : INITIAL_DEMO_STUDENT_REGISTRATIONS);
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [schools, user]);

  // Check if student already has an active registration (Strict 1 Student 1 Registration rule)
  const existingRegistration = registrations.length > 0 ? registrations[0] : null;
  const hasAlreadyRegistered = Boolean(existingRegistration);

  /**
   * 3. Submit Registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (hasAlreadyRegistered) {
      setErrorMessage(
        'Sesuai regulasi PPDB, setiap akun siswa hanya diperbolehkan mendaftar satu kali.'
      );
      return;
    }

    if (!schoolId) {
      setErrorMessage('Silakan pilih salah satu SMAN tujuan pendaftaran.');
      return;
    }

    if (!pathType) {
      setErrorMessage('Silakan pilih jalur pendaftaran.');
      return;
    }

    if (!agreedIntegrity) {
      setErrorMessage('Anda wajib mencentang surat pernyataan keabsahan dokumen.');
      return;
    }

    setIsSubmitting(true);

    const targetSchool = schools.find((s) => s.id === schoolId);

    // Prepare uploaded documents metadata list
    const uploadedDocsList = [
      {
        name: kkFile?.name || 'Kartu_Keluarga_Terverifikasi.pdf',
        type: 'Kartu Keluarga (KK)',
        size: kkFile ? `${(kkFile.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB'
      },
      {
        name: sklFile?.name || 'Ijazah_SKL_SMP.pdf',
        type: 'Ijazah / SKL SMP',
        size: sklFile ? `${(sklFile.size / 1024 / 1024).toFixed(1)} MB` : '2.1 MB'
      }
    ];

    if (pathDocFile) {
      uploadedDocsList.push({
        name: pathDocFile.name,
        type: `Dokumen Pendukung (${pathType})`,
        size: `${(pathDocFile.size / 1024 / 1024).toFixed(1)} MB`
      });
    }

    const newRegistrationData = {
      id: `reg-${Date.now()}`,
      school_id: schoolId,
      school_name: targetSchool?.name || 'SMAN Pilihan',
      student_name: studentFullName,
      nisn: studentNisn,
      username: studentUsername,
      path_type: pathType,
      status: 'Menunggu Verifikasi',
      documents: uploadedDocsList,
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('registrations')
          .insert([
            {
              school_id: schoolId,
              path_type: pathType,
              student_name: studentFullName,
              nisn: studentNisn,
              documents: uploadedDocsList
            }
          ])
          .select();

        if (error) {
          console.error('[StudentDashboard] Supabase insert error:', error);
          const isMissingTable =
            error.message?.includes("table 'public.registrations' in the schema cache") ||
            error.message?.includes('schema cache');
          if (isMissingTable) {
            throw new Error(
              "Tabel 'registrations' belum dibuat di database Supabase Anda. Buka menu SQL Editor di Supabase Dashboard, lalu jalankan script dari supabase_schema.sql."
            );
          }
          throw error;
        }

        if (data && data[0]) {
          newRegistrationData.id = data[0].id;
        }
      }

      // Optimistic local update
      const updatedRegistrations = [newRegistrationData, ...registrations];
      setRegistrations(updatedRegistrations);
      localStorage.setItem(
        'smaumu_student_registrations',
        JSON.stringify(updatedRegistrations)
      );

      // Sync with Admin pool
      try {
        const adminStored = localStorage.getItem('smaumu_admin_registrations');
        const adminPool = adminStored ? JSON.parse(adminStored) : [];
        localStorage.setItem(
          'smaumu_admin_registrations',
          JSON.stringify([newRegistrationData, ...adminPool])
        );
      } catch (errPool) {
        console.warn('Sync admin pool error:', errPool);
      }

      setSuccessMessage(
        `Pendaftaran berhasil dikirim ke ${targetSchool?.name || 'SMAN Tujuan'} (${pathType})! Mengalihkan ke halaman status...`
      );

      // Reset form
      setSchoolId('');
      setKkFile(null);
      setSklFile(null);
      setPathDocFile(null);
      setAgreedIntegrity(false);

      // Auto-switch to Status tab after 1.5s
      setTimeout(() => {
        setActiveTab('status');
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      console.error('[StudentDashboard] Submit error:', err);
      setErrorMessage(err.message || 'Gagal mengirim berkas pendaftaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ========================================================= */}
      {/* TOP WELCOME HERO BANNER */}
      {/* ========================================================= */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-heading font-black bg-primary text-white shadow-sm shadow-primary/20">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-accent" />
                  Portal Siswa Resmi
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Akun Terverifikasi Dapodik
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Halo, {studentFullName} 👋
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 font-medium">
                <span className="flex items-center text-gray-700 font-bold">
                  <Hash className="w-3.5 h-3.5 mr-1 text-primary" />
                  NISN: <span className="ml-1 text-primary tracking-wider">{studentNisn}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  @{studentUsername}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-accent/40">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-accent-dark" />
                  Aturan: 1 Siswa = 1 Sekolah
                </span>
              </div>
            </div>

            {/* Quick Summary Pill on Right */}
            <div className="flex items-center space-x-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
              <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500 font-heading">
                  Status Pengajuan
                </p>
                <p className="text-sm font-heading font-black text-gray-900">
                  {hasAlreadyRegistered ? existingRegistration.status : 'Belum Mendaftar'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Global Feedback Banners */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 text-xs sm:text-sm font-medium animate-fade-in shadow-sm">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-red-900">Perhatian:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-800 text-xs sm:text-sm font-medium animate-fade-in shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-emerald-950">Berhasil:</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 1: PENDAFTARAN (FORMULIR SMAN) */}
        {/* ========================================================= */}
        {activeTab === 'pendaftaran' && (
          <div className="space-y-6">
            
            {hasAlreadyRegistered ? (
              /* ALREADY REGISTERED LOCK BANNER */
              <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-amber-300 shadow-card bg-gradient-to-br from-white via-amber-50/20 to-amber-50/40">
                <div className="max-w-2xl mx-auto text-center space-y-5">
                  
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border-2 border-accent flex items-center justify-center text-primary shadow-sm">
                    <Lock className="w-10 h-10 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-heading font-black bg-amber-100 text-amber-950 border border-amber-300">
                      Pendaftaran Telah Diajukan &bull; Status Terkunci
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-black text-gray-900">
                      Anda Telah Mendaftar ke {existingRegistration.school_name}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Sesuai regulasi sistem PPDB, <strong>satu akun siswa hanya diperbolehkan mendaftar ke 1 (satu) sekolah pilihan</strong>. Pendaftaran Anda pada <strong>{existingRegistration.path_type}</strong> telah tercatat dan tidak dapat diubah atau didaftarkan kembali.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-white border border-gray-200 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px]">SMAN Tujuan:</span>
                      <span className="font-heading font-black text-gray-900">{existingRegistration.school_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px]">Jalur Pendaftaran:</span>
                      <span className="font-heading font-black text-primary">{existingRegistration.path_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px]">Status Berkas:</span>
                      <span className="font-heading font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {existingRegistration.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('status')}
                      className="font-heading inline-flex items-center justify-center px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                    >
                      <span>Buka Status & Rincian Berkas Anda</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              /* FORM PENDAFTARAN SMAN */
              <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card">
                
                <div className="border-b border-gray-100 pb-6 mb-8">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-gray-900">
                        Formulir Pendaftaran SMAN (Apply School)
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Identitas nama dan NISN terisi otomatis dari akun Anda. Tentukan SMAN tujuan dan unggah berkas persyaratan.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* STEP 1: IDENTITAS SISWA (READONLY) */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white font-heading font-black text-xs flex items-center justify-center">
                        1
                      </span>
                      <h3 className="font-heading text-base font-bold text-gray-900">
                        Identitas Calon Siswa (Terkunci Permanen)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/90 p-4 sm:p-6 rounded-2xl border border-gray-200">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Nama Lengkap Siswa
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            disabled
                            value={studentFullName}
                            className="w-full bg-gray-100/90 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 cursor-not-allowed select-none"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 block">Terkunci sesuai akun siswa.</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Nomor Induk Siswa Nasional (NISN)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            disabled
                            value={studentNisn}
                            className="w-full bg-gray-100/90 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary tracking-wider cursor-not-allowed select-none"
                          />
                          <span className="absolute right-3 top-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                            10 Digit
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 mt-1 block font-medium flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Terdaftar di pangkalan data Kemdikbudristek.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: PILIH SMAN TUJUAN */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white font-heading font-black text-xs flex items-center justify-center">
                        2
                      </span>
                      <h3 className="font-heading text-base font-bold text-gray-900">
                        Pilih SMAN Tujuan: <span className="text-primary">*</span>
                      </h3>
                    </div>

                    <div>
                      <select
                        id="schoolId"
                        required
                        value={schoolId}
                        onChange={(e) => setSchoolId(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition shadow-sm"
                      >
                        <option value="">-- Pilih Salah Satu SMAN Tujuan --</option>
                        {schools.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.district})
                          </option>
                        ))}
                      </select>
                      
                      {schoolId && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/80 border border-accent/40 text-xs text-amber-950 flex items-start space-x-2">
                          <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold">Sekolah Terpilih: </span>
                            {schools.find((s) => s.id === schoolId)?.name} &bull;{' '}
                            <span className="text-gray-600">{schools.find((s) => s.id === schoolId)?.address}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STEP 3: PILIH JALUR PENDAFTARAN */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white font-heading font-black text-xs flex items-center justify-center">
                        3
                      </span>
                      <h3 className="font-heading text-base font-bold text-gray-900">
                        Pilih Jalur Pendaftaran (Path Type): <span className="text-primary">*</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PATH_OPTIONS.map((path) => {
                        const isSelected = pathType === path.id;
                        return (
                          <label
                            key={path.id}
                            className={`relative flex items-start p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pathType"
                              value={path.id}
                              checked={isSelected}
                              onChange={() => setPathType(path.id)}
                              className="sr-only"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-heading font-bold text-sm ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                  {path.title}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-amber-900 border border-accent/30">
                                  {path.quotaBadge}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {path.desc}
                              </p>
                            </div>
                            <div className={`w-5 h-5 ml-3 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 4: UNGGAH BERKAS-BERKAS PERSYARATAN */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white font-heading font-black text-xs flex items-center justify-center">
                          4
                        </span>
                        <h3 className="font-heading text-base font-bold text-gray-900">
                          Unggah Berkas Persyaratan PPDB: <span className="text-primary">*</span>
                        </h3>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Format: PDF/JPG/PNG (Maks. 5MB)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      {/* Dokumen 1: Kartu Keluarga */}
                      <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors bg-gray-50/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-heading font-bold text-gray-800">1. Kartu Keluarga (KK)</span>
                            <span className="text-[10px] text-primary font-bold">Wajib</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-3">
                            Scan asli KK yang masih berlaku min. 1 tahun.
                          </p>
                        </div>
                        <div>
                          {kkFile ? (
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                              <span className="truncate max-w-[120px] font-medium">{kkFile.name}</span>
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            </div>
                          ) : (
                            <label className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer transition shadow-sm">
                              <UploadCloud className="w-3.5 h-3.5 text-primary" />
                              <span>Pilih File KK</span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                                onChange={(e) => setKkFile(e.target.files?.[0] || null)}
                                className="sr-only"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Dokumen 2: Ijazah / SKL */}
                      <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors bg-gray-50/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-heading font-bold text-gray-800">2. Ijazah / SKL</span>
                            <span className="text-[10px] text-primary font-bold">Wajib</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-3">
                            Surat Keterangan Lulus (SKL) resmi dari SMP/MTs.
                          </p>
                        </div>
                        <div>
                          {sklFile ? (
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                              <span className="truncate max-w-[120px] font-medium">{sklFile.name}</span>
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            </div>
                          ) : (
                            <label className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer transition shadow-sm">
                              <UploadCloud className="w-3.5 h-3.5 text-primary" />
                              <span>Pilih File SKL</span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                                onChange={(e) => setSklFile(e.target.files?.[0] || null)}
                                className="sr-only"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Dokumen 3: Dokumen Pendukung Jalur */}
                      <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors bg-gray-50/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-heading font-bold text-gray-800">3. Berkas Jalur ({pathType})</span>
                            <span className="text-[10px] text-gray-500">Opsional/Wajib</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mb-3">
                            Piagam lomba / Kartu KIP-KJP / SK Mutasi Kerja.
                          </p>
                        </div>
                        <div>
                          {pathDocFile ? (
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                              <span className="truncate max-w-[120px] font-medium">{pathDocFile.name}</span>
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            </div>
                          ) : (
                            <label className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer transition shadow-sm">
                              <UploadCloud className="w-3.5 h-3.5 text-primary" />
                              <span>Pilih Berkas Jalur</span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setPathDocFile(e.target.files?.[0] || null)}
                                className="sr-only"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* STEP 5: SURAT PERNYATAAN INTEGRITAS */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-accent/40 space-y-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedIntegrity}
                        onChange={(e) => setAgreedIntegrity(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-xs text-amber-950 font-medium leading-relaxed">
                        Saya menyatakan secara sadar bahwa data nama, NISN, pilihan SMAN tujuan, dan seluruh berkas yang saya lampirkan adalah <strong>asli, benar, dan sah secara hukum</strong>. Saya memahami bahwa <strong>pendaftaran hanya dapat dilakukan 1 (satu) kali</strong> dan bersifat final.
                      </span>
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !agreedIntegrity}
                      className="font-heading w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md shadow-primary/25 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          <span>Mengirim Berkas Pendaftaran...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1 text-accent" />
                          <span>Kirim Pendaftaran Resmi (PPDB)</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: STATUS PENDAFTARAN */}
        {/* ========================================================= */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            
            {hasAlreadyRegistered ? (
              <div className="space-y-6">
                
                {/* 1. Main Status Card */}
                <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 font-heading">
                        Nomor Registrasi PPDB
                      </span>
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        #{existingRegistration.id.slice(0, 16)}
                      </h2>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {existingRegistration.status === 'Diterima' ? (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-heading font-black text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Diterima di SMAN Tujuan</span>
                        </div>
                      ) : existingRegistration.status === 'Ditolak' ? (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-red-100 border border-red-300 text-primary font-heading font-black text-sm">
                          <XCircle className="w-5 h-5 text-primary" />
                          <span>Belum Lulus Kuota</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 font-heading font-black text-sm shadow-sm">
                          <Clock className="w-5 h-5 text-amber-600 animate-spin" />
                          <span>Menunggu Verifikasi Sekolah</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px] mb-1">SMAN Pilihan:</span>
                      <span className="font-heading font-black text-sm text-gray-900">{existingRegistration.school_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px] mb-1">Jalur Pendaftaran:</span>
                      <span className="font-heading font-bold text-sm text-primary">{existingRegistration.path_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px] mb-1">Nama Pendaftar:</span>
                      <span className="font-heading font-bold text-sm text-gray-900">{studentFullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold uppercase text-[10px] mb-1">Waktu Submit:</span>
                      <span className="font-heading font-medium text-xs text-gray-700">
                        {formatIndonesianDate(existingRegistration.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Timeline Stepper */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-heading font-black text-sm text-gray-900 mb-6">
                      Alur Tahapan Seleksi Anda:
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                      
                      {/* Step 1 */}
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center space-x-1.5 text-emerald-800 font-heading font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>1. Pengajuan Berkas</span>
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium">Selesai terkirim ke sistem.</p>
                      </div>

                      {/* Step 2 */}
                      <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                        existingRegistration.status === 'Menunggu Verifikasi'
                          ? 'bg-amber-50/90 border-amber-300'
                          : 'bg-emerald-50/80 border-emerald-200'
                      }`}>
                        <div className="flex items-center space-x-1.5 text-amber-900 font-heading font-bold">
                          <Clock className="w-4 h-4 text-amber-700" />
                          <span>2. Verifikasi Panitia</span>
                        </div>
                        <p className="text-[11px] text-amber-800 font-medium">
                          {existingRegistration.status === 'Menunggu Verifikasi'
                            ? 'Sedang berlangsung di sekolah.'
                            : 'Dokumen telah diverifikasi.'}
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                        existingRegistration.status !== 'Menunggu Verifikasi'
                          ? 'bg-emerald-50/80 border-emerald-200'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}>
                        <div className="flex items-center space-x-1.5 font-heading font-bold text-gray-800">
                          <FileCheck className="w-4 h-4 text-gray-500" />
                          <span>3. Pemeringkatan Kuota</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">Hasil seleksi daya tampung.</p>
                      </div>

                      {/* Step 4 */}
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-1 text-gray-400">
                        <div className="flex items-center space-x-1.5 font-heading font-bold text-gray-700">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          <span>4. Daftar Ulang</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Lapor diri siswa baru.</p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* 2. Uploaded Documents List */}
                <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
                  <h3 className="font-heading text-lg font-black text-gray-900 mb-4">
                    Berkas Persyaratan yang Telah Diunggah
                  </h3>

                  <div className="divide-y divide-gray-100">
                    {(existingRegistration.documents || [
                      { name: 'Kartu_Keluarga_Fattah.pdf', type: 'Kartu Keluarga', size: '1.2 MB' },
                      { name: 'Ijazah_SKL_SMP.pdf', type: 'Ijazah / SKL', size: '2.4 MB' }
                    ]).map((doc, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-primary font-bold">
                            <File className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-heading font-bold text-gray-900 block">{doc.type}</span>
                            <span className="text-gray-500 font-medium">{doc.name} ({doc.size})</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Tersimpan di Cloud
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* EMPTY STATE IF NOT REGISTERED */
              <div className="bg-surface rounded-3xl p-10 border border-gray-200 text-center space-y-4 shadow-card">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-black text-gray-900">
                  Belum Ada Pendaftaran yang Diajukan
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Anda belum mengajukan berkas PPDB ke sekolah manapun. Buka tab <strong>Pendaftaran</strong> untuk memilih SMAN tujuan dan mengunggah berkas.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('pendaftaran')}
                    className="font-heading px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-sm"
                  >
                    Buka Formulir Pendaftaran Sekarang &rarr;
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: INFORMASI AKUN */}
        {/* ========================================================= */}
        {activeTab === 'akun' && (
          <div className="space-y-6">
            
            <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card space-y-8">
              
              <div className="border-b border-gray-100 pb-6 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white font-heading font-black text-xl flex items-center justify-center shadow-md shadow-primary/20">
                    {studentFullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-black text-gray-900">
                      Profil Akun Calon Murid
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Data identitas NISN dan Username akun bersifat permanen dan tidak dapat diubah.
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-heading font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                  Status: Terverifikasi
                </span>
              </div>

              {/* Data Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-heading">
                    Nama Lengkap Siswa
                  </span>
                  <p className="font-heading font-black text-base text-gray-900">
                    {studentFullName}
                  </p>
                  <span className="text-[10px] text-gray-400">Sesuai ijazah SMP & akta kelahiran.</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-heading">
                    Nomor Induk Siswa Nasional (NISN)
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-heading font-black text-base text-primary tracking-wider">
                      {studentNisn}
                    </p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      Kunci Permanen
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">Digunakan sebagai kredensial login siswa.</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-heading">
                    Username Akun Siswa
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-heading font-bold text-sm text-gray-900">
                      @{studentUsername}
                    </p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                      Tetap
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">Username resmi dalam ekosistem SMAUMU.</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-heading">
                    Email Akun / Pemulihan
                  </span>
                  <p className="font-heading font-medium text-sm text-gray-800">
                    {studentEmail}
                  </p>
                  <span className="text-[10px] text-gray-400">Alamat autentikasi pengiriman notifikasi.</span>
                </div>

              </div>

              {/* Policy & Security Guidance Card */}
              <div className="p-5 rounded-2xl bg-amber-50/90 border border-accent/60 space-y-2 text-xs text-amber-950">
                <div className="flex items-center font-heading font-bold text-sm text-amber-900">
                  <Info className="w-4 h-4 mr-1.5 text-accent-dark" />
                  Kebijakan Integritas PPDB SMAUMU 2026:
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed pl-1">
                  <li>Setiap siswa hanya memiliki <strong>1 akun resmi berbasis NISN</strong> yang terverifikasi ke sistem Dapodik.</li>
                  <li>Setiap akun hanya diperbolehkan mendaftar <strong>1 (satu) kali</strong> ke satu sekolah pilihan untuk menjaga transparansi dan pemerataan kuota.</li>
                  <li>Jika terdapat kekeliruan data NISN atau nama, hubungi operator sekolah asal (SMP/MTs) untuk sinkronisasi data induk.</li>
                </ul>
              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default StudentDashboard;
