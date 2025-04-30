'use client';

import { useState, useEffect } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clipboard, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type UserApiKeyFormProps = {
  userId: string;
};

export function UserApiKeyForm({ userId }: UserApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyName, setApiKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  
  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'biz_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(result);
  };
  
  const createApiKey = async () => {
    if (!apiKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your API key',
        variant: 'destructive',
      });
      return;
    }
    
    const supabase = getBrowserSupabase();
    if (!supabase) {
      toast({
        title: 'Error',
        description: 'Failed to initialize Supabase client',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const hashed_key = btoa(apiKey); // Simple encoding for demo purposes
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name: apiKeyName,
            key: hashed_key,
            user_id: userId,
            is_active: true,
          },
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'API Key Created',
        description: 'Your new API key has been created successfully',
      });
      
      // Reset form
      setApiKeyName('');
      generateApiKey();
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  };
  
  // Generate API key on component mount
  useEffect(() => {
    generateApiKey();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create API Key</CardTitle>
        <CardDescription>Generate an API key to authenticate with the BizOS API</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key-name">API Key Name</Label>
          <Input
            id="api-key-name"
            placeholder="e.g. Production API Key"
            value={apiKeyName}
            onChange={(e) => setApiKeyName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex">
            <Input
              id="api-key"
              className="flex-1 font-mono"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              readOnly
            />
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="ml-2"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={copyApiKey}
              className="ml-2"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Make sure to copy your API key now. You won't be able to see it again!
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={createApiKey} disabled={loading}>
          {loading ? 'Creating...' : 'Create API Key'}
        </Button>
        <Button variant="outline" className="ml-2" onClick={generateApiKey}>
          Generate New Key
        </Button>
      </CardFooter>
    </Card>
  );
} 