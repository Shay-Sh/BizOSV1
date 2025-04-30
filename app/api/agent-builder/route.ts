import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

/**
 * GET /api/agent-builder
 * 
 * Get all agent flows for the authenticated user
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
    
    // Get the organization ID from query params if present
    const organizationId = req.nextUrl.searchParams.get('organization_id');
    
    // Base query
    let query = supabase
      .from('agent_flows')
      .select('*');
    
    // Filter by organization if provided, otherwise filter by user
    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    } else {
      query = query.eq('user_id', user.id);
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching agents:', error);
      return NextResponse.json(
        { error: `Failed to fetch agents: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ agents: data });
    
  } catch (error) {
    console.error('Unhandled error in GET /api/agent-builder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-builder
 * 
 * Create a new agent flow
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to create an agent.' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      );
    }
    
    // Prepare agent data
    const agentData = {
      name: body.name,
      description: body.description || null,
      type: body.type || 'gmail', // Default to gmail
      flow_data: body.flowData || null,
      nodes: body.nodes || [],
      edges: body.edges || [],
      is_active: body.isActive !== undefined ? body.isActive : true,
      user_id: user.id,
      organization_id: body.organizationId || null,
      settings: body.settings || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('agent_flows')
      .insert([agentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      return NextResponse.json(
        { error: `Failed to create agent: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ agent: data }, { status: 201 });
    
  } catch (error) {
    console.error('Unhandled error in POST /api/agent-builder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 