import { createClient } from '@supabase/supabase-js';
import { INITIAL_SEKOLAH } from '@/utils/constants';

// Retrieve credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to determine if real Supabase credentials have been configured
export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Create the Supabase client instance (or a dummy client if not yet configured)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Register User (Masyarakat / Siswa)
 * STRICTLY restricted to role 'masyarakat'. NO admin registration allowed.
 */
export async function registerMasyarakatUser(userData) {
  const {
    email,
    password,
    nama_siswa,
    nik,
    nisn,
    nomor_telepon,
    asal_sekolah_smp,
    alamat_domisili,
    lama_tinggal_bulan,
    klaim_lat,
    klaim_lng,
    klaim_nilai_rapor,
    sertifikat_prestasi,
    jalur,
    sekolah_id,
    sekolah_cadangan_id
  } = userData;

  // Strict Security Check: Enforce user role only
  const peran = 'masyarakat';

  // 1. Try Supabase Auth if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama: nama_siswa,
            peran: 'masyarakat',
            nik,
            nisn,
            nomor_telepon
          }
        }
      });

      if (authError) throw authError;

      // Also persist to 'pengguna' table if table exists
      const { error: profileError } = await supabase
        .from('pengguna')
        .upsert([
          {
            email,
            nama: nama_siswa,
            peran: 'masyarakat',
            nomor_telepon,
            is_aktif: true
          }
        ], { onConflict: 'email' });

      if (profileError) {
        console.warn('Could not insert to pengguna table (check RLS):', profileError.message);
      }

      // If user provided school choices, also record in 'pendaftaran'
      if (sekolah_id && authData.user) {
        const ticketNumber = `TIKET-SMU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        await supabase.from('pendaftaran').insert([
          {
            nomor_tiket: ticketNumber,
            nama_siswa,
            nik,
            nisn,
            asal_sekolah_smp,
            alamat_domisili,
            lama_tinggal_bulan: parseInt(lama_tinggal_bulan) || 12,
            klaim_koordinat_lat: parseFloat(klaim_lat) || -6.2,
            klaim_koordinat_lng: parseFloat(klaim_lng) || 106.8,
            klaim_nilai_rapor: parseFloat(klaim_nilai_rapor) || 85.0,
            jalur: jalur || 'zonasi',
            sekolah_id: parseInt(sekolah_id) || 1,
            status_tahapan: 'diajukan'
          }
        ]);
      }

      return {
        success: true,
        user: {
          id: authData.user?.id || Date.now(),
          email,
          nama: nama_siswa,
          peran: 'masyarakat',
          nik,
          nisn,
          nomor_telepon,
          asal_sekolah_smp,
          alamat_domisili,
          lama_tinggal_bulan,
          klaim_lat,
          klaim_lng,
          klaim_nilai_rapor,
          sertifikat_prestasi,
          jalur,
          sekolah_id,
          sekolah_cadangan_id
        },
        mode: 'supabase'
      };
    } catch (err) {
      console.warn('Supabase registration error, falling back to local registration:', err?.message || err);
    }
  }

  // 2. Offline / Demo Fallback Mode (Runs without requiring live database credentials)
  const localUser = {
    id: `local-usr-${Date.now()}`,
    email,
    nama: nama_siswa,
    peran: 'masyarakat',
    nik,
    nisn,
    nomor_telepon,
    asal_sekolah_smp,
    alamat_domisili,
    lama_tinggal_bulan: parseInt(lama_tinggal_bulan) || 12,
    klaim_lat: parseFloat(klaim_lat) || -6.2088,
    klaim_lng: parseFloat(klaim_lng) || 106.8456,
    klaim_nilai_rapor: parseFloat(klaim_nilai_rapor) || 85.0,
    sertifikat_prestasi: sertifikat_prestasi || '0',
    jalur: jalur || 'zonasi',
    sekolah_id: parseInt(sekolah_id) || 1,
    sekolah_cadangan_id: parseInt(sekolah_cadangan_id) || 2,
    nomor_tiket: `TIKET-SMU-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    created_at: new Date().toISOString()
  };

  // Store in browser localStorage
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('smaumu_local_users') || '[]');
    existing.push({ ...localUser, password });
    localStorage.setItem('smaumu_local_users', JSON.stringify(existing));
  }

  return {
    success: true,
    user: localUser,
    mode: 'local_demo'
  };
}

/**
 * Login User (Masyarakat)
 */
export async function loginMasyarakatUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();

  // 1. Built-in seed user fallback (Guaranteed to work 100% offline & online)
  const demoAccounts = {
    'siti.nurhaliza@gmail.com': {
      id: 4,
      email: 'siti.nurhaliza@gmail.com',
      nama: 'Siti Nurhaliza (Orang Tua)',
      nama_siswa: 'Aditya Pratama Putra',
      peran: 'masyarakat',
      nik: '3171012304090001',
      nisn: '0089123456',
      nomor_telepon: '081299882026',
      asal_sekolah_smp: 'SMPN 1 Jakarta',
      alamat_domisili: 'Jl. Pasar Baru Timur No. 18, Sawah Besar, Jakarta Pusat',
      lama_tinggal_bulan: 28,
      klaim_lat: -6.167200,
      klaim_lng: 106.837800,
      klaim_nilai_rapor: 89.20,
      jalur: 'zonasi',
      sekolah_id: 1,
      sekolah_cadangan_id: 2,
      nomor_tiket: 'TIKET-SMU-2026-098214'
    },
    'wali.siswa@gmail.com': {
      id: 4,
      email: 'wali.siswa@gmail.com',
      nama: 'Siti Nurhaliza (Orang Tua)',
      nama_siswa: 'Aditya Pratama Putra',
      peran: 'masyarakat',
      nik: '3171012304090001',
      nisn: '0089123456',
      nomor_telepon: '081299882026',
      asal_sekolah_smp: 'SMPN 1 Jakarta',
      alamat_domisili: 'Jl. Pasar Baru Timur No. 18, Sawah Besar, Jakarta Pusat',
      lama_tinggal_bulan: 28,
      klaim_lat: -6.167200,
      klaim_lng: 106.837800,
      klaim_nilai_rapor: 89.20,
      jalur: 'zonasi',
      sekolah_id: 1,
      sekolah_cadangan_id: 2,
      nomor_tiket: 'TIKET-SMU-2026-098214'
    },
    'rayhan.pratama@gmail.com': {
      id: 'user-demo-rayhan',
      email: 'rayhan.pratama@gmail.com',
      nama: 'Rayhan Pratama',
      nama_siswa: 'Muhammad Rayhan Pratama',
      peran: 'masyarakat',
      nik: '3171021508090002',
      nisn: '0081293847',
      nomor_telepon: '081388772211',
      asal_sekolah_smp: 'SMPN 2 Jakarta',
      alamat_domisili: 'Jl. Gambir Selatan No. 5, Gambir, Jakarta Pusat',
      lama_tinggal_bulan: 36,
      klaim_lat: -6.175110,
      klaim_lng: 106.827153,
      klaim_nilai_rapor: 92.40,
      jalur: 'prestasi_akademik',
      sekolah_id: 1,
      sekolah_cadangan_id: 2,
      nomor_tiket: 'TIKET-SMU-2026-098215'
    },
    'budi.wicak@gmail.com': {
      id: 5,
      email: 'budi.wicak@gmail.com',
      nama: 'Budi Wicaksono',
      nama_siswa: 'Dimas Wicaksono',
      peran: 'masyarakat',
      nik: '3171034401080003',
      nisn: '0085432109',
      nomor_telepon: '081234567890',
      asal_sekolah_smp: 'SMPN 115 Jakarta',
      alamat_domisili: 'Jl. Tebet Barat Raya No. 42, Jakarta Selatan',
      lama_tinggal_bulan: 18,
      klaim_lat: -6.234560,
      klaim_lng: 106.852300,
      klaim_nilai_rapor: 86.00,
      jalur: 'zonasi',
      sekolah_id: 2,
      sekolah_cadangan_id: 3,
      nomor_tiket: 'TIKET-SMU-2026-098216'
    }
  };

  if (demoAccounts[cleanEmail]) {
    if (password === 'password123') {
      return {
        success: true,
        user: demoAccounts[cleanEmail],
        mode: 'demo_preset'
      };
    }
    throw new Error('Kata sandi yang Anda masukkan salah.');
  }

  // 2. Try Supabase Auth if configured (for live registered users)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        const userMeta = data.user.user_metadata || {};
        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email,
            nama: userMeta.nama || data.user.email.split('@')[0],
            peran: userMeta.peran || 'masyarakat',
            nik: userMeta.nik || '',
            nisn: userMeta.nisn || '',
            nomor_telepon: userMeta.nomor_telepon || ''
          },
          mode: 'supabase'
        };
      }
    } catch (err) {
      console.warn('Supabase login check failed, falling back to local users check:', err?.message || err);
    }
  }

  // 3. Fallback: Check local registered users in localStorage
  if (typeof window !== 'undefined') {
    const localUsers = JSON.parse(localStorage.getItem('smaumu_local_users') || '[]');
    const match = localUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);

    if (match) {
      if (!match.password || match.password === password) {
        const { password: _, ...userSafe } = match;
        return { success: true, user: userSafe, mode: 'local_demo' };
      } else {
        throw new Error('Kata sandi yang Anda masukkan salah.');
      }
    }
  }

  throw new Error('Alamat email atau kata sandi tidak cocok. Silakan daftar baru jika belum memiliki akun.');
}

/**
 * Login Admin (HANYA UNTUK PETUGAS DINAS)
 * Strictly verifies role. Cannot be registered from public form.
 */
export async function loginAdminInstansi(email, password) {
  // Pre-configured Admin Credentials
  const validAdmins = [
    { email: 'admin.disdik@smaumu.go.id', pass: 'admin12345', nama: 'Admin Disdik WIA Pusat', peran: 'admin_instansi' },
    { email: 'verifikator.zonasi@smaumu.go.id', pass: 'verif12345', nama: 'Dr. H. Bambang Soeprapto', peran: 'verifikator_zonasi' },
    { email: 'auditor.bebas@ombudsman.go.id', pass: 'audit12345', nama: 'Ombudsman Publik Pelapor', peran: 'auditor_publik' }
  ];

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        const peran = data.user.user_metadata?.peran;
        if (peran === 'admin_instansi' || peran === 'verifikator_zonasi' || peran === 'auditor_publik') {
          return {
            success: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              nama: data.user.user_metadata?.nama || 'Petugas Disdik',
              peran
            },
            mode: 'supabase'
          };
        } else {
          await supabase.auth.signOut();
          throw new Error('Akses Ditolak: Akun Anda bukan akun petugas resmi instansi.');
        }
      }
    } catch (err) {
      console.warn('Supabase admin login fallback check:', err.message);
    }
  }

  // Verified admin credentials check
  const matched = validAdmins.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (matched && matched.pass === password) {
    return {
      success: true,
      user: {
        id: `admin-${Date.now()}`,
        email: matched.email,
        nama: matched.nama,
        peran: matched.peran
      },
      mode: 'verified_officer'
    };
  }

  throw new Error('Kredensial Petugas tidak valid. Hubungi Tim Administrator Disdik Provinsi.');
}
