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
  // For browser environments
  if (typeof window !== 'undefined') {
    // Access from window if available (set by Next.js)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables in browser');
    }
    
    return { supabaseUrl, supabaseKey };
  }
  
  // For server-side rendering
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  };
}

// For client components
export const createBrowserSupabaseClient = () => {
  // Get environment variables
  const { supabaseUrl, supabaseKey } = getClientEnvVars();

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase environment variables');
  }

  // Using enhanced options for better session persistence
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
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
    return null;
  }
}

// For backwards compatibility
export const browserSupabase = typeof window !== 'undefined' 
  ? createBrowserSupabaseClient() 
  : null as any; // Type assertion needed for SSR 