import { createClient } from "@supabase/supabase-js";

// Safe environment variable access
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Initialize Supabase client safely.
 * If credentials are missing, we export a proxy or a dummy that won't crash on init.
 */
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

if (!supabase) {
  console.warn("Supabase credentials missing or invalid. Application will run in static fallback mode.");
}

