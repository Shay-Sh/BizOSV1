'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TableCheckPage() {
  const [tableStatus, setTableStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkTables() {
      try {
        const supabase = getBrowserSupabase();
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

        const tablesToCheck = [
          'api_keys',
          'agent_flows',
          'llm_api_keys',
          'agent_execution_logs',
          'agent_schedules',
          'gmail_auth_tokens',
          'user_roles'
        ];

        const results: Record<string, boolean> = {};

        // Initialize all tables as false first
        tablesToCheck.forEach(table => {
          results[table] = false;
        });

        // Direct query approach - just try to access each table
        for (const tableName of tablesToCheck) {
          try {
            // Try a simple COUNT query
            const { error } = await supabase
              .from(tableName as any)  // Type casting to bypass TypeScript checking
              .select('*', { count: 'exact', head: true });
              
            // If we get here without an error, the table exists
            results[tableName] = !error;
          } catch (err) {
            // Table likely doesn't exist
            results[tableName] = false;
          }
        }

        setTableStatus(results);
        setLoading(false);
      } catch (err) {
        console.error('Error checking tables:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    checkTables();
  }, []);

  if (loading) {
    return <div className="p-8">Loading table status...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Table Check</h1>
      <Card>
        <CardHeader>
          <CardTitle>Table Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(tableStatus).map(([table, exists]) => (
              <div key={table} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{table}</span>
                <span className={exists ? 'text-green-500' : 'text-red-500'}>
                  {exists ? '✅ Exists' : '❌ Missing'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 