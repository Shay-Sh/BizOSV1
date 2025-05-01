import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback values - ONLY for development/debugging!
// REMOVE IN PRODUCTION!
const FALLBACK_URL = 'https://dybdraqdzauxzndqscij.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzgzMzAsImV4cCI6MjA2MTE1NDMzMH0.H9Jbvst9T1ehbyObxiV_2FmBCnxxoCXpcKllhVcisXM';

// Create a direct client (to be called inside components or hooks, not at module level)
export function createDirectClient(url?: string, key?: string) {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase credentials - using fallbacks');
    return createClient(FALLBACK_URL, FALLBACK_KEY);
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Get a fresh Supabase client - always call this inside components/hooks
export function getDirectSupabaseClient() {
  return createDirectClient();
}

// For backwards compatibility - DO NOT USE in new code
// This may cause issues in some environments and should be considered deprecated
export const directSupabaseClient = typeof window !== 'undefined'
  ? createDirectClient()
  : null; 