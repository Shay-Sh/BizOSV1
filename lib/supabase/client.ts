import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

// Default fallback values for development only - NEVER use real keys here
const FALLBACK_SUPABASE_URL = 'https://dybdraqdzauxzndqscij.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzgzMzAsImV4cCI6MjA2MTE1NDMzMH0.H9Jbvst9T1ehbyObxiV_2FmBCnxxoCXpcKllhVcisXM';

// For server components
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Create Supabase browser client that works in any runtime
// This should be called inside components, hooks, or event handlers - not at module level
export const supabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anon) {
    console.error('Supabase env vars missing - using fallbacks (this should not happen in production)');
    // In production, provide fallbacks to prevent crashes
    return createBrowserClient<Database>(
      FALLBACK_SUPABASE_URL, 
      FALLBACK_ANON_KEY
    );
  }

  return createBrowserClient<Database>(url, anon);
};

// For backwards compatibility
export const getBrowserSupabase = () => {
  // Skip in SSR context
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    return supabase();
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
}

// For backwards compatibility - only use within client components, not at module level
export const browserSupabase = typeof window !== 'undefined' 
  ? (() => {
      try {
        return supabase();
      } catch (error) {
        console.error('Failed to initialize browserSupabase:', error);
        // Return a dummy object to prevent crashes in old code that expects this
        return null;
      }
    })() 
  : null; 