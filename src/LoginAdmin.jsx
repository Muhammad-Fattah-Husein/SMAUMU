import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Loader2,
  GraduationCap,
  ShieldAlert,
  Info
} from 'lucide-react';

/**
 * LoginAdmin (Portal Petugas Admin SMAN)
 * Dedicated for verified school administrators to access AdminDashboard (/admin)
 */
export const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to destination or role-based dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const defaultDest = user?.user_metadata?.role === 'student' ? '/student' : '/admin';
      const target = location.state?.from?.pathname || defaultDest;
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Silakan isi email petugas dan kata sandi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await login(email, password);
      const isStudent = data?.user?.user_metadata?.role === 'student';
      const defaultDest = isStudent ? '/student' : '/admin';
      const target = location.state?.from?.pathname || defaultDest;
      navigate(target, { replace: true });
    } catch (err) {
      console.error('[LoginAdmin] Error:', err);
      let msg = err.message || 'Gagal masuk ke sistem admin.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Email atau kata sandi petugas tidak valid. Pastikan akun operator telah didaftarkan pada sistem dinas.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Email petugas belum diverifikasi.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
          <ShieldCheck className="w-8 h-8 text-accent" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-primary border border-red-200 mb-2">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span>Akses Terbatas: Operator SMAN</span>
        </div>

        <h1 className="font-heading text-3xl font-black text-gray-900 tracking-tight">
          Portal Petugas Admin SMAN
        </h1>
        <p className="mt-2 text-sm text-gray-600 font-medium">
          Masuk dengan akun terverifikasi untuk memperbarui daya tampung, kuota PPDB, & verifikasi pendaftar.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Role Switcher Tabs */}
        <div className="flex p-1 bg-gray-200/80 rounded-2xl mb-5 shadow-inner">
          <Link
            to="/login"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-heading font-semibold text-gray-600 hover:text-gray-900 flex items-center justify-center space-x-1.5 transition-all"
            title="Beralih ke Portal Calon Siswa"
          >
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span>Calon Siswa</span>
          </Link>
          <button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-heading font-black bg-white text-primary shadow-sm flex items-center justify-center space-x-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span>Petugas Admin</span>
          </button>
        </div>

        {/* Clean White Card (#FFFFFF) on Base Background (#F8F9FA) */}
        <div className="bg-surface py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-gray-200/80">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 text-xs font-medium animate-fade-in">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Email Petugas SMAN
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.sman1@sekolah.id"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Kata Sandi Petugas
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                    Memverifikasi Hak Akses...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2 text-accent" />
                    Masuk ke Dashboard Admin
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Student Portal */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Bukan pengurus sekolah?{' '}
              <Link
                to="/login"
                className="font-heading font-bold text-primary hover:text-primary-hover underline underline-offset-2 transition"
              >
                Masuk ke Portal Siswa di sini
              </Link>
            </p>
          </div>

          {/* Admin Policy Notice */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-accent/40 text-xs text-amber-900 space-y-1">
              <div className="flex items-center font-heading font-bold text-amber-950">
                <Info className="w-4 h-4 mr-1.5 text-accent-dark flex-shrink-0" />
                Ketentuan Akun Operator Sekolah:
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Akun admin sekolah telah didaftarkan melalui koordinasi sistem dinas (pra-provisi). Tidak disediakan pendaftaran akun admin secara mandiri.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
