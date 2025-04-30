"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [name, setName] = useState('Debug Test Agent');
  const [description, setDescription] = useState('Created for debugging');

  const testAgentCreation = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/debug-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          type: 'gmail',
          isActive: false,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testStandardEndpoint = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/agent-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          type: 'gmail',
          isActive: false,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API Debug Page</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Agent Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Debug Test Agent"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Created for debugging"
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={testAgentCreation} 
                  disabled={loading}
                >
                  {loading ? 'Testing...' : 'Test Debug Endpoint'}
                </Button>
                
                <Button 
                  onClick={testStandardEndpoint} 
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? 'Testing...' : 'Test Standard Endpoint'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>
                {result.success ? '✅ Success' : '❌ Error'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-[400px]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
              
              {result.debugLog && (
                <>
                  <Separator className="my-4" />
                  <h3 className="font-medium mb-2">Debug Log</h3>
                  <div className="space-y-1">
                    {result.debugLog.map((log: string, index: number) => (
                      <div 
                        key={index} 
                        className={`text-sm p-1 ${log.includes('✗') ? 'text-red-500' : log.includes('✓') ? 'text-green-500' : ''}`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 