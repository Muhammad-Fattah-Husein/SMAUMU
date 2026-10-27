import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Flag to check whether real Supabase credentials have been configured.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[SMAUMU] Variabel lingkungan VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur.\n' +
    'Salin .env.example menjadi .env dan masukkan kunci proyek Supabase Anda.'
  );
}

/**
 * Supabase Client Instance
 * Used for database queries, auth, and real-time subscriptions.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
