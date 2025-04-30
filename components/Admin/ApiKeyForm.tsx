import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const supabase = createClientComponentClient();
  
  // Load existing API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);
  
  // Fetch API keys from the database
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('llm_api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setApiKeys(data || []);
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
      setApiKeys([data, ...apiKeys]);
      setApiKey('');
      
      toast({
        title: 'Success',
        description: 'API key added successfully',
      });
      
    } catch (error) {
      console.error('Error adding API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to add API key',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle the active status of an API key
  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
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
        description: 'Failed to test API key',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Mask the API key for display
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '********';
    return key.substring(0, 4) + '********' + key.substring(key.length - 4);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">LLM API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Manage API keys for language models used by the agent builder
        </p>
      </div>
      
      {/* Add new API key form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={provider}
              onValueChange={setProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              autoComplete="off"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add API Key'}
        </Button>
      </form>
      
      {/* API key list */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">Provider</th>
              <th className="p-3 text-left font-medium">API Key</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Added</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-3 text-center">
                  Loading API keys...
                </td>
              </tr>
            ) : apiKeys.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center">
                  No API keys found. Add your first API key above.
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="p-3 font-medium capitalize">{key.provider}</td>
                  <td className="p-3 font-mono text-sm">{maskApiKey(key.api_key)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        key.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testKey(key.id, key.provider, key.api_key)}
                        disabled={isTesting[key.id]}
                      >
                        {isTesting[key.id]
                          ? 'Testing...'
                          : testResults[key.id] === undefined
                          ? 'Test'
                          : testResults[key.id]
                          ? <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                          : <XCircle className="w-4 h-4 mr-1 text-red-600" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyStatus(key.id, key.is_active)}
                      >
                        {key.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteKey(key.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 