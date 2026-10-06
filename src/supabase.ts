import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Canonical app URL used for auth redirects (password reset, etc.).
// Override via VITE_SITE_URL; defaults to the browser's current origin so it
// works in dev (http://localhost:3000) and in production without changes.
export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
});

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    url !== 'https://placeholder.supabase.co' &&
    !url.includes('your-supabase-project') &&
    key !== 'placeholder-key' &&
    !key.includes('your_supabase_anon_key')
  );
};
