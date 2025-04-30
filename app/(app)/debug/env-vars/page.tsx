'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClientEnvVars } from '@/lib/supabase/client';

export default function EnvVarsPage() {
  const [envVars, setEnvVars] = useState<Record<string, string | boolean | number>>({});

  useEffect(() => {
    // Collect available environment variables for debugging
    const { supabaseUrl, supabaseKey } = getClientEnvVars();
    
    setEnvVars({
      'NEXT_PUBLIC_SUPABASE_URL': !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'NEXT_PUBLIC_APP_URL': !!process.env.NEXT_PUBLIC_APP_URL,
      'Has supabaseUrl from getClientEnvVars': !!supabaseUrl,
      'Has supabaseKey from getClientEnvVars': !!supabaseKey,
      'supabaseUrl length': supabaseUrl?.length || 0,
      'supabaseKey length': supabaseKey?.length || 0,
      'NODE_ENV': process.env.NODE_ENV || 'unknown'
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Check</h1>
      <Card>
        <CardHeader>
          <CardTitle>Client-side Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(envVars).map(([name, value]) => (
              <div key={name} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{name}</span>
                <span className={typeof value === 'boolean' && value ? 'text-green-500' : 'text-red-500'}>
                  {value.toString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 