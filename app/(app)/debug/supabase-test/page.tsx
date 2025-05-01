'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: We're temporarily hardcoding the key just for debugging
// REMOVE THIS IN PRODUCTION!
const HARDCODED_URL = 'https://dybdraqdzauxzndqscij.supabase.co';
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzgzMzAsImV4cCI6MjA2MTE1NDMzMH0.H9Jbvst9T1ehbyObxiV_2FmBCnxxoCXpcKllhVcisXM';

export default function SupabaseTestPage() {
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testSupabaseConnections() {
      const testResults: Record<string, { success: boolean; message: string }> = {};
      
      // Method 1: Using process.env
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        testResults['Method 1 - Env Vars'] = {
          success: false,
          message: `URL: ${url ? 'Available' : 'Missing'}, Key: ${key ? 'Available' : 'Missing'}`,
        };
        
        if (url && key) {
          // Test connection
          const client = createClient(url, key);
          const { data, error } = await client.from('api_keys').select('id').limit(1);
          
          testResults['Method 1 - Env Vars'].success = !error;
          testResults['Method 1 - Env Vars'].message += ` | ${error ? `Error: ${error.message}` : 'Connection successful!'}`;
        }
      } catch (error) {
        testResults['Method 1 - Env Vars'] = {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
      
      // Method 2: Direct initialization with hardcoded values
      try {
        const client = createClient(HARDCODED_URL, HARDCODED_KEY);
        const { data, error } = await client.from('api_keys').select('id').limit(1);
        
        testResults['Method 2 - Hardcoded'] = {
          success: !error,
          message: error ? `Error: ${error.message}` : 'Connection successful!',
        };
      } catch (error) {
        testResults['Method 2 - Hardcoded'] = {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
      
      // Method A: createClient with options
      try {
        const client = createClient(HARDCODED_URL, HARDCODED_KEY, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          }
        });
        const { data, error } = await client.from('api_keys').select('id').limit(1);
        
        testResults['Method A - With Options'] = {
          success: !error,
          message: error ? `Error: ${error.message}` : 'Connection successful!',
        };
      } catch (error) {
        testResults['Method A - With Options'] = {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
      
      // Method B: Direct import of original client
      try {
        const { getBrowserSupabase } = await import('@/lib/supabase/client');
        const client = getBrowserSupabase();
        if (!client) {
          throw new Error('Client is null');
        }
        
        const { data, error } = await client.from('api_keys').select('id').limit(1);
        
        testResults['Method B - Import from lib'] = {
          success: !error,
          message: error ? `Error: ${error.message}` : 'Connection successful!',
        };
      } catch (error) {
        testResults['Method B - Import from lib'] = {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
      
      // Method C: Bypassing TypeScript with any
      try {
        const supabaseKey = HARDCODED_KEY;
        // @ts-ignore
        const client = createClient(HARDCODED_URL, supabaseKey);
        const { data, error } = await client.from('api_keys').select('id').limit(1);
        
        testResults['Method C - Type Bypass'] = {
          success: !error,
          message: error ? `Error: ${error.message}` : 'Connection successful!',
        };
      } catch (error) {
        testResults['Method C - Type Bypass'] = {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
      
      setResults(testResults);
      setLoading(false);
    }

    testSupabaseConnections();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <p className="text-sm text-gray-500 mb-4">Testing different methods of initializing the Supabase client</p>
      
      {loading ? (
        <div>Testing connections...</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(results).map(([method, result]) => (
            <Card key={method}>
              <CardHeader>
                <CardTitle>{method} {result.success ? '✅' : '❌'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={result.success ? 'text-green-500' : 'text-red-500'}>
                  {result.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 