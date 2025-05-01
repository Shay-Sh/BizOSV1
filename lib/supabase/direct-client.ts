import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback values - ONLY for development/debugging!
// REMOVE IN PRODUCTION!
const FALLBACK_URL = 'https://dybdraqdzauxzndqscij.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzgzMzAsImV4cCI6MjA2MTE1NDMzMH0.H9Jbvst9T1ehbyObxiV_2FmBCnxxoCXpcKllhVcisXM';

// Helper to get environment variables from all possible sources
function getSupabaseEnv() {
  const isBrowser = typeof window !== 'undefined';
  
  // Try to get values from multiple sources in order of preference
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Check window object in browser
  if (isBrowser && window) {
    // @ts-ignore
    if (window.ENV_SUPABASE_URL) {
      // @ts-ignore
      url = window.ENV_SUPABASE_URL;
    }
    
    // @ts-ignore
    if (window.ENV_SUPABASE_KEY) {
      // @ts-ignore
      key = window.ENV_SUPABASE_KEY;
    }
  }
  
  // Use fallbacks as last resort
  if (!url || url.trim() === '') {
    console.warn('Using fallback Supabase URL');
    url = FALLBACK_URL;
  }
  
  if (!key || key.trim() === '') {
    console.warn('Using fallback Supabase key');
    key = FALLBACK_KEY;
  }
  
  return { url, key };
}

// Create the client lazily to ensure browser environment is fully loaded
let directClientInstance: ReturnType<typeof createClient> | null = null;

// Get a singleton instance
export function getDirectSupabaseClient() {
  if (typeof window === 'undefined') {
    // In SSR, create a fresh instance each time
    const { url, key } = getSupabaseEnv();
    return createClient(url, key);
  }
  
  // In browser, maintain a singleton
  if (!directClientInstance) {
    const { url, key } = getSupabaseEnv();
    directClientInstance = createClient(url, key);
  }
  
  return directClientInstance;
}

// For backwards compatibility
export const directSupabaseClient = getDirectSupabaseClient();

// Use this function to explicitly create a new client with provided keys
export function createDirectClient(url?: string, key?: string) {
  const env = getSupabaseEnv();
  return createClient(
    url || env.url,
    key || env.key
  );
} 