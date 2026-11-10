import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogIn, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  UserCheck, 
  Cloud,
  ChevronRight
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isSupabaseReady } = useAuth();

  const [email, setEmail] = useState('siti.nurhaliza@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const dest = router.query.redirect || '/daftar';
        router.push(dest);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick helper for evaluators & judges
  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <div className="bg-[#1A1A1E] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F97316] text-white flex items-center justify-center mx-auto shadow-md">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Masuk Akun Pendaftar
            </h1>
            <p className="text-xs text-slate-400">
              Gunakan akun calon siswa untuk memantau tiket dan mencetak berkas bukti sah.
            </p>

            {/* Supabase backend status */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-[#F97316] border border-orange-500/30">
              <Cloud className="w-3 h-3 text-[#F97316]" />
              <span>{isSupabaseReady ? 'Supabase Auth Online' : 'Supabase Client Siap'}</span>
            </div>
          </div>

          {router.query.pesan === 'wajib_login' && !errorMsg && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2.5 animate-fade-in shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Akses Terbatas:</strong> Anda wajib masuk atau mendaftarkan akun terlebih dahulu sebelum dapat mengakses formulir pendaftaran SMAN.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-[#F43F5E] text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Alamat Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-[#E2E8F0] focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-300">Kata Sandi</label>
                <span className="text-[10px] text-slate-400">Min. 6 Karakter</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 font-mono text-[#E2E8F0] focus:ring-2 focus:ring-[#F97316]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#F43F5E] hover:opacity-90 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>{isLoading ? 'Memeriksa Kredensial...' : 'Masuk ke Portal Siswa'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Judges */}
          <div className="p-3.5 rounded-2xl bg-[#222227] border border-white/10 text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Uji Coba Cepat (Akun Contoh):
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoFill('siti.nurhaliza@gmail.com', 'password123')}
                className="w-full text-left p-2 rounded-xl bg-[#1A1A1E] border border-white/10 hover:border-orange-500/40 transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-[#E2E8F0] text-[11px]">Siti Nurhaliza (Zonasi Boedoet SMAN 1)</p>
                  <p className="text-[10px] text-slate-400 font-mono">siti.nurhaliza@gmail.com</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('rayhan.pratama@gmail.com', 'password123')}
                className="w-full text-left p-2 rounded-xl bg-[#1A1A1E] border border-white/10 hover:border-orange-500/40 transition flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-[#E2E8F0] text-[11px]">Rayhan Pratama (Prestasi SMAN 1)</p>
                  <p className="text-[10px] text-slate-400 font-mono">rayhan.pratama@gmail.com</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Links to Register & Admin Portal */}
          <div className="pt-2 border-t border-white/10 space-y-3 text-center text-xs">
            <p className="text-slate-400">
              Belum punya akun pendaftaran?{' '}
              <Link href="/register" className="font-black text-[#F43F5E] hover:underline">
                Daftar Calon Siswa Baru
              </Link>
            </p>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#F97316] transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Masuk sebagai Petugas / Admin Instansi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
