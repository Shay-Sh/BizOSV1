import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

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

// Get the public environment variables for client components
export const getClientEnvVars = () => {
  // These values are embedded at build time for client components
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  return { supabaseUrl, supabaseKey };
}

// For client components - with proper error handling
export const createBrowserSupabaseClient = () => {
  // Get environment variables
  const { supabaseUrl, supabaseKey } = getClientEnvVars();

  if (!supabaseUrl) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is not defined');
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }
  
  if (!supabaseKey) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }

  try {
    // Using enhanced options for better session persistence
    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw error;
  }
}

// Create a function that safely initializes the browser client
let browserSupabaseInstance: ReturnType<typeof createBrowserSupabaseClient> | null = null;

export const getBrowserSupabase = () => {
  // Skip in SSR context
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Create instance if it doesn't exist
    if (!browserSupabaseInstance) {
      browserSupabaseInstance = createBrowserSupabaseClient();
    }
    return browserSupabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
}

// For backwards compatibility - with proper error handling
export const browserSupabase = typeof window !== 'undefined' 
  ? (() => {
      try {
        return createBrowserSupabaseClient();
      } catch (error) {
        console.error('Failed to initialize browserSupabase:', error);
        // Return a dummy object to prevent crashes in old code that expects this
        return null;
      }
    })() 
  : null; 