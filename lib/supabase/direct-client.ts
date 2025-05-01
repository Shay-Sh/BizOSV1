import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback values - ONLY for development/debugging!
// REMOVE IN PRODUCTION!
const FALLBACK_URL = 'https://dybdraqdzauxzndqscij.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzgzMzAsImV4cCI6MjA2MTE1NDMzMH0.H9Jbvst9T1ehbyObxiV_2FmBCnxxoCXpcKllhVcisXM';

// IMPORTANT: This is a bare-bones implementation for testing purposes only
export const directSupabaseClient = createClient(
  // Use environment variables if available, otherwise use hardcoded values
  process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY
);

// Use this function to explicitly create a new client with provided keys
export function createDirectClient(url?: string, key?: string) {
  return createClient(
    url || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY
  );
} 