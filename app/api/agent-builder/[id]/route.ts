import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

/**
 * GET /api/agent-builder/[id]
 * 
 * Get a specific agent flow by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Fetch the agent
    const { data, error } = await supabase
      .from('agent_flows')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      console.error('Error fetching agent:', error);
      return NextResponse.json(
        { error: `Failed to fetch agent: ${error.message}` },
        { status: 404 }
      );
    }
    
    // Check if the agent belongs to the user or their organization
    if (data.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to access this agent.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ agent: data });
    
  } catch (error) {
    console.error('Unhandled error in GET /api/agent-builder/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agent-builder/[id]
 * 
 * Update a specific agent flow
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to update this agent.' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Fetch the agent to check ownership
    const { data: agent, error: fetchError } = await supabase
      .from('agent_flows')
      .select('user_id')
      .eq('id', params.id)
      .single();
    
    if (fetchError || !agent) {
      console.error('Error fetching agent:', fetchError);
      return NextResponse.json(
        { error: `Agent not found: ${fetchError?.message || 'Not found'}` },
        { status: 404 }
      );
    }
    
    // Check if the agent belongs to the user
    if (agent.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this agent.' },
        { status: 403 }
      );
    }
    
    // Prepare update data
    const updateData = {
      name: body.name,
      description: body.description,
      flow_data: body.flowData,
      nodes: body.nodes,
      edges: body.edges,
      is_active: body.is_active,
      settings: body.settings,
      updated_at: new Date().toISOString(),
    };
    
    // Update the agent
    const { data: updatedAgent, error: updateError } = await supabase
      .from('agent_flows')
      .update(updateData)
      .eq('id', params.id)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('Error updating agent:', updateError);
      return NextResponse.json(
        { error: `Failed to update agent: ${updateError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ agent: updatedAgent });
    
  } catch (error) {
    console.error('Unhandled error in PATCH /api/agent-builder/[id]:', error);
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
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to delete this agent.' },
        { status: 401 }
      );
    }
    
    // Fetch the agent to check ownership
    const { data: agent, error: fetchError } = await supabase
      .from('agent_flows')
      .select('user_id')
      .eq('id', params.id)
      .single();
    
    if (fetchError || !agent) {
      console.error('Error fetching agent:', fetchError);
      return NextResponse.json(
        { error: `Agent not found: ${fetchError?.message || 'Not found'}` },
        { status: 404 }
      );
    }
    
    // Check if the agent belongs to the user
    if (agent.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this agent.' },
        { status: 403 }
      );
    }
    
    // Delete the agent
    const { error: deleteError } = await supabase
      .from('agent_flows')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      console.error('Error deleting agent:', deleteError);
      return NextResponse.json(
        { error: `Failed to delete agent: ${deleteError.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Unhandled error in DELETE /api/agent-builder/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 