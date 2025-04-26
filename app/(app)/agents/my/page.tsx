'use client';

import { useState } from 'react';
import { FilterBar } from '@/components/ui/filter-bar';
import { Button } from '@/components/ui/button';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { GlassPanel } from '@/components/ui/glass-panel';
import { AgentCard } from '@/components/agents/AgentCard';
import { Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function MyAgentsPage() {
  const [filter, setFilter] = useState('all');
  
  // Filter categories for my agents
  const filterCategories = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Error', value: 'error' },
      ],
    },
    {
      name: 'category',
      label: 'Category',
      options: [
        { label: 'All Categories', value: 'all' },
        { label: 'Content Creation', value: 'content' },
        { label: 'Data Analysis', value: 'data' },
        { label: 'Customer Support', value: 'support' },
        { label: 'Finance', value: 'finance' },
        { label: 'Marketing', value: 'marketing' },
      ],
    },
    {
      name: 'sort',
      label: 'Sort By',
      options: [
        { label: 'Last Used', value: 'lastUsed' },
        { label: 'Name (A-Z)', value: 'nameAsc' },
        { label: 'Most Used', value: 'mostUsed' },
      ],
    },
  ];

  // Mock data for user's agents
  const myAgents = [
    {
      id: '1',
      name: 'Customer Inquiry Processor',
      description: 'Automatically process customer inquiries and route them to the appropriate department.',
      category: 'support',
      status: 'active',
      image: '🎧',
      usage: 350,
      usageLimit: 500,
      lastExecution: '2023-05-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Content Calendar Planner',
      description: 'Generate content ideas and schedule them on your content calendar.',
      category: 'content',
      status: 'active',
      image: '📝',
      usage: 120,
      usageLimit: 300,
      lastExecution: '2023-05-14T14:45:00Z',
    },
    {
      id: '3',
      name: 'Sales Data Analyzer',
      description: 'Analyze sales data and provide insights on trends and opportunities.',
      category: 'data',
      status: 'inactive',
      image: '📊',
      usage: 0,
      usageLimit: 200,
      lastExecution: '2023-05-10T09:15:00Z',
    },
    {
      id: '4',
      name: 'Email Campaign Builder',
      description: 'Create and schedule email campaigns with personalized content.',
      category: 'marketing',
      status: 'error',
      image: '📧',
      usage: 450,
      usageLimit: 500,
      lastExecution: '2023-05-15T08:30:00Z',
    },
    {
      id: '5',
      name: 'Invoice Generator',
      description: 'Generate professional invoices based on time tracking and project data.',
      category: 'finance',
      status: 'inactive',
      image: '💰',
      usage: 80,
      usageLimit: 200,
      lastExecution: '2023-05-12T11:20:00Z',
    },
  ];

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  const handleFilterChange = (category: string, value: string) => {
    if (category === 'status') {
      setFilter(value);
    }
    console.log(`Filter changed: ${category} = ${value}`);
  };

  const handleClearFilters = () => {
    setFilter('all');
    console.log('Filters cleared');
  };

  const handleStart = (id: string) => {
    console.log(`Starting agent ${id}`);
    // In a real app, this would start the agent
  };

  const handleStop = (id: string) => {
    console.log(`Stopping agent ${id}`);
    // In a real app, this would stop the agent
  };

  const handleEdit = (id: string) => {
    console.log(`Editing agent ${id}`);
    // In a real app, this would navigate to the agent editor
  };

  // Filter agents based on selected filter
  const filteredAgents = myAgents.filter(agent => {
    if (filter === 'all') return true;
    return agent.status === filter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your deployed AI agents</p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/marketplace">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpRight size={16} />
              Marketplace
            </Button>
          </Link>
          <Link href="/app/agents/builder">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Create Agent
            </Button>
          </Link>
        </div>
      </div>

      <FilterBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterCategories={filterCategories}
        placeholder="Search my agents..."
      />

      {/* Stats Row */}
      <DashboardGrid>
        <GlassPanel className="col-span-3">
          <h3 className="text-lg font-semibold mb-1">Total Agents</h3>
          <p className="text-3xl font-bold">{myAgents.length}</p>
        </GlassPanel>
        
        <GlassPanel className="col-span-3">
          <h3 className="text-lg font-semibold mb-1">Active Agents</h3>
          <p className="text-3xl font-bold">{myAgents.filter(a => a.status === 'active').length}</p>
        </GlassPanel>
        
        <GlassPanel className="col-span-3">
          <h3 className="text-lg font-semibold mb-1">Total Executions</h3>
          <p className="text-3xl font-bold">{myAgents.reduce((sum, agent) => sum + agent.usage, 0)}</p>
        </GlassPanel>
        
        <GlassPanel className="col-span-3">
          <h3 className="text-lg font-semibold mb-1">Usage Capacity</h3>
          <p className="text-3xl font-bold">
            {Math.round((myAgents.reduce((sum, agent) => sum + agent.usage, 0) / myAgents.reduce((sum, agent) => sum + agent.usageLimit, 0)) * 100)}%
          </p>
        </GlassPanel>
      </DashboardGrid>

      {/* My Agents */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">My Agents</h2>
        {filteredAgents.length === 0 ? (
          <GlassPanel>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No agents match your filters</p>
              <Link href="/app/marketplace">
                <Button variant="outline">Explore Marketplace</Button>
              </Link>
            </div>
          </GlassPanel>
        ) : (
          <DashboardGrid>
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                description={agent.description}
                image={agent.image}
                category={agent.category}
                status={agent.status as any}
                usage={agent.usage}
                usageLimit={agent.usageLimit}
                lastExecution={agent.lastExecution}
                isInMarketplace={false}
                onStart={handleStart}
                onStop={handleStop}
                onEdit={handleEdit}
                className="col-span-4"
              />
            ))}
          </DashboardGrid>
        )}
      </div>
    </div>
  );
} 