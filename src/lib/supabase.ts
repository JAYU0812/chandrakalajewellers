import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Initialize Supabase Client
export const supabase = createClient(ENV.VITE_SUPABASE_URL, ENV.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
