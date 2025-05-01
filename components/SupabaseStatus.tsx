'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createDirectClient, getDirectSupabaseClient } from '@/lib/supabase/direct-client';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [envInfo, setEnvInfo] = useState<string | null>(null);

  async function checkConnection() {
    setStatus('loading');
    setErrorMessage(null);

    try {
      // Get environment variable info for debugging
      const envDebug = {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        env: process.env.NODE_ENV
      };
      setEnvInfo(JSON.stringify(envDebug, null, 2));

      // Create a fresh client (don't reuse directSupabaseClient)
      const client = getDirectSupabaseClient();
      const { error } = await client.from('api_keys').select('id').limit(1);
      
      if (error) {
        throw error;
      }
      
      setStatus('connected');
    } catch (error) {
      console.error('Direct client failed:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function tryWithFallback() {
    try {
      // Create a new client with hardcoded values
      const client = createDirectClient();
      const { error } = await client.from('api_keys').select('id').limit(1);
      
      if (error) {
        throw error;
      }
      
      setStatus('connected');
      setErrorMessage('Connected using fallback client!');
    } catch (error) {
      setStatus('error');
      setErrorMessage(`Fallback also failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Use useEffect to avoid any module-level supabase initialization
  useEffect(() => {
    checkConnection();
  }, []);

  if (!isVisible) {
    return null;
  }

  // Fix TypeScript error by using an intermediate variable
  const currentStatus = status;
  const isLoading = currentStatus === 'loading';

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      currentStatus === 'connected' ? 'bg-green-100' : currentStatus === 'error' ? 'bg-red-100' : 'bg-gray-100'
    }`}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-4 h-4 rounded-full ${
              currentStatus === 'connected' ? 'bg-green-500' : 
              currentStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
            }`} 
          />
          <span className="font-medium">
            Supabase: {currentStatus === 'connected' ? 'Connected' : currentStatus === 'error' ? 'Error' : 'Checking...'}
          </span>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        {errorMessage && (
          <div className="text-sm text-red-600 max-w-xs overflow-auto">
            {errorMessage}
          </div>
        )}

        {envInfo && (
          <div className="text-xs bg-gray-800 text-white p-2 rounded my-1 max-w-xs overflow-auto">
            <pre>{envInfo}</pre>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkConnection}
            disabled={isLoading}
          >
            Retry
          </Button>
          
          {currentStatus === 'error' && (
            <Button 
              size="sm" 
              variant="default" 
              onClick={tryWithFallback}
              disabled={isLoading}
            >
              Try Fallback
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 