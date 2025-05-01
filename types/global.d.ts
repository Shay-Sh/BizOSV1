// Global TypeScript declarations

// Extend the Window interface to include our Supabase configuration
interface Window {
  __SUPABASE_CONFIG__?: {
    url: string;
    key: string;
  };
} 