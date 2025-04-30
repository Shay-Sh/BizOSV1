'use client';

import { useState, useEffect } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import llmService from '@/lib/agent-builder/llm-service';

interface ApiKey {
  id: string;
  provider: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export default function ApiKeyForm() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [provider, setProvider] = useState<string>('openai');
  const [apiKey, setApiKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();
  
  // Load existing API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);
  
  // Fetch API keys from the database
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { data, error } = await supabase
        .from('llm_api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setApiKeys(data as ApiKey[] || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a new API key
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('You must be logged in to add an API key');
      }
      
      // Check if this provider already has an active key
      const existingKeys = apiKeys.filter(
        key => key.provider === provider && key.is_active
      );
      
      if (existingKeys.length > 0) {
        // Deactivate existing keys for this provider
        for (const key of existingKeys) {
          await supabase
            .from('llm_api_keys')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', key.id);
        }
      }
      
      // Add the new key
      const { data, error } = await supabase
        .from('llm_api_keys')
        .insert([
          {
            provider,
            api_key: apiKey,
            is_active: true,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update the UI
      setApiKeys([data as ApiKey, ...apiKeys]);
      setApiKey('');
      
      toast({
        title: 'Success',
        description: 'API key added successfully',
      });
      
    } catch (error) {
      console.error('Error adding API key:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add API key',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle the active status of an API key
  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase
        .from('llm_api_keys')
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the UI
      setApiKeys(
        apiKeys.map(key =>
          key.id === id ? { ...key, is_active: !currentStatus } : key
        )
      );
      
      toast({
        title: 'Success',
        description: `API key ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
      
    } catch (error) {
      console.error('Error toggling API key status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update API key status',
        variant: 'destructive',
      });
    }
  };
  
  // Delete an API key
  const deleteKey = async (id: string) => {
    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase
        .from('llm_api_keys')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the UI
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      });
      
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };
  
  // Test an API key
  const testKey = async (id: string, provider: string, key: string) => {
    try {
      setIsTesting(prev => ({ ...prev, [id]: true }));
      
      // Use the LLM service to test the connection
      const isValid = await llmService.testConnection(provider, key);
      
      // Update the test results
      setTestResults(prev => ({ ...prev, [id]: isValid }));
      
      toast({
        title: isValid ? 'Success' : 'Error',
        description: isValid
          ? 'API key is valid and working'
          : 'API key test failed. The key may be invalid.',
        variant: isValid ? 'default' : 'destructive',
      });
      
    } catch (error) {
      console.error('Error testing API key:', error);
      setTestResults(prev => ({ ...prev, [id]: false }));
      toast({
        title: 'Error',
        description: 'Failed to test API key connection',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Mask the API key for display
  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return '********';
    return key.substring(0, 4) + '********' + key.substring(key.length - 4);
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <h2 className="text-lg font-medium">Add New LLM API Key</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google AI</SelectItem>
                <SelectItem value="azure">Azure OpenAI</SelectItem>
                <SelectItem value="mistral">Mistral AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add API Key'}
        </Button>
      </form>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">API Keys</h2>
        
        {isLoading ? (
          <div className="text-center p-4">Loading API keys...</div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No API keys found. Add your first API key above.
          </div>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {key.provider.charAt(0).toUpperCase() + key.provider.slice(1)}
                    {key.is_active && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {maskApiKey(key.api_key)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Added: {new Date(key.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testKey(key.id, key.provider, key.api_key)}
                    disabled={isTesting[key.id]}
                  >
                    {isTesting[key.id] ? (
                      'Testing...'
                    ) : testResults[key.id] === undefined ? (
                      'Test'
                    ) : testResults[key.id] ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" /> Valid
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <XCircle className="w-4 h-4 mr-1" /> Invalid
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleKeyStatus(key.id, key.is_active)}
                  >
                    {key.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteKey(key.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 