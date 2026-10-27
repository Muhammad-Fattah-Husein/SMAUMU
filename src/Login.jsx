import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2, ShieldCheck, Info } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/admin';

  // If already logged in, redirect to admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      // Translate common Supabase error messages to friendly Indonesian
      let msg = err.message || 'Gagal masuk ke sistem.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Email atau kata sandi tidak sesuai. Pastikan akun admin telah terdaftar di Supabase Auth.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Email belum dikonfirmasi. Periksa kotak masuk email Anda atau matikan konfirmasi email di Supabase.';
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base font-body">
      {/* Back to Public Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Kembali ke Dashboard Publik
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Indonesian National Theme Brand Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25 border-2 border-accent/40 mb-4">
          <ShieldCheck className="w-8 h-8 text-accent" />
        </div>

        <h1 className="font-heading text-3xl font-black text-gray-900 tracking-tight">
          Portal Admin SMAN
        </h1>
        <p className="mt-2 text-sm text-gray-600 font-medium">
          Masuk dengan akun terverifikasi untuk memperbarui daya tampung & kuota PPDB real-time.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Clean White Card (#FFFFFF) on Base Background (#F8F9FA) */}
        <div className="bg-surface py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-gray-200/80">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 text-xs font-medium">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Email Petugas SMAN
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.sman1@sekolah.id"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Primary Action Button (#CE1126) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-heading w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Masuk ke Dashboard Admin'
              )}
            </button>
          </form>

          {/* Civic-Tech Supabase Auth Guidance Card */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-accent/40 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center font-heading font-bold text-amber-950">
                <Info className="w-4 h-4 mr-1.5 text-accent-dark flex-shrink-0" />
                Petunjuk Autentikasi Supabase:
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900">
                Gunakan kredensial email & password pengguna yang telah terdaftar di panel <strong className="font-semibold">Supabase Auth (Users)</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
