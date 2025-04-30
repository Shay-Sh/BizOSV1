-- Migration for Agent Builder tables

-- Table for storing agent flow definitions
CREATE TABLE IF NOT EXISTS agent_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'email',
  flow_data JSONB,
  nodes JSONB,
  edges JSONB,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_run_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Table for storing Gmail OAuth tokens
CREATE TABLE IF NOT EXISTS gmail_auth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT NOT NULL,
  scope TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for storing LLM API keys (only accessible to super admins)
CREATE TABLE IF NOT EXISTS llm_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Table for storing agent execution logs
CREATE TABLE IF NOT EXISTS agent_execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agent_flows(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL, -- 'success', 'error', 'running'
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  error_message TEXT,
  execution_details JSONB,
  triggered_by TEXT, -- 'manual', 'scheduled', 'webhook'
  user_id UUID REFERENCES auth.users(id)
);

-- Table for storing scheduled agent runs
CREATE TABLE IF NOT EXISTS agent_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agent_flows(id) ON DELETE CASCADE NOT NULL,
  frequency TEXT NOT NULL, -- 'minutes', 'hours', 'days'
  interval INTEGER NOT NULL, -- numeric value for frequency
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a user_roles table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies

-- Agent flows policies
ALTER TABLE agent_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent flows"
  ON agent_flows
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agent flows"
  ON agent_flows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent flows"
  ON agent_flows
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agent flows"
  ON agent_flows
  FOR DELETE
  USING (auth.uid() = user_id);

-- Gmail auth tokens policies
ALTER TABLE gmail_auth_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Gmail auth tokens"
  ON gmail_auth_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Gmail auth tokens"
  ON gmail_auth_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Gmail auth tokens"
  ON gmail_auth_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Gmail auth tokens"
  ON gmail_auth_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- LLM API keys policies (only super admins)
ALTER TABLE llm_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can manage LLM API keys"
  ON llm_api_keys
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
    )
  );

-- Agent execution logs policies
ALTER TABLE agent_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent execution logs"
  ON agent_execution_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent_flows
      WHERE agent_flows.id = agent_execution_logs.agent_id
      AND agent_flows.user_id = auth.uid()
    )
  );

-- Agent schedules policies
ALTER TABLE agent_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent schedules"
  ON agent_schedules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent_flows
      WHERE agent_flows.id = agent_schedules.agent_id
      AND agent_flows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own agent schedules"
  ON agent_schedules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM agent_flows
      WHERE agent_flows.id = agent_schedules.agent_id
      AND agent_flows.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS agent_flows_user_id_idx ON agent_flows(user_id);
CREATE INDEX IF NOT EXISTS agent_flows_is_active_idx ON agent_flows(is_active);
CREATE INDEX IF NOT EXISTS gmail_auth_tokens_user_id_idx ON gmail_auth_tokens(user_id);
CREATE INDEX IF NOT EXISTS agent_execution_logs_agent_id_idx ON agent_execution_logs(agent_id);
CREATE INDEX IF NOT EXISTS agent_schedules_agent_id_idx ON agent_schedules(agent_id);
CREATE INDEX IF NOT EXISTS agent_schedules_next_run_at_idx ON agent_schedules(next_run_at);

-- Add a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update the updated_at column automatically
CREATE TRIGGER set_updated_at_agent_flows
BEFORE UPDATE ON agent_flows
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_gmail_auth_tokens
BEFORE UPDATE ON gmail_auth_tokens
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_llm_api_keys
BEFORE UPDATE ON llm_api_keys
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at_agent_schedules
BEFORE UPDATE ON agent_schedules
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column(); 