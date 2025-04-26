import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agents | BizOS',
  description: 'Manage your AI agents and workflows',
};

export default function AgentsPage() {
  // Sample agent data
  const agents = [
    {
      id: 'agent-1',
      name: 'Data Analyst',
      description: 'Analyzes and visualizes data from various sources',
      status: 'active',
      lastRun: '2 hours ago',
      category: 'Analytics',
      tasks: 245,
      createdOn: '2023-04-12',
    },
    {
      id: 'agent-2',
      name: 'Customer Support Assistant',
      description: 'Handles customer inquiries and routes to appropriate departments',
      status: 'active',
      lastRun: '10 minutes ago',
      category: 'Support',
      tasks: 1245,
      createdOn: '2023-02-28',
    },
    {
      id: 'agent-3',
      name: 'Invoice Processor',
      description: 'Extracts data from invoices and enters into accounting system',
      status: 'inactive',
      lastRun: '5 days ago',
      category: 'Finance',
      tasks: 89,
      createdOn: '2023-05-16',
    },
    {
      id: 'agent-4',
      name: 'Marketing Campaign Manager',
      description: 'Schedules and monitors email and social media campaigns',
      status: 'active',
      lastRun: '1 day ago',
      category: 'Marketing',
      tasks: 156,
      createdOn: '2023-03-22',
    },
    {
      id: 'agent-5',
      name: 'Sales Lead Qualifier',
      description: 'Evaluates and scores incoming sales leads',
      status: 'paused',
      lastRun: '3 days ago',
      category: 'Sales',
      tasks: 427,
      createdOn: '2023-01-15',
    }
  ];

  const activeAgents = agents.filter(agent => agent.status === 'active');
  const inactiveAgents = agents.filter(agent => agent.status !== 'active');

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agents</h1>
          <p className="text-muted-foreground">Create and manage AI agents for your business processes</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
          Create New Agent
        </button>
      </header>

      <div className="flex space-x-4 pb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search agents..." 
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <select className="px-4 py-2 border rounded-md bg-background">
          <option value="">All Categories</option>
          <option value="Analytics">Analytics</option>
          <option value="Support">Support</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>
        <select className="px-4 py-2 border rounded-md bg-background">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Active Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAgents.map((agent) => (
              <div key={agent.id} className="border rounded-lg bg-card overflow-hidden hover:border-primary cursor-pointer transition-colors">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Category: {agent.category}</span>
                    <span>Tasks: {agent.tasks}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>Created: {agent.createdOn}</span>
                    <span>Last run: {agent.lastRun}</span>
                  </div>
                </div>
                <div className="p-3 bg-muted flex justify-between items-center">
                  <button className="text-xs text-blue-600 hover:underline">Configure</button>
                  <button className="text-xs text-blue-600 hover:underline">Run Now</button>
                  <button className="text-xs text-blue-600 hover:underline">View History</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {inactiveAgents.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Inactive Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveAgents.map((agent) => (
                <div key={agent.id} className="border rounded-lg bg-card overflow-hidden hover:border-primary cursor-pointer transition-colors opacity-70">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        agent.status === 'paused' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Category: {agent.category}</span>
                      <span>Tasks: {agent.tasks}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>Created: {agent.createdOn}</span>
                      <span>Last run: {agent.lastRun}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted flex justify-between items-center">
                    <button className="text-xs text-blue-600 hover:underline">Configure</button>
                    <button className="text-xs text-blue-600 hover:underline">Activate</button>
                    <button className="text-xs text-blue-600 hover:underline">View History</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 