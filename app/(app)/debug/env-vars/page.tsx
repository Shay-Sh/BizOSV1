'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EnvVarsDebugPage() {
  const [clientEnvVars, setClientEnvVars] = useState<Record<string, string>>({});
  const [serverEnvVars, setServerEnvVars] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  // Check client-side env vars
  useEffect(() => {
    const vars: Record<string, string> = {};
    
    // Check for NEXT_PUBLIC env vars
    vars['NEXT_PUBLIC_SUPABASE_URL'] = process.env.NEXT_PUBLIC_SUPABASE_URL || '(not set)';
    vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : '(not set)';
    vars['NEXT_PUBLIC_APP_URL'] = process.env.NEXT_PUBLIC_APP_URL || '(not set)';
    vars['NODE_ENV'] = process.env.NODE_ENV || '(not set)';

    setClientEnvVars(vars);
  }, []);

  // Check server-side env vars
  const checkServerEnvVars = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/env');
      const data = await response.json();
      setServerEnvVars(data);
    } catch (error) {
      setServerEnvVars({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm overflow-auto">
                {JSON.stringify(clientEnvVars, null, 2)}
              </pre>
            </div>
            <div className="text-sm mt-4 text-muted-foreground">
              <p>These values are exposed to the browser through Next.js's client-side bundling.</p>
              <p>Only NEXT_PUBLIC_* variables will appear here.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Server-Side Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={checkServerEnvVars}
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Checking...' : 'Check Server Variables'}
            </Button>
            
            {Object.keys(serverEnvVars).length > 0 && (
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm overflow-auto">
                  {JSON.stringify(serverEnvVars, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="text-sm mt-4 text-muted-foreground">
              <p>These values are checked via a server-side API endpoint.</p>
              <p>Both public and private environment variables can be checked here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 