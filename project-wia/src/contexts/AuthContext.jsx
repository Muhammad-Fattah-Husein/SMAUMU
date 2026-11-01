import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  loginMasyarakatUser,
  loginAdminInstansi,
  registerMasyarakatUser
} from '@/services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  useEffect(() => {
    setIsSupabaseReady(isSupabaseConfigured());

    // 1. Check local session cache (Works seamlessly on GitHub Pages static deployment)
    try {
      const cached = localStorage.getItem('smaumu_current_user');
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch (e) {
      console.warn('Error reading cached auth:', e);
    }

    // 2. If Supabase is configured, listen to real-time auth changes
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const fullUser = {
            id: session.user.id,
            email: session.user.email,
            nama: userMeta.nama || session.user.email?.split('@')[0],
            peran: userMeta.peran || 'masyarakat',
            nik: userMeta.nik || '',
            nisn: userMeta.nisn || '',
            nomor_telepon: userMeta.nomor_telepon || ''
          };
          setUser(prev => ({ ...prev, ...fullUser }));
          localStorage.setItem('smaumu_current_user', JSON.stringify(fullUser));
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const fullUser = {
            id: session.user.id,
            email: session.user.email,
            nama: userMeta.nama || session.user.email?.split('@')[0],
            peran: userMeta.peran || 'masyarakat',
            nik: userMeta.nik || '',
            nisn: userMeta.nisn || '',
            nomor_telepon: userMeta.nomor_telepon || ''
          };
          setUser(fullUser);
          localStorage.setItem('smaumu_current_user', JSON.stringify(fullUser));
        } else {
          // If signed out from Supabase, clear if not local admin
          if (user?.peran === 'masyarakat') {
            setUser(null);
            localStorage.removeItem('smaumu_current_user');
          }
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Register strictly for Masyarakat
  const register = async (userData) => {
    const res = await registerMasyarakatUser(userData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('smaumu_current_user', JSON.stringify(res.user));
    }
    return res;
  };

  // Login for Masyarakat
  const login = async (email, password) => {
    const res = await loginMasyarakatUser(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('smaumu_current_user', JSON.stringify(res.user));
    }
    return res;
  };

  // Login for Admin (No registration)
  const loginAdmin = async (email, password) => {
    const res = await loginAdminInstansi(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('smaumu_current_user', JSON.stringify(res.user));
    }
    return res;
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('smaumu_current_user');
  };

  // Update profile data in memory & storage
  const updateUser = (patch) => {
    setUser(prev => {
      const updated = { ...(prev || {}), ...patch };
      localStorage.setItem('smaumu_current_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.peran === 'admin_instansi' || user?.peran === 'verifikator_zonasi';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isSupabaseReady,
        login,
        loginAdmin,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
