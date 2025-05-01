'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { directSupabaseClient, createDirectClient } from '@/lib/supabase/direct-client';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  async function checkConnection() {
    setStatus('loading');
    setErrorMessage(null);

    try {
      // Try with the direct client first
      const { error } = await directSupabaseClient.from('api_keys').select('id').limit(1);
      
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

  useEffect(() => {
    checkConnection();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      status === 'connected' ? 'bg-green-100' : status === 'error' ? 'bg-red-100' : 'bg-gray-100'
    }`}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-4 h-4 rounded-full ${
              status === 'connected' ? 'bg-green-500' : 
              status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
            }`} 
          />
          <span className="font-medium">
            Supabase: {status === 'connected' ? 'Connected' : status === 'error' ? 'Error' : 'Checking...'}
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
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkConnection}
            disabled={status === 'loading'}
          >
            Retry
          </Button>
          
          {status === 'error' && (
            <Button 
              size="sm" 
              variant="default" 
              onClick={tryWithFallback}
              disabled={status === 'loading'}
            >
              Try Fallback
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 