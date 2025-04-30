import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function GET(req: NextRequest) {
  const results = {
    checks: [] as { name: string; status: 'success' | 'error'; message: string }[],
    environmentVariables: {} as Record<string, string>,
    authStatus: null as any,
    tablesAccessible: false,
    tablesList: [] as string[],
  };

  // Check environment variables
  const envVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  for (const envVar of envVars) {
    const value = process.env[envVar];
    
    // Mask the actual values for security, but record if they exist
    results.environmentVariables[envVar] = value 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` 
      : 'Not defined';
    
    results.checks.push({
      name: `Environment Variable: ${envVar}`,
      status: value ? 'success' : 'error',
      message: value ? 'Defined' : 'Not defined'
    });
  }

  // Try creating the Supabase client using cookies-based auth
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    results.checks.push({
      name: 'Create Supabase Client (cookies)',
      status: 'success',
      message: 'Supabase client created successfully'
    });

    // Check authentication status
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        results.checks.push({
          name: 'Authentication Check',
          status: 'error',
          message: error.message
        });
        results.authStatus = { error: error.message };
      } else {
        results.checks.push({
          name: 'Authentication Check',
          status: 'success',
          message: data.user ? `Authenticated as ${data.user.id}` : 'No user found'
        });
        results.authStatus = { 
          authenticated: !!data.user,
          user: data.user ? {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role
          } : null
        };
      }
    } catch (authError) {
      results.checks.push({
        name: 'Authentication Check',
        status: 'error',
        message: authError instanceof Error ? authError.message : String(authError)
      });
      results.authStatus = { error: authError instanceof Error ? authError.message : String(authError) };
    }

    // Test database access - list tables
    try {
      const { data, error } = await supabase.from('agent_flows').select('id').limit(1);
      
      if (error) {
        results.checks.push({
          name: 'Database Access',
          status: 'error',
          message: error.message
        });
      } else {
        results.checks.push({
          name: 'Database Access',
          status: 'success',
          message: 'Successfully queried agent_flows table'
        });
        results.tablesAccessible = true;
      }
    } catch (dbError) {
      results.checks.push({
        name: 'Database Access',
        status: 'error',
        message: dbError instanceof Error ? dbError.message : String(dbError)
      });
    }

    // Additional check with direct client creation if we have URL and key
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const directClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        results.checks.push({
          name: 'Create Direct Supabase Client',
          status: 'success',
          message: 'Direct Supabase client created successfully'
        });

        // Try to list tables using direct client
        const { data, error } = await directClient.from('agent_flows').select('id').limit(1);
        
        if (error) {
          results.checks.push({
            name: 'Direct Database Access',
            status: 'error',
            message: error.message
          });
        } else {
          results.checks.push({
            name: 'Direct Database Access',
            status: 'success',
            message: 'Successfully queried agent_flows table with direct client'
          });
        }
      } catch (directError) {
        results.checks.push({
          name: 'Direct Supabase Client',
          status: 'error',
          message: directError instanceof Error ? directError.message : String(directError)
        });
      }
    }
  } catch (clientError) {
    results.checks.push({
      name: 'Create Supabase Client',
      status: 'error',
      message: clientError instanceof Error ? clientError.message : String(clientError)
    });
  }

  return NextResponse.json(results);
} 