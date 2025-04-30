import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import agentEngine from '@/lib/agent-builder/engine';
import schedulerService from '@/lib/agent-builder/scheduler';

// Initialize Supabase client with service role for server-to-server operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Use the new route segment config format
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const bodyParser = false;

/**
 * POST /api/cron/run-agents
 * 
 * API route for running scheduled agents
 * This should be called by a cron job scheduler
 */
export async function POST(req: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = req.headers.get('x-api-key');
    const configuredApiKey = process.env.CRON_API_KEY;
    
    if (!configuredApiKey || apiKey !== configuredApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key.' },
        { status: 401 }
      );
    }
    
    // Get all due schedules
    const dueSchedules = await schedulerService.getDueSchedules();
    
    if (dueSchedules.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No agents due for execution',
        executed: 0
      });
    }
    
    const results = [];
    const errors = [];
    
    // Execute each due agent
    for (const schedule of dueSchedules) {
      try {
        // Get the agent owner (user_id)
        const { data: agent, error: agentError } = await supabase
          .from('agent_flows')
          .select('user_id, is_active')
          .eq('id', schedule.agentId)
          .single();
        
        if (agentError || !agent) {
          console.error(`Error fetching agent ${schedule.agentId}:`, agentError);
          errors.push({
            scheduleId: schedule.id,
            agentId: schedule.agentId,
            error: `Agent not found: ${agentError?.message || 'Unknown error'}`
          });
          continue;
        }
        
        // Skip inactive agents
        if (!agent.is_active) {
          await schedulerService.markScheduleRun(schedule.id);
          results.push({
            scheduleId: schedule.id,
            agentId: schedule.agentId,
            status: 'skipped',
            reason: 'Agent is inactive'
          });
          continue;
        }
        
        // Check if the user has Gmail token
        const { data: gmailToken, error: tokenError } = await supabase
          .from('gmail_auth_tokens')
          .select('*')
          .eq('user_id', agent.user_id)
          .single();
        
        if (tokenError || !gmailToken) {
          console.error(`User ${agent.user_id} has no Gmail token for agent ${schedule.agentId}`);
          errors.push({
            scheduleId: schedule.id,
            agentId: schedule.agentId,
            error: 'Gmail authentication required'
          });
          continue;
        }
        
        // Execute the agent
        const result = await agentEngine.executeFlow(
          schedule.agentId,
          agent.user_id,
          'schedule'
        );
        
        // Update schedule with next run time
        await schedulerService.markScheduleRun(schedule.id);
        
        results.push({
          scheduleId: schedule.id,
          agentId: schedule.agentId,
          success: result.success,
          startTime: result.startTime,
          endTime: result.endTime,
          emailsProcessed: result.context.emails.length,
          actionsPerformed: result.context.actions.length,
        });
        
      } catch (error) {
        console.error(`Error executing scheduled agent ${schedule.agentId}:`, error);
        errors.push({
          scheduleId: schedule.id,
          agentId: schedule.agentId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Executed ${results.length} agents with ${errors.length} errors`,
      results,
      errors,
    });
    
  } catch (error) {
    console.error('Unhandled error in POST /api/cron/run-agents:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 