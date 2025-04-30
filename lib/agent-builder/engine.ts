import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import gmailService, { EmailData } from './gmail-service';
import llmService, { ClassificationResult } from './llm-service';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Node types
export enum NodeType {
  TRIGGER = 'trigger',
  CLASSIFIER = 'classifier',
  ACTION = 'action',
}

// Node data structures
export interface BaseNodeData {
  id: string;
  type: NodeType;
  name: string;
}

export interface TriggerNodeData extends BaseNodeData {
  type: NodeType.TRIGGER;
  config: {
    maxEmails: number;
    filterCriteria?: string;
  };
}

export interface ClassifierNodeData extends BaseNodeData {
  type: NodeType.CLASSIFIER;
  config: {
    provider: string;
    model: string;
    categories: string[];
    systemPrompt?: string;
  };
}

export interface ActionNodeData extends BaseNodeData {
  type: NodeType.ACTION;
  config: {
    actionType: 'label' | 'archive' | 'move';
    category: string;
    labelName?: string;
    labelId?: string;
  };
}

export type NodeData = TriggerNodeData | ClassifierNodeData | ActionNodeData;

// Edge structure
export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

// Flow structure
export interface Flow {
  id: string;
  name: string;
  nodes: NodeData[];
  edges: Edge[];
}

// Execution context to pass between nodes
export interface ExecutionContext {
  userId: string;
  agentId: string;
  emails: EmailData[];
  classifications: Record<string, ClassificationResult>;
  actions: {
    emailId: string;
    action: string;
    success: boolean;
    message?: string;
  }[];
  error?: string;
}

// Execution result
export interface ExecutionResult {
  agentId: string;
  success: boolean;
  context: ExecutionContext;
  startTime: string;
  endTime: string;
  error?: string;
}

class AgentEngine {
  /**
   * Execute an agent flow
   */
  async executeFlow(agentId: string, userId: string, triggeredBy: string = 'manual'): Promise<ExecutionResult> {
    const startTime = new Date().toISOString();
    
    try {
      // Fetch agent details from database
      const { data: agent, error: agentError } = await supabase
        .from('agent_flows')
        .select('*')
        .eq('id', agentId)
        .single();
      
      if (agentError || !agent) {
        throw new Error(`Agent not found: ${agentError?.message}`);
      }
      
      // Create initial execution log
      const { data: executionLog, error: logError } = await supabase
        .from('agent_execution_logs')
        .insert({
          agent_id: agentId,
          user_id: userId,
          status: 'running',
          start_time: startTime,
          triggered_by: triggeredBy,
        })
        .select()
        .single();
      
      if (logError) {
        throw new Error(`Failed to create execution log: ${logError.message}`);
      }
      
      // Parse flow data
      const flow: Flow = {
        id: agent.id,
        name: agent.name,
        nodes: agent.nodes as NodeData[] || [],
        edges: agent.edges as Edge[] || [],
      };
      
      // Create initial execution context
      const context: ExecutionContext = {
        userId,
        agentId,
        emails: [],
        classifications: {},
        actions: [],
      };
      
      // Find trigger node to start with
      const triggerNode = flow.nodes.find(node => node.type === NodeType.TRIGGER) as TriggerNodeData | undefined;
      
      if (!triggerNode) {
        throw new Error('No trigger node found in flow');
      }
      
      // Execute the flow starting from the trigger node
      const result = await this.executeNode(triggerNode.id, flow, context);
      
      // Update execution log
      const endTime = new Date().toISOString();
      const executionResult: ExecutionResult = {
        agentId,
        success: !result.error,
        context: result,
        startTime,
        endTime,
      };
      
      await supabase
        .from('agent_execution_logs')
        .update({
          status: result.error ? 'failed' : 'completed',
          end_time: endTime,
          error_message: result.error,
          execution_details: executionResult as any,
        })
        .eq('id', executionLog.id);
      
      // Update agent last run time
      await supabase
        .from('agent_flows')
        .update({
          last_run_at: endTime,
        })
        .eq('id', agentId);
      
      return executionResult;
    } catch (error) {
      // Handle any uncaught errors
      const endTime = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Try to update the execution log if it exists
      try {
        await supabase
          .from('agent_execution_logs')
          .update({
            status: 'failed',
            end_time: endTime,
            error_message: errorMessage,
          })
          .eq('agent_id', agentId)
          .eq('user_id', userId)
          .eq('start_time', startTime);
      } catch (logError) {
        console.error('Failed to update execution log:', logError);
      }
      
      return {
        agentId,
        success: false,
        context: {
          userId,
          agentId,
          emails: [],
          classifications: {},
          actions: [],
          error: errorMessage,
        },
        startTime,
        endTime,
        error: errorMessage,
      };
    }
  }
  
  /**
   * Execute a node and follow the flow
   */
  private async executeNode(
    nodeId: string,
    flow: Flow,
    context: ExecutionContext
  ): Promise<ExecutionContext> {
    // Find the node to execute
    const node = flow.nodes.find(n => n.id === nodeId);
    
    if (!node) {
      return {
        ...context,
        error: `Node ${nodeId} not found in flow`,
      };
    }
    
    try {
      // Execute the node based on its type
      let newContext: ExecutionContext;
      
      switch (node.type) {
        case NodeType.TRIGGER:
          newContext = await this.executeTriggerNode(node as TriggerNodeData, context);
          break;
        case NodeType.CLASSIFIER:
          newContext = await this.executeClassifierNode(node as ClassifierNodeData, context);
          break;
        case NodeType.ACTION:
          newContext = await this.executeActionNode(node as ActionNodeData, context);
          break;
        default:
          return {
            ...context,
            error: `Unknown node type: ${(node as BaseNodeData).type}`,
          };
      }
      
      // Find outgoing edges
      const edges = flow.edges.filter(edge => edge.source === nodeId);
      
      // If no outgoing edges, we're done with this branch
      if (edges.length === 0) {
        return newContext;
      }
      
      // For each edge, execute the target node
      for (const edge of edges) {
        // Check if the edge has a condition
        if (edge.condition) {
          // Check if the condition is satisfied
          const isSatisfied = this.evaluateCondition(edge.condition, newContext);
          
          if (!isSatisfied) {
            continue; // Skip this edge if condition not met
          }
        }
        
        // Execute the target node
        newContext = await this.executeNode(edge.target, flow, newContext);
        
        // If there was an error, stop execution
        if (newContext.error) {
          return newContext;
        }
      }
      
      return newContext;
    } catch (error) {
      console.error(`Error executing node ${nodeId}:`, error);
      return {
        ...context,
        error: `Error executing node ${(node as BaseNodeData).name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Execute a trigger node to fetch emails
   */
  private async executeTriggerNode(
    node: TriggerNodeData,
    context: ExecutionContext
  ): Promise<ExecutionContext> {
    try {
      // Fetch emails from Gmail
      const emails = await gmailService.getRecentEmails(
        context.userId,
        node.config.maxEmails || 10
      );
      
      return {
        ...context,
        emails,
      };
    } catch (error) {
      console.error('Error executing trigger node:', error);
      return {
        ...context,
        error: `Error executing trigger node: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Execute a classifier node to categorize emails
   */
  private async executeClassifierNode(
    node: ClassifierNodeData,
    context: ExecutionContext
  ): Promise<ExecutionContext> {
    try {
      const { emails } = context;
      const classifications: Record<string, ClassificationResult> = {};
      
      // Classify each email
      for (const email of emails) {
        const classification = await llmService.classifyEmail(email, {
          provider: node.config.provider,
          model: node.config.model,
          categories: node.config.categories,
          systemPrompt: node.config.systemPrompt,
        });
        
        classifications[email.id] = classification;
      }
      
      return {
        ...context,
        classifications,
      };
    } catch (error) {
      console.error('Error executing classifier node:', error);
      return {
        ...context,
        error: `Error executing classifier node: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Execute an action node to perform actions on emails
   */
  private async executeActionNode(
    node: ActionNodeData,
    context: ExecutionContext
  ): Promise<ExecutionContext> {
    try {
      const { emails, classifications } = context;
      const actions = [...context.actions];
      
      for (const email of emails) {
        const classification = classifications[email.id];
        
        // Skip if email not classified or doesn't match the category
        if (!classification || classification.category !== node.config.category) {
          continue;
        }
        
        // Perform action based on action type
        if (node.config.actionType === 'label') {
          try {
            // Check if we need to create a new label
            let labelId = node.config.labelId;
            const labelName = node.config.labelName || node.config.category;
            
            if (!labelId) {
              // Get existing labels
              const labels = await gmailService.getLabels(context.userId);
              let label = labels.find(l => l.name === labelName);
              
              if (!label) {
                // Create new label
                label = await gmailService.createLabel(context.userId, labelName);
              }
              
              labelId = label.id;
            }
            
            // Apply label to email
            await gmailService.applyLabel(context.userId, email.id, labelId);
            
            actions.push({
              emailId: email.id,
              action: `Applied label ${labelName}`,
              success: true,
            });
          } catch (error) {
            actions.push({
              emailId: email.id,
              action: 'Apply label',
              success: false,
              message: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
        // Implement other action types as needed
      }
      
      return {
        ...context,
        actions,
      };
    } catch (error) {
      console.error('Error executing action node:', error);
      return {
        ...context,
        error: `Error executing action node: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
  
  /**
   * Evaluate a condition for an edge
   */
  private evaluateCondition(condition: string, context: ExecutionContext): boolean {
    try {
      // Simple implementation for now: check if the condition is a category name
      // and if any emails are classified with that category
      const { classifications } = context;
      
      return Object.values(classifications).some(classification => classification.category === condition);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }
}

export default new AgentEngine(); 