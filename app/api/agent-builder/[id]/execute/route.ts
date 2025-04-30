import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import agentEngine from '@/lib/agent-builder/engine';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/agent-builder/[id]/execute
 * 
 * Execute a specific agent flow
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to execute an agent.' },
        { status: 401 }
      );
    }
    
    // Check if agent exists and belongs to the user
    const { data: agent, error: fetchError } = await supabase
      .from('agent_flows')
      .select('*')
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
    
    // Check if the user has permission to execute this agent
    if (agent.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to execute this agent' },
        { status: 403 }
      );
    }
    
    // Check if the agent has node data
    if (!agent.nodes || !Array.isArray(agent.nodes) || agent.nodes.length === 0) {
      return NextResponse.json(
        { error: 'This agent has no nodes configured' },
        { status: 400 }
      );
    }
    
    // Optional: Parse request body for any execution parameters
    let triggeredBy = 'manual';
    try {
      const body = await req.json();
      if (body.triggeredBy) {
        triggeredBy = body.triggeredBy;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    // Check if the user has Gmail authentication
    const { data: gmailToken, error: tokenError } = await supabase
      .from('gmail_auth_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (tokenError || !gmailToken) {
      return NextResponse.json(
        { error: 'Gmail authentication is required to execute this agent' },
        { status: 400 }
      );
    }
    
    // Execute the agent flow
    const result = await agentEngine.executeFlow(id, user.id, triggeredBy);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          executionId: result.context.agentId,
          startTime: result.startTime,
          endTime: result.endTime
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      executionId: result.context.agentId,
      startTime: result.startTime,
      endTime: result.endTime,
      actions: result.context.actions,
      emailsProcessed: result.context.emails.length,
    });
    
  } catch (error) {
    console.error(`Unhandled error in POST /api/agent-builder/[id]/execute:`, error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 