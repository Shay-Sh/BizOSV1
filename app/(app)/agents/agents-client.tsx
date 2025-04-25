'use client';

import { useState } from 'react';
import { 
  Search, Plus, MoreHorizontal, Play, Pause, Settings, 
  Trash2, Copy, Clock, PlusCircle, Bot, Grid, List, Filter
} from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  type: 'chatbot' | 'workflow' | 'integration';
  lastRun: string;
  executions: number;
  icon: string;
}

const agents: Agent[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and provides support information',
    status: 'active',
    type: 'chatbot',
    lastRun: '2 hours ago',
    executions: 1248,
    icon: 'CS'
  },
  {
    id: '2',
    name: 'Data Processor',
    description: 'Processes and analyzes data from multiple sources',
    status: 'active',
    type: 'workflow',
    lastRun: '4 hours ago',
    executions: 356,
    icon: 'DP'
  },
  {
    id: '3',
    name: 'Email Automation',
    description: 'Automatically sends and categorizes emails based on rules',
    status: 'inactive',
    type: 'integration',
    lastRun: '2 days ago',
    executions: 1893,
    icon: 'EA'
  },
  {
    id: '4',
    name: 'Lead Generator',
    description: 'Identifies and qualifies potential leads from various sources',
    status: 'draft',
    type: 'workflow',
    lastRun: 'Never',
    executions: 0,
    icon: 'LG'
  },
  {
    id: '5',
    name: 'Report Creator',
    description: 'Creates weekly and monthly reports from business data',
    status: 'active',
    type: 'workflow',
    lastRun: '1 day ago',
    executions: 42,
    icon: 'RC'
  },
  {
    id: '6',
    name: 'Social Media Monitor',
    description: 'Tracks and analyzes social media mentions and engagement',
    status: 'inactive',
    type: 'integration',
    lastRun: '5 days ago',
    executions: 267,
    icon: 'SM'
  }
];

const AgentCard = ({ agent }: { agent: Agent }) => {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
    inactive: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30',
    draft: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
  };

  const typeColors = {
    chatbot: 'bg-purple-500/20 text-purple-400',
    workflow: 'bg-cyan-500/20 text-cyan-400',
    integration: 'bg-pink-500/20 text-pink-400'
  };
  
  return (
    <Card className="bg-indigo-800/30 border-indigo-800/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Avatar className="mr-3 h-10 w-10 bg-indigo-700 text-blue-300">
              <AvatarFallback>{agent.icon}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              <Badge variant="outline" className={`mt-1 ${typeColors[agent.type]}`}>
                {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-indigo-900/90 backdrop-blur-md border-indigo-700 text-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-indigo-700" />
              <DropdownMenuItem className="focus:bg-indigo-800">
                <Settings className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-indigo-800">
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-indigo-700" />
              <DropdownMenuItem className="text-red-400 focus:bg-red-950/50 focus:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-gray-300 text-sm mb-4">{agent.description}</p>
        
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last run: {agent.lastRun}</span>
          </div>
          <div>
            <span>Executions: {agent.executions.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 border-t border-indigo-800/50">
        <div className="grid grid-cols-2 w-full">
          <Button 
            variant="ghost" 
            className={`rounded-none py-3 ${statusColors[agent.status]}`}
          >
            {agent.status === 'active' ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                <span>Deactivate</span>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                <span>Activate</span>
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none py-3 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Configure</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function AgentsClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Agents</h1>
          <p className="text-slate-400 mt-1">Manage and deploy your AI agents</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </header>
      
      <GlassPanel className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 bg-indigo-800/30 border border-indigo-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-indigo-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex rounded-md overflow-hidden border border-indigo-700">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="icon" 
                className={viewMode === 'grid' 
                  ? 'rounded-none bg-blue-600 hover:bg-blue-700' 
                  : 'rounded-none border-0 text-gray-400 hover:text-white'}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="icon" 
                className={viewMode === 'list' 
                  ? 'rounded-none bg-blue-600 hover:bg-blue-700' 
                  : 'rounded-none border-0 text-gray-400 hover:text-white'}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </GlassPanel>
      
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      
      <GlassPanel className="p-6 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 rounded-full bg-blue-600/20 mb-4">
            <Bot className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Need more agents?</h3>
          <p className="text-gray-300 mb-4">Visit our marketplace to discover pre-built agents for various use cases</p>
          <Button variant="outline" className="border-blue-700 text-blue-400 hover:bg-blue-900/30">
            Open Marketplace
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
} 