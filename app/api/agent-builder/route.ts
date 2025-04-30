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
  console.log('POST /api/agent-builder: Start');
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    console.log('POST /api/agent-builder: Supabase client created');
    
    // Verify user is authenticated
    console.log('POST /api/agent-builder: Checking authentication');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('POST /api/agent-builder: Auth error', authError);
      return NextResponse.json(
        { error: `Unauthorized: ${authError.message}` },
        { status: 401 }
      );
    }
    
    if (!user) {
      console.error('POST /api/agent-builder: No user found');
      return NextResponse.json(
        { error: 'Unauthorized. No user found in session.' },
        { status: 401 }
      );
    }
    
    console.log(`POST /api/agent-builder: User authenticated: ${user.id}`);
    
    // Parse request body
    console.log('POST /api/agent-builder: Parsing request body');
    const body = await req.json();
    console.log('POST /api/agent-builder: Request body', body);
    
    // Validate required fields
    if (!body.name) {
      console.error('POST /api/agent-builder: Missing name field');
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      );
    }
    
    // Prepare agent data
    console.log('POST /api/agent-builder: Preparing agent data');
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
    console.log('POST /api/agent-builder: Inserting agent into database');
    try {
      const { data, error } = await supabase
        .from('agent_flows')
        .insert([agentData])
        .select()
        .single();
      
      if (error) {
        console.error('POST /api/agent-builder: Database error', error);
        
        // Log additional error details if available
        if (error.details) console.error('Error details:', error.details);
        if (error.hint) console.error('Error hint:', error.hint);
        
        return NextResponse.json(
          { 
            error: `Failed to create agent: ${error.message}`,
            details: error
          },
          { status: 500 }
        );
      }
      
      console.log(`POST /api/agent-builder: Agent created successfully with ID: ${data.id}`);
      return NextResponse.json({ agent: data }, { status: 201 });
    } catch (dbError) {
      console.error('POST /api/agent-builder: Unexpected database error', dbError);
      return NextResponse.json(
        { 
          error: `Unexpected database error: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
          details: dbError
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST /api/agent-builder: Unhandled error', error);
    return NextResponse.json(
      { 
        error: `Internal server error: ${error instanceof Error ? error.message : String(error)}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 