import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import {
  AgentFlow,
  AgentExecutionLog,
  GmailAuthToken,
  LlmApiKey,
  AgentSchedule,
  CreateAgentRequest,
  UpdateAgentFlowRequest,
} from '@/types/agent-builder';

// Create a new agent flow
export async function createAgentFlow(data: CreateAgentRequest): Promise<AgentFlow | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Get the current user
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    console.error('Error getting user:', userError);
    return null;
  }
  
  // Create the agent flow
  const { data: agent, error } = await supabase
    .from('agent_flows')
    .insert({
      name: data.name,
      description: data.description || '',
      type: data.type || 'email',
      is_active: data.is_active || false,
      user_id: user.user.id,
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating agent flow:', error);
    return null;
  }
  
  return agent as unknown as AgentFlow;
}

// Get an agent flow by ID
export async function getAgentFlowById(id: string): Promise<AgentFlow | null> {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: agent, error } = await supabase
    .from('agent_flows')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching agent flow:', error);
    return null;
  }
  
  return agent as unknown as AgentFlow;
}

// Update an agent flow
export async function updateAgentFlow(id: string, data: UpdateAgentFlowRequest): Promise<AgentFlow | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  const { data: agent, error } = await supabase
    .from('agent_flows')
    .update({
      nodes: data.nodes,
      edges: data.edges,
      settings: data.settings,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error updating agent flow:', error);
    return null;
  }
  
  return agent as unknown as AgentFlow;
}

// Delete an agent flow
export async function deleteAgentFlow(id: string): Promise<boolean> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  const { error } = await supabase
    .from('agent_flows')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting agent flow:', error);
    return false;
  }
  
  return true;
}

// Get all agent flows for the current user
export async function getUserAgentFlows(): Promise<AgentFlow[]> {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: agents, error } = await supabase
    .from('agent_flows')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching agent flows:', error);
    return [];
  }
  
  return agents as unknown as AgentFlow[];
}

// Save Gmail auth token for a user
export async function saveGmailAuthToken(
  userId: string, 
  accessToken: string, 
  refreshToken: string,
  tokenType: string,
  scope: string,
  expiresAt: Date
): Promise<GmailAuthToken | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Check if the user already has a token
  const { data: existingToken } = await supabase
    .from('gmail_auth_tokens')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (existingToken) {
    // Update existing token
    const { data: updatedToken, error } = await supabase
      .from('gmail_auth_tokens')
      .update({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        scope: scope,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating Gmail auth token:', error);
      return null;
    }
    
    return updatedToken as unknown as GmailAuthToken;
  } else {
    // Create new token
    const { data: newToken, error } = await supabase
      .from('gmail_auth_tokens')
      .insert({
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        scope: scope,
        expires_at: expiresAt.toISOString(),
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating Gmail auth token:', error);
      return null;
    }
    
    return newToken as unknown as GmailAuthToken;
  }
}

// Get Gmail auth token for a user
export async function getGmailAuthToken(userId: string): Promise<GmailAuthToken | null> {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: token, error } = await supabase
    .from('gmail_auth_tokens')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching Gmail auth token:', error);
    return null;
  }
  
  return token as unknown as GmailAuthToken;
}

// Check if user has valid Gmail auth token
export async function hasValidGmailAuth(userId: string): Promise<boolean> {
  const token = await getGmailAuthToken(userId);
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  const expiresAt = new Date(token.expires_at);
  const now = new Date();
  
  return expiresAt > now;
}

// Create a new execution log
export async function createExecutionLog(
  agentId: string,
  triggeredBy: 'manual' | 'scheduled' | 'webhook' = 'manual'
): Promise<AgentExecutionLog | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Get the current user
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  
  const { data: log, error } = await supabase
    .from('agent_execution_logs')
    .insert({
      agent_id: agentId,
      status: 'running',
      triggered_by: triggeredBy,
      user_id: userId,
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating execution log:', error);
    return null;
  }
  
  return log as unknown as AgentExecutionLog;
}

// Update an execution log
export async function updateExecutionLog(
  logId: string,
  status: 'success' | 'error' | 'running',
  errorMessage?: string,
  executionDetails?: Record<string, any>
): Promise<AgentExecutionLog | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  const updates: any = {
    status,
  };
  
  if (status === 'success' || status === 'error') {
    updates.end_time = new Date().toISOString();
  }
  
  if (errorMessage) {
    updates.error_message = errorMessage;
  }
  
  if (executionDetails) {
    updates.execution_details = executionDetails;
  }
  
  const { data: log, error } = await supabase
    .from('agent_execution_logs')
    .update(updates)
    .eq('id', logId)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error updating execution log:', error);
    return null;
  }
  
  return log as unknown as AgentExecutionLog;
}

// Get execution logs for an agent
export async function getAgentExecutionLogs(agentId: string, limit = 10): Promise<AgentExecutionLog[]> {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: logs, error } = await supabase
    .from('agent_execution_logs')
    .select('*')
    .eq('agent_id', agentId)
    .order('start_time', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching execution logs:', error);
    return [];
  }
  
  return logs as unknown as AgentExecutionLog[];
}

// Admin functions for LLM API keys

// Get all LLM API keys (admin only)
export async function getLlmApiKeys(): Promise<LlmApiKey[]> {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: keys, error } = await supabase
    .from('llm_api_keys')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching LLM API keys:', error);
    return [];
  }
  
  return keys as unknown as LlmApiKey[];
}

// Create a new LLM API key (admin only)
export async function createLlmApiKey(provider: string, apiKey: string): Promise<LlmApiKey | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Get the current user
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;
  
  const { data: key, error } = await supabase
    .from('llm_api_keys')
    .insert({
      provider,
      api_key: apiKey,
      created_by: userId,
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating LLM API key:', error);
    return null;
  }
  
  return key as unknown as LlmApiKey;
}

// Get active LLM API key for a provider
export async function getActiveLlmApiKey(provider: string): Promise<string | null> {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: key, error } = await supabase
    .from('llm_api_keys')
    .select('api_key')
    .eq('provider', provider)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  
  if (error || !key) {
    console.error('Error fetching LLM API key:', error);
    return null;
  }
  
  return key.api_key;
}

// Create or update agent schedule
export async function upsertAgentSchedule(
  agentId: string,
  frequency: 'minutes' | 'hours' | 'days',
  interval: number
): Promise<AgentSchedule | null> {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Calculate next run time
  const now = new Date();
  const nextRun = new Date(now);
  
  switch (frequency) {
    case 'minutes':
      nextRun.setMinutes(now.getMinutes() + interval);
      break;
    case 'hours':
      nextRun.setHours(now.getHours() + interval);
      break;
    case 'days':
      nextRun.setDate(now.getDate() + interval);
      break;
  }
  
  // Check if schedule already exists
  const { data: existingSchedule } = await supabase
    .from('agent_schedules')
    .select('*')
    .eq('agent_id', agentId)
    .maybeSingle();
  
  let result;
  
  if (existingSchedule) {
    // Update existing schedule
    const { data, error } = await supabase
      .from('agent_schedules')
      .update({
        frequency,
        interval,
        next_run_at: nextRun.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', existingSchedule.id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating agent schedule:', error);
      return null;
    }
    
    result = data;
  } else {
    // Create new schedule
    const { data, error } = await supabase
      .from('agent_schedules')
      .insert({
        agent_id: agentId,
        frequency,
        interval,
        next_run_at: nextRun.toISOString(),
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating agent schedule:', error);
      return null;
    }
    
    result = data;
  }
  
  return result as unknown as AgentSchedule;
} 