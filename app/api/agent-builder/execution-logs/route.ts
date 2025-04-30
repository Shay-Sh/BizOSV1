import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

/**
 * GET /api/agent-builder/execution-logs
 * 
 * Get execution logs for the authenticated user's agents
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to access this resource.' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const agentId = searchParams.get('agent_id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;
    
    // Build the query
    let query = supabase
      .from('agent_execution_logs')
      .select('*, agent_flows(id, name)')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Add filters if provided
    if (agentId) {
      query = query.eq('agent_id', agentId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching execution logs:', error);
      return NextResponse.json(
        { error: `Failed to fetch execution logs: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('agent_execution_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (countError) {
      console.error('Error counting execution logs:', countError);
    }
    
    return NextResponse.json({
      logs: data,
      pagination: {
        total: totalCount || 0,
        offset,
        limit,
        hasMore: (offset + limit) < (totalCount || 0)
      }
    });
    
  } catch (error) {
    console.error('Unhandled error in GET /api/agent-builder/execution-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agent-builder/execution-logs/[id]
 * 
 * Get a specific execution log by ID
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to access this resource.' },
        { status: 401 }
      );
    }
    
    // Parse request body to get log ID
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Log ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch the specific log
    const { data: log, error } = await supabase
      .from('agent_execution_logs')
      .select('*, agent_flows(id, name)')
      .eq('id', body.id)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Execution log not found or you do not have permission to access it' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching execution log:', error);
      return NextResponse.json(
        { error: `Failed to fetch execution log: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ log });
    
  } catch (error) {
    console.error('Unhandled error in POST /api/agent-builder/execution-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 