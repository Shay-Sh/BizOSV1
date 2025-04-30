// Agent Builder Types

// Base agent flow type that matches the database schema
export interface AgentFlow {
  id: string;
  name: string;
  description?: string;
  type: string;
  flow_data?: Record<string, any>;
  nodes?: any[];
  edges?: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_run_at?: string;
  user_id: string;
  organization_id?: string;
  settings?: AgentSettings;
}

// Agent settings 
export interface AgentSettings {
  notification_email?: string;
  run_on_trigger?: boolean;
  webhook_url?: string;
  custom_settings?: Record<string, any>;
}

// Node types
export type NodeType = 'triggerNode' | 'classifierNode' | 'actionNode';

// Base node data interface
export interface NodeData {
  nodeType: string;
  [key: string]: any;
}

// Trigger node data
export interface TriggerNodeData extends NodeData {
  nodeType: 'trigger';
  service: 'gmail';
  checkInterval: number;
  intervalUnit: string;
}

// Classifier node data
export interface ClassifierNodeData extends NodeData {
  nodeType: 'classifier';
  llmProvider: string;
  model: string;
  prompt: string;
}

// Action node data
export interface ActionNodeData extends NodeData {
  nodeType: 'action';
  actionType: string;
  service: string;
  label?: string;
}

// Gmail authentication token
export interface GmailAuthToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// LLM API key stored in database
export interface LlmApiKey {
  id: string;
  provider: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// Agent execution log
export interface AgentExecutionLog {
  id: string;
  agent_id: string;
  status: 'success' | 'error' | 'running';
  start_time: string;
  end_time?: string;
  error_message?: string;
  execution_details?: Record<string, any>;
  triggered_by: 'manual' | 'scheduled' | 'webhook';
  user_id?: string;
}

// Agent schedule
export interface AgentSchedule {
  id: string;
  agent_id: string;
  frequency: 'minutes' | 'hours' | 'days';
  interval: number;
  is_active: boolean;
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  updated_at: string;
}

// Gmail message structure (simplified)
export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
    parts?: any[];
    body?: {
      data?: string;
    };
    mimeType: string;
  };
  internalDate: string;
}

// LLM Provider details
export interface LlmProvider {
  id: string;
  name: string;
  models: LlmModel[];
  isAvailable: boolean;
  icon?: string;
}

// LLM Model details
export interface LlmModel {
  id: string;
  name: string;
  contextLength: number;
  isAvailable: boolean;
}

// Request for agent creation
export interface CreateAgentRequest {
  name: string;
  description?: string;
  type?: string;
  is_active?: boolean;
}

// Request for updating agent flow
export interface UpdateAgentFlowRequest {
  nodes: any[];
  edges: any[];
  settings?: AgentSettings;
  is_active?: boolean;
}

// Response from execution API
export interface ExecuteAgentResponse {
  executionId: string;
  status: 'started' | 'error';
  message?: string;
}

// Gmail label from the Gmail API
export interface GmailLabel {
  id: string;
  name: string;
  type?: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
  color?: {
    textColor: string;
    backgroundColor: string;
  };
} 