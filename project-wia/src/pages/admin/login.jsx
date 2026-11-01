import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Lock, User, KeyRound, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState('admin.disdik@smaumu.go.id');
  const [password, setPassword] = useState('admin12345');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Kredensial tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Portal Admin Instansi
          </h2>
          <p className="text-xs text-slate-500">
            Akses Terbatas: Dinas Pendidikan & Tim Verifikator Independen
          </p>
        </div>

        {/* Pemberitahuan Tidak Ada Registrasi Admin */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" /> Otorisasi Pegawai Dinas:
          </p>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Tidak ada pendaftaran publik untuk peran Admin. Akun admin dan verifikator diterbitkan secara terenkripsi oleh Dinas Pendidikan.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Kredensial Uji Coba Penjurian:
          </p>
          <p className="font-mono text-[11px] text-slate-700">Email: admin.disdik@smaumu.go.id</p>
          <p className="font-mono text-[11px] text-slate-700">Sandi: admin12345</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-[#DB2777] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Kedinasan (NIP Terhubung)</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#2563EB] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Kata Sandi Rahasia</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-[#2563EB] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Mengautentikasi...' : 'Masuk ke Dashboard Instansi'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link href="/login" className="text-slate-500 hover:text-slate-800 font-medium">
            Masuk sebagai Siswa
          </Link>
          <Link href="/" className="text-[#1E3A8A] hover:text-[#2563EB] font-bold">
            ← Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
