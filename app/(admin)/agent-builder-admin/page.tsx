import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ApiKeyForm from '@/components/Admin/ApiKeyForm';

export const metadata: Metadata = {
  title: 'Agent Builder Admin',
  description: 'Manage Agent Builder settings and API keys',
};

export default async function AgentBuilderAdminPage() {
  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies });
  
  // Verify the user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }
  
  // Check if the user is an admin
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  if (profileError || !userProfile?.is_admin) {
    redirect('/dashboard');
  }
  
  // Get stats about agents
  const { data: agentStats, error: statsError } = await supabase
    .from('agent_flows')
    .select('id, user_id, is_active, created_at')
    .order('created_at', { ascending: false });
  
  // Get execution logs stats
  const { data: executionStats, error: execError } = await supabase
    .from('agent_execution_logs')
    .select('id, status, start_time')
    .order('start_time', { ascending: false })
    .limit(100);
  
  // Calculate some stats
  const totalAgents = agentStats?.length || 0;
  const activeAgents = agentStats?.filter(agent => agent.is_active).length || 0;
  const uniqueUsers = new Set(agentStats?.map(agent => agent.user_id)).size || 0;
  
  const totalExecutions = executionStats?.length || 0;
  const successfulExecutions = executionStats?.filter(log => log.status === 'completed').length || 0;
  const failedExecutions = executionStats?.filter(log => log.status === 'failed').length || 0;
  
  // Group executions by day for the last 7 days
  const executionsByDay: { [key: string]: number } = {};
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split('T')[0];
    executionsByDay[dateString] = 0;
  }
  
  executionStats?.forEach(log => {
    const date = new Date(log.start_time);
    if (date >= sevenDaysAgo) {
      const dateString = date.toISOString().split('T')[0];
      executionsByDay[dateString] = (executionsByDay[dateString] || 0) + 1;
    }
  });
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Agent Builder Admin</h1>
        <p className="text-muted-foreground">
          Manage settings and API keys for the Agent Builder system
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Total Agents</h3>
          <p className="text-3xl font-bold">{totalAgents}</p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Active Agents</h3>
          <p className="text-3xl font-bold">{activeAgents}</p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Users</h3>
          <p className="text-3xl font-bold">{uniqueUsers}</p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium text-muted-foreground">Executions (Last 7 Days)</h3>
          <p className="text-3xl font-bold">{totalExecutions}</p>
          <div className="mt-2 text-xs">
            <span className="text-green-600">{successfulExecutions} successful</span>
            {' · '}
            <span className="text-red-600">{failedExecutions} failed</span>
          </div>
        </div>
      </div>
      
      {/* Recent executions chart (simplified) */}
      <div className="border rounded-lg p-4 bg-card">
        <h2 className="text-lg font-medium mb-4">Recent Executions</h2>
        <div className="h-40 flex items-end space-x-2">
          {Object.entries(executionsByDay)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, count]) => {
              const maxCount = Math.max(...Object.values(executionsByDay));
              const height = maxCount ? (count / maxCount) * 100 : 0;
              return (
                <div key={date} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary/80 rounded-t"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  ></div>
                  <div className="text-xs mt-2 rotate-45 origin-top-left">
                    {new Date(date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      
      {/* API Key management */}
      <div className="border rounded-lg p-6 bg-card">
        <ApiKeyForm />
      </div>
    </div>
  );
} 