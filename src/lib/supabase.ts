import { createClient } from '@supabase/supabase-js';

/**
 * Supabase connection. The URL and publishable key are designed to be public:
 * every table is protected by row-level security, so a visitor can only ever
 * read or change their own rows. Never put a secret / service-role key here.
 * Override per environment with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
 */
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://aubvnnhzvjqfnomkpvxl.supabase.co';
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || 'sb_publishable_lnDTS8ZDfnqacYAF4OibuQ_gYCB-5zI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
