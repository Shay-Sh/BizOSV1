import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/agent-builder/[id]
 * 
 * Get a specific agent flow by ID
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to access this resource.' },
        { status: 401 }
      );
    }
    
    // Fetch the agent
    const { data: agent, error } = await supabase
      .from('agent_flows')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching agent:', error);
      return NextResponse.json(
        { error: `Failed to fetch agent: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Check if the user has access to this agent
    if (agent.user_id !== user.id) {
      // Check if the agent belongs to an organization the user is part of
      // This would require additional authorization logic
      
      // For now, just deny access if the user doesn't own the agent
      return NextResponse.json(
        { error: 'You do not have permission to access this agent' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ agent });
    
  } catch (error) {
    console.error(`Unhandled error in GET /api/agent-builder/[id]:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agent-builder/[id]
 * 
 * Update a specific agent flow
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to update an agent.' },
        { status: 401 }
      );
    }
    
    // Check if agent exists and belongs to the user
    const { data: existingAgent, error: fetchError } = await supabase
      .from('agent_flows')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching agent:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch agent: ${fetchError.message}` },
        { status: 500 }
      );
    }
    
    // Check if the user has permission to update this agent
    if (existingAgent.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this agent' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    // Include fields that are provided in the request
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.flowData !== undefined) updateData.flow_data = body.flowData;
    if (body.nodes !== undefined) updateData.nodes = body.nodes;
    if (body.edges !== undefined) updateData.edges = body.edges;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;
    if (body.settings !== undefined) updateData.settings = body.settings;
    
    // Update the agent
    const { data, error } = await supabase
      .from('agent_flows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating agent:', error);
      return NextResponse.json(
        { error: `Failed to update agent: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ agent: data });
    
  } catch (error) {
    console.error(`Unhandled error in PUT /api/agent-builder/[id]:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent-builder/[id]
 * 
 * Delete a specific agent flow
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to delete an agent.' },
        { status: 401 }
      );
    }
    
    // Check if agent exists and belongs to the user
    const { data: existingAgent, error: fetchError } = await supabase
      .from('agent_flows')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Agent not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching agent:', fetchError);
      return NextResponse.json(
        { error: `Failed to fetch agent: ${fetchError.message}` },
        { status: 500 }
      );
    }
    
    // Check if the user has permission to delete this agent
    if (existingAgent.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this agent' },
        { status: 403 }
      );
    }
    
    // Delete associated schedules first
    await supabase
      .from('agent_schedules')
      .delete()
      .eq('agent_id', id);
    
    // Delete the agent
    const { error } = await supabase
      .from('agent_flows')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting agent:', error);
      return NextResponse.json(
        { error: `Failed to delete agent: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Agent deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error(`Unhandled error in DELETE /api/agent-builder/[id]:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 