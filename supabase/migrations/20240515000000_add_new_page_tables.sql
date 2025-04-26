-- Knowledge Base tables
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  organization_id UUID,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_base_id UUID REFERENCES knowledge_bases NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  file_type TEXT,
  status TEXT DEFAULT 'processing',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval Center tables
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  workflow_execution_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  due_date TIMESTAMP WITH TIME ZONE,
  requested_by UUID REFERENCES auth.users NOT NULL,
  assigned_to UUID REFERENCES auth.users,
  context_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_request_id UUID REFERENCES approval_requests NOT NULL,
  decision TEXT NOT NULL,
  comment TEXT,
  decided_by UUID REFERENCES auth.users NOT NULL,
  decided_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation tables
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  agent_id UUID,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  sender_type TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Knowledge Base Policies
CREATE POLICY "Knowledge bases are viewable by their creator"
  ON knowledge_bases
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Knowledge bases are editable by their creator"
  ON knowledge_bases
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Knowledge bases can be created by authenticated users"
  ON knowledge_bases
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Knowledge Documents Policies
CREATE POLICY "Documents are viewable by their creator"
  ON knowledge_documents
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Documents are editable by their creator"
  ON knowledge_documents
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Documents can be created by authenticated users"
  ON knowledge_documents
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Approval Requests Policies
CREATE POLICY "Approval requests are viewable by requester or assignee"
  ON approval_requests
  FOR SELECT
  USING (auth.uid() = requested_by OR auth.uid() = assigned_to);

CREATE POLICY "Approval requests are editable by requester"
  ON approval_requests
  FOR UPDATE
  USING (auth.uid() = requested_by);

CREATE POLICY "Approval requests can be created by authenticated users"
  ON approval_requests
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Approval Decisions Policies
CREATE POLICY "Approval decisions are viewable by associated users"
  ON approval_decisions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM approval_requests
    WHERE approval_requests.id = approval_decisions.approval_request_id
    AND (auth.uid() = approval_requests.requested_by OR auth.uid() = approval_requests.assigned_to)
  ));

CREATE POLICY "Approval decisions can be created by assignee"
  ON approval_decisions
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM approval_requests
    WHERE approval_requests.id = approval_request_id
    AND auth.uid() = approval_requests.assigned_to
  ));

-- Conversations Policies
CREATE POLICY "Conversations are viewable by their owner"
  ON conversations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Conversations are editable by their owner"
  ON conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Conversations can be created by authenticated users"
  ON conversations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Messages are viewable by conversation owner"
  ON messages
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND auth.uid() = conversations.user_id
  ));

CREATE POLICY "Messages can be created for own conversations"
  ON messages
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND auth.uid() = conversations.user_id
  )); 