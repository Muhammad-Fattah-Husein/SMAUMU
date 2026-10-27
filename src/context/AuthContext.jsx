import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial active session from Supabase
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.warn('Gagal memuat sesi Supabase:', err);
      setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Log in via Supabase Auth using email and password.
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
      setSession(data.session);
      return data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out via Supabase Auth.
   */
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error saat sign out Supabase:', err);
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
