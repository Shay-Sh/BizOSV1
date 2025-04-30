import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { createServerClient } from '@/lib/supabase/client';

/**
 * POST /api/debug-agent
 * 
 * Debug endpoint for agent creation issues
 */
export async function POST(request: Request) {
  try {
    const { name, description, type, isActive } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createServerClient();
    
    // Create a new agent flow record
    const { data, error } = await supabase
      .from('agent_flows')
      .insert({
        name,
        description: description || '',
        type: type || 'gmail',
        config: {},
        is_active: isActive || false,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent for debug:', error);
      return NextResponse.json(
        { 
          error: error.message,
          details: {
            code: error.code,
            hint: error.hint,
            details: error.details
          }
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in debug-agent endpoint:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 