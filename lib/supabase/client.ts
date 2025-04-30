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

// Get the public environment variables for client components
export const getClientEnvVars = () => {
  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // These values are embedded at build time for client components
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // Try to get values from window object if available in the browser
  // This is sometimes more reliable than process.env in client side
  if (isBrowser && window && 'ENV_SUPABASE_URL' in window) {
    // @ts-ignore
    supabaseUrl = window.ENV_SUPABASE_URL || supabaseUrl;
  }
  
  if (isBrowser && window && 'ENV_SUPABASE_KEY' in window) {
    // @ts-ignore
    supabaseKey = window.ENV_SUPABASE_KEY || supabaseKey;
  }
  
  // Log available environment variables in development
  if (process.env.NODE_ENV === 'development' && isBrowser) {
    console.log('Environment vars available in client:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
  }
  
  // In production, always use the environment variables or hardcoded values as absolute last resort
  if (!supabaseUrl) {
    console.warn('Using fallback SUPABASE_URL');
    supabaseUrl = FALLBACK_SUPABASE_URL;
  }
  
  if (!supabaseKey) {
    console.warn('Using fallback SUPABASE_ANON_KEY');
    supabaseKey = FALLBACK_ANON_KEY;
  }
  
  return { supabaseUrl, supabaseKey };
}

// For client components - with proper error handling
export const createBrowserSupabaseClient = () => {
  // Get environment variables
  const { supabaseUrl, supabaseKey } = getClientEnvVars();

  // Add explicit validation for empty strings
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is empty or not defined');
    
    // Force a valid URL in production to prevent crashes
    const url = FALLBACK_SUPABASE_URL;
    console.warn(`Using hardcoded URL: ${url.substring(0, 10)}...`);
    
    if (!FALLBACK_ANON_KEY || FALLBACK_ANON_KEY.trim() === '') {
      throw new Error('No valid Supabase URL available');
    }
    
    // Try with the fallback URL and key
    return createBrowserClient<Database>(FALLBACK_SUPABASE_URL, FALLBACK_ANON_KEY);
  }
  
  if (!supabaseKey || supabaseKey.trim() === '') {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is empty or not defined');
    
    // Force a valid key in production to prevent crashes
    console.warn(`Using hardcoded API key as fallback`);
    
    if (!FALLBACK_ANON_KEY || FALLBACK_ANON_KEY.trim() === '') {
      throw new Error('No valid Supabase key available');
    }
    
    // Try with the URL and fallback key
    return createBrowserClient<Database>(supabaseUrl, FALLBACK_ANON_KEY);
  }

  try {
    // Log successful initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Initializing Supabase with URL: ${supabaseUrl.substring(0, 10)}... and key length: ${supabaseKey.length}`);
    }
    
    // Using enhanced options for better session persistence
    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    
    // Final fallback attempt
    console.warn('Attempting with fallback values as last resort');
    return createBrowserClient<Database>(FALLBACK_SUPABASE_URL, FALLBACK_ANON_KEY);
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