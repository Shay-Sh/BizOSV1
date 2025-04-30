"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { AgentFlow } from '@/types/agent-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AgentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agent, setAgent] = useState<AgentFlow | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Fetch agent data when the component mounts
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/agent-builder/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch agent data');
        }
        
        const data = await response.json();
        setAgent(data.agent);
        setName(data.agent.name || '');
        setDescription(data.agent.description || '');
      } catch (error) {
        console.error('Error fetching agent:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agent data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgent();
  }, [params.id, toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!agent) return;
      
      const response = await fetch(`/api/agent-builder/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          // Preserve existing nodes and edges
          nodes: agent.nodes || [],
          edges: agent.edges || [],
          settings: agent.settings || {},
          is_active: agent.is_active,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update agent');
      }
      
      const updatedAgent = await response.json();
      setAgent(updatedAgent.agent);
      
      toast({
        title: 'Success',
        description: 'Agent updated successfully',
      });
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to update agent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <p className="text-muted-foreground mb-4">The agent you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/agent-builder">
            <Button variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/agent-builder">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Agent</h1>
            <p className="text-muted-foreground">Configure your agent workflow</p>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Gmail Agent"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this agent does"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Agent Builder (Coming Soon)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 flex flex-col items-center justify-center border rounded-md border-dashed">
              <p className="text-muted-foreground text-center">
                The agent builder UI is being restored. Please check back soon or create a test agent from the test page.
              </p>
              <Link href="/agent-builder/test" className="mt-4">
                <Button variant="outline">Go to Test Page</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 