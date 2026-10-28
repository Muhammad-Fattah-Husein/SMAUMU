import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { DEMO_ADMINS } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local session (preserves local & demo student login across refreshes)
    try {
      const savedAuth = localStorage.getItem('smaumu_auth_session');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.user) {
          setUser(parsed.user);
          setSession(parsed.session || { user: parsed.user, access_token: 'local-session-token' });
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading local auth session:', e);
    }

    // 2. Get initial active session from Supabase
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
        setLoading(false);
      }).catch((err) => {
        console.warn('Gagal memuat sesi Supabase:', err);
        setLoading(false);
      });

      // 3. Listen for auth changes (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
        }
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Log in supporting:
   * 1. Registered students in local registry (localStorage 'smaumu_registered_students')
   * 2. Pre-seeded demo student accounts (NISN 1234567890 & 1351515315)
   * 3. Pre-seeded demo admin accounts (admin_sman1, admin_sman8, etc.)
   * 4. Real Supabase Auth (via email or auto-resolved NISN)
   */
  const login = async (identifier, password) => {
    setLoading(true);
    const cleanId = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    try {
      // -------------------------------------------------------------
      // 1. Check Locally Registered Students (created via /register)
      // -------------------------------------------------------------
      let localStudents = [];
      try {
        localStudents = JSON.parse(localStorage.getItem('smaumu_registered_students') || '[]');
      } catch (_) {}

      const matchedLocal = localStudents.find(
        (s) =>
          s.nisn === cleanId ||
          s.email?.toLowerCase() === cleanId.toLowerCase() ||
          s.contact_email?.toLowerCase() === cleanId.toLowerCase() ||
          s.username?.toLowerCase() === cleanId.toLowerCase()
      );

      if (matchedLocal) {
        if (matchedLocal.password === cleanPass) {
          const localUser = {
            id: matchedLocal.id || `student-${matchedLocal.nisn}`,
            email: matchedLocal.email || `${matchedLocal.nisn}@siswa.smaumu.id`,
            user_metadata: {
              full_name: matchedLocal.full_name || matchedLocal.fullName || 'Calon Siswa PPDB',
              username: matchedLocal.username,
              nisn: matchedLocal.nisn,
              role: 'student',
            },
          };
          const localSession = {
            access_token: 'local-session-token',
            user: localUser,
          };

          setUser(localUser);
          setSession(localSession);
          localStorage.setItem(
            'smaumu_auth_session',
            JSON.stringify({ user: localUser, session: localSession })
          );
          return { user: localUser, session: localSession };
        } else {
          throw new Error('Kata sandi yang Anda masukkan salah.');
        }
      }

      // -------------------------------------------------------------
      // 2. Pre-seeded Demo Student Fallbacks (Guaranteed 1-Click Test Access)
      // -------------------------------------------------------------
      if (cleanId === '1234567890' || cleanId === '1351515315' || cleanId === 'demo_siswa') {
        const isFattah = cleanId === '1351515315';
        const demoUser = {
          id: `student-${cleanId}`,
          email: isFattah ? 'fattah@siswa.smaumu.id' : `${cleanId}@siswa.smaumu.id`,
          user_metadata: {
            full_name: isFattah ? 'Muhammad Fattah Husein' : 'Calon Siswa PPDB',
            username: isFattah ? 'fattah_husein' : 'calon_siswa',
            nisn: cleanId.replace(/\D/g, '') || '1234567890',
            role: 'student',
          },
        };
        const demoSession = {
          access_token: 'demo-student-token',
          user: demoUser,
        };

        setUser(demoUser);
        setSession(demoSession);
        localStorage.setItem(
          'smaumu_auth_session',
          JSON.stringify({ user: demoUser, session: demoSession })
        );
        return { user: demoUser, session: demoSession };
      }

      // -------------------------------------------------------------
      // 3. Pre-seeded Demo Admin Fallbacks (e.g. admin_sman1 / password123)
      // -------------------------------------------------------------
      const matchedDemoAdmin = DEMO_ADMINS.find(
        (a) => (a.username === cleanId || a.email === cleanId) && a.password === cleanPass
      );
      if (matchedDemoAdmin) {
        const adminUser = {
          id: `admin-${matchedDemoAdmin.schoolId}`,
          email: `${matchedDemoAdmin.username}@admin.smaumu.id`,
          user_metadata: {
            full_name: matchedDemoAdmin.name,
            username: matchedDemoAdmin.username,
            role: 'admin',
            school_id: matchedDemoAdmin.schoolId,
          },
        };
        const adminSession = {
          access_token: 'demo-admin-token',
          user: adminUser,
        };
        setUser(adminUser);
        setSession(adminSession);
        localStorage.setItem(
          'smaumu_auth_session',
          JSON.stringify({ user: adminUser, session: adminSession })
        );
        return { user: adminUser, session: adminSession };
      }

      // -------------------------------------------------------------
      // 4. Try Supabase Auth
      // -------------------------------------------------------------
      if (isSupabaseConfigured) {
        const authEmail = cleanId.includes('@')
          ? cleanId
          : `${cleanId}@siswa.smaumu.id`;

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: cleanPass,
          });

          if (!error && data?.user) {
            setUser(data.user);
            setSession(data.session);
            localStorage.removeItem('smaumu_auth_session');
            return data;
          }

          if (error) {
            throw error;
          }
        } catch (supabaseError) {
          // If cleanId has no @ and failed, also try common domain format
          if (!cleanId.includes('@')) {
            try {
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: `nisn.${cleanId}@gmail.com`,
                password: cleanPass,
              });
              if (!retryError && retryData?.user) {
                setUser(retryData.user);
                setSession(retryData.session);
                return retryData;
              }
            } catch (_) {}
          }
          throw supabaseError;
        }
      }

      throw new Error('NISN atau kata sandi tidak cocok. Pastikan akun calon siswa telah didaftarkan.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out and clear both local and Supabase sessions
   */
  const logout = async () => {
    try {
      localStorage.removeItem('smaumu_auth_session');
      localStorage.removeItem('smaumu_demo_student');
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Error saat sign out:', err);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: Boolean(user),
        login,
        logout,
        loading,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
