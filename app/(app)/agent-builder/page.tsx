import React from 'react';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PlusCircle, Settings, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import NewAgentModal from '@/components/AgentBuilder/NewAgentModal';

export const dynamic = 'force-dynamic';

async function getAgents() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: agents, error } = await supabase
    .from('agent_flows')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
  
  return agents || [];
}

export default async function AgentBuilderPage() {
  const agents = await getAgents();
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agent Builder</h1>
          <p className="text-muted-foreground">
            Create and manage your automated email agents
          </p>
        </div>
        <NewAgentModal>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            Create New Agent
          </Button>
        </NewAgentModal>
      </div>
      
      {agents.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Agents Yet</CardTitle>
            <CardDescription>
              Get started by creating your first email automation agent
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <NewAgentModal>
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Create Your First Agent
              </Button>
            </NewAgentModal>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Agents</CardTitle>
            <CardDescription>
              Manage and monitor your existing agents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/agent-builder/${agent.id}`}
                        className="hover:underline text-primary flex items-center gap-1"
                      >
                        {agent.name}
                        <ExternalLink size={14} />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={agent.is_active ? 'default' : 'secondary'}
                        className={agent.is_active ? 'bg-green-500' : ''}
                      >
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.type || 'Email Agent'}</TableCell>
                    <TableCell>
                      {agent.last_run_at 
                        ? new Date(agent.last_run_at).toLocaleString()
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {new Date(agent.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/agent-builder/${agent.id}`}>
                        <Button variant="ghost" size="icon">
                          <Settings size={16} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 