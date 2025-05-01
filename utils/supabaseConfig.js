/**
 * Utility for getting Supabase configuration in any context,
 * including Chrome extension content scripts.
 */

// First, check for window.__SUPABASE_CONFIG__ (injected by layout.tsx)
export function getSupabaseConfig() {
  // In a browser context
  if (typeof window !== 'undefined') {
    // Check if the global config is available
    if (window.__SUPABASE_CONFIG__) {
      return {
        url: window.__SUPABASE_CONFIG__.url,
        key: window.__SUPABASE_CONFIG__.key
      };
    }
  }
  
  // Fallback to process.env (works in most Next.js contexts)
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  };
}

// For Chrome extension content scripts
// This can be called from any extension script to get the configuration
export function getContentScriptConfig() {
  // Look for window.__SUPABASE_CONFIG__ first
  if (typeof window !== 'undefined' && window.__SUPABASE_CONFIG__) {
    return window.__SUPABASE_CONFIG__;
  }
  
  // No configuration available
  console.error('Supabase configuration not available');
  return { url: '', key: '' };
} 