import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';

/**
 * LoginStudent (Portal Masuk Calon Siswa / Pendaftar PPDB)
 * Dedicated for prospective students to access StudentDashboard (/student/info)
 */
export const LoginStudent = () => {
  const [nisnInput, setNisnInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill NISN if passed from registration redirect
  useEffect(() => {
    if (location.state?.prefilledNisn) {
      setNisnInput(location.state.prefilledNisn);
    }
  }, [location.state]);

  // If already logged in, redirect to destination or role-based dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const defaultDest = user?.user_metadata?.role === 'student' || !user?.user_metadata?.role 
        ? '/student/info' 
        : '/admin';
      const target = location.state?.from?.pathname || defaultDest;
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanInput = nisnInput.trim();
    if (!cleanInput || !password) {
      setError('Silakan masukkan NISN (10 Digit) atau Email dan kata sandi akun Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await login(cleanInput, password);
      const isStudent = data?.user?.user_metadata?.role === 'student' || !data?.user?.user_metadata?.role;
      const defaultDest = isStudent ? '/student/info' : '/admin';
      const target = location.state?.from?.pathname || defaultDest;
      navigate(target, { replace: true });
    } catch (err) {
      console.error('[LoginStudent] Error:', err);
      let msg = err.message || 'Gagal masuk ke sistem.';
      if (msg.includes('Invalid login credentials') || msg.includes('tidak cocok')) {
        msg = 'NISN atau kata sandi tidak cocok. Pastikan akun calon siswa telah didaftarkan.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Akun belum dikonfirmasi. Periksa kontak terdaftar.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (nisnValue) => {
    setNisnInput(nisnValue);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-base font-body">
      
      {/* Back to Public Portal Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Kembali ke Beranda Publik
        </Link>
      </div>

      {/* Header Badge */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25 border-2 border-accent/40 mb-4 transform hover:scale-105 transition-transform duration-200">
          <GraduationCap className="w-8 h-8 text-accent" />
        </div>

        <h1 className="font-heading text-3xl font-black text-gray-900 tracking-tight">
          Portal Masuk Siswa
        </h1>
        <p className="mt-2 text-sm text-gray-600 font-medium">
          Masuk dengan NISN atau Email untuk memantau pendaftaran & kuota SMAN
        </p>

        {/* Portal Switcher Pill */}
        <div className="mt-4 inline-flex p-1 bg-gray-200/80 rounded-2xl text-xs font-heading font-bold shadow-inner">
          <span className="py-1.5 px-4 rounded-xl bg-primary text-white shadow-sm flex items-center space-x-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-accent" />
            <span>Calon Siswa (PPDB)</span>
          </span>
          <Link
            to="/login-admin"
            className="py-1.5 px-4 rounded-xl text-gray-600 hover:text-gray-900 transition-colors"
          >
            Petugas SMAN
          </Link>
        </div>
      </div>

      {/* Login Card Form */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl shadow-card border border-gray-200/80">
          
          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-700 animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
              <div className="text-xs font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NISN / Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="student-nisn" 
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Nomor Induk Siswa Nasional (NISN)
                </label>
                <span className="text-[10px] text-primary font-bold font-mono">10 Digit Angka</span>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <span className="font-mono font-black text-sm text-primary">#</span>
                </div>
                <input
                  id="student-nisn"
                  type="text"
                  required
                  value={nisnInput}
                  onChange={(e) => setNisnInput(e.target.value.trim())}
                  placeholder="Contoh: 1234567890"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold tracking-wider focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Gunakan 10 digit NISN atau Email yang Anda daftarkan.
              </span>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="student-password" 
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="student-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Pill Shortcuts */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Akun Uji Coba Cepat (1-Klik):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('1234567890')}
                  className="text-[11px] font-heading font-bold px-2.5 py-1 rounded-lg bg-red-50 text-primary border border-primary/20 hover:bg-primary hover:text-white transition shadow-2xs"
                  title="Klik untuk mengisi NISN 1234567890"
                >
                  ⚡ NISN: 1234567890
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('1351515315')}
                  className="text-[11px] font-heading font-bold px-2.5 py-1 rounded-lg bg-red-50 text-primary border border-primary/20 hover:bg-primary hover:text-white transition shadow-2xs"
                  title="Klik untuk mengisi NISN 1351515315 (Fattah Husein)"
                >
                  ⚡ NISN: 1351515315
                </button>
              </div>
            </div>

            {/* Primary Action Button (#CE1126) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-heading w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memverifikasi Akun Siswa...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-accent" />
                    Masuk ke Portal Siswa
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Registration Link for Students */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Calon siswa belum memiliki akun?{' '}
              <Link
                to="/register"
                className="font-heading font-bold text-primary hover:text-primary-hover underline underline-offset-2 transition"
              >
                Daftar Akun Siswa Baru
              </Link>
            </p>
          </div>

          {/* Info Banner */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-accent/40 text-xs text-amber-900 space-y-1">
              <div className="flex items-center font-heading font-bold text-amber-950">
                <Info className="w-4 h-4 mr-1.5 text-accent flex-shrink-0" />
                Khusus Calon Siswa (PPDB):
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Gunakan NISN atau Email yang Anda daftarkan. Jika Anda adalah panitia/operator sekolah, silakan login melalui{' '}
                <Link to="/login-admin" className="font-bold underline text-amber-950 hover:text-primary">
                  Portal Admin SMAN
                </Link>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginStudent;
