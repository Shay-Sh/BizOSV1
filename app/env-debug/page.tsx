'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This page helps debug environment variable issues in production
export default function EnvDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [clientInfo, setClientInfo] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Get all relevant environment variables
    const vars: Record<string, string> = {};
    
    // Check Next.js public env vars
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        vars[key] = process.env[key] || '(empty string)';
      }
    });
    
    // Set specific vars we care about
    vars['NEXT_PUBLIC_SUPABASE_URL'] = process.env.NEXT_PUBLIC_SUPABASE_URL || '(not set)';
    vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : '(not set)';
    
    // Client info
    const info: Record<string, any> = {
      userAgent: window.navigator.userAgent,
      url: window.location.href,
      windowEnv: {},
    };
    
    // Check if ENV vars are on window (sometimes set by custom scripts)
    if (typeof window !== 'undefined') {
      // @ts-ignore - Check custom properties
      if (window.ENV_SUPABASE_URL) {
        // @ts-ignore
        info.windowEnv['ENV_SUPABASE_URL'] = `${window.ENV_SUPABASE_URL.substring(0, 10)}...`;
      }
      // @ts-ignore
      if (window.ENV_SUPABASE_KEY) {
        // @ts-ignore
        info.windowEnv['ENV_SUPABASE_KEY'] = `${window.ENV_SUPABASE_KEY.substring(0, 5)}...`;
      }
      
      // Get all env vars from window
      Object.keys(window).forEach(key => {
        if (key.startsWith('NEXT_PUBLIC_') || key.startsWith('ENV_')) {
          // @ts-ignore
          const value = window[key];
          if (typeof value === 'string') {
            info.windowEnv[key] = value.length > 10 ? `${value.substring(0, 5)}...` : value;
          }
        }
      });
    }
    
    setEnvVars(vars);
    setClientInfo(info);
  }, []);
  
  // Add inline script to inject env values into window for testing
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      window.ENV_INJECTED = true;
      window.ENV_SUPABASE_URL = "${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}";
      window.ENV_SUPABASE_KEY = "${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}";
      console.log("Environment variables injected to window");
    `;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Environment Variable Debug</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Next.js Public Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(envVars).length > 0 ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(envVars, null, 2)}
              </pre>
            ) : (
              <p className="text-red-500">No public environment variables found!</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(clientInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Supabase Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              This button will attempt to create a Supabase connection with both the environment 
              variables and the window injected values to test what works.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  try {
                    const { createClient } = require('@supabase/supabase-js');
                    
                    // Try with process.env
                    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
                    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                    
                    if (url && key) {
                      const client = createClient(url, key);
                      alert(`Success creating client with process.env! URL: ${url.substring(0, 10)}...`);
                    } else {
                      alert('Failed: Missing URL or key in process.env');
                    }
                  } catch (error) {
                    alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test with process.env
              </button>
              
              <button
                onClick={() => {
                  try {
                    const { createClient } = require('@supabase/supabase-js');
                    
                    // Try with window vars
                    // @ts-ignore
                    const url = window.ENV_SUPABASE_URL;
                    // @ts-ignore
                    const key = window.ENV_SUPABASE_KEY;
                    
                    if (url && key) {
                      const client = createClient(url, key);
                      alert(`Success creating client with window vars! URL: ${url.substring(0, 10)}...`);
                    } else {
                      alert('Failed: Missing URL or key in window vars');
                    }
                  } catch (error) {
                    alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test with window vars
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 