import { useState, useEffect } from 'react';
import { getBrowserSupabase, getClientEnvVars } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function SupabaseDiagnostics() {
  const [expanded, setExpanded] = useState(false);
  const [diagnostics, setDiagnostics] = useState<{
    envVars: { supabaseUrl: string; supabaseKey: string };
    connectionStatus: 'checking' | 'success' | 'error';
    userSession: any | null;
    error: string | null;
  }>({
    envVars: { supabaseUrl: '', supabaseKey: '' },
    connectionStatus: 'checking',
    userSession: null,
    error: null,
  });

  const runDiagnostics = async () => {
    try {
      // Check environment variables
      const envVars = getClientEnvVars();
      
      // Update state with initial findings
      setDiagnostics(prev => ({
        ...prev,
        envVars,
        connectionStatus: 'checking',
        error: null
      }));
      
      // Test Supabase connection
      const supabase = getBrowserSupabase();
      
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      // Try to get user session - this operation should work regardless of schema
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      // Successfully connected
      setDiagnostics(prev => ({
        ...prev,
        connectionStatus: 'success',
        userSession: data.session,
        error: null
      }));
    } catch (error) {
      // Handle errors
      console.error('Supabase diagnostics error:', error);
      setDiagnostics(prev => ({
        ...prev,
        connectionStatus: 'error',
        error: error instanceof Error ? error.message : 'Unknown error connecting to Supabase'
      }));
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  // Get a shortened version of keys for display
  const maskSensitiveValue = (value: string): string => {
    if (!value) return 'Not set';
    if (value.length <= 8) return value;
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
  };

  return (
    <Card>
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-2">
          <CardTitle className="text-md font-medium">Supabase Connection Status</CardTitle>
          {diagnostics.connectionStatus === 'checking' && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Checking...</Badge>
          )}
          {diagnostics.connectionStatus === 'success' && (
            <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>
          )}
          {diagnostics.connectionStatus === 'error' && (
            <Badge variant="outline" className="bg-red-100 text-red-800">Error</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-4 px-4 py-3">
          <div className="space-y-2">
            <h3 className="font-medium">Environment Variables</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_URL:</span>
              </div>
              <div className="flex items-center">
                {diagnostics.envVars.supabaseUrl ? (
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{diagnostics.envVars.supabaseUrl}</span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    Not set
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <span className="text-muted-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              </div>
              <div className="flex items-center">
                {diagnostics.envVars.supabaseKey ? (
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{maskSensitiveValue(diagnostics.envVars.supabaseKey)}</span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    Not set
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="font-medium">Connection Status</h3>
            <div className="text-sm">
              {diagnostics.connectionStatus === 'checking' && (
                <div className="flex items-center text-yellow-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Checking Supabase connection...
                </div>
              )}
              
              {diagnostics.connectionStatus === 'success' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Successfully connected to Supabase
                </div>
              )}
              
              {diagnostics.connectionStatus === 'error' && (
                <div className="space-y-1">
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-4 w-4 mr-1" />
                    Failed to connect to Supabase
                  </div>
                  {diagnostics.error && (
                    <div className="bg-red-50 p-2 rounded text-red-700 font-mono text-xs">
                      {diagnostics.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {diagnostics.userSession && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">User Session</h3>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {JSON.stringify(
                    {
                      user_id: diagnostics.userSession.user.id,
                      email: diagnostics.userSession.user.email,
                      expires_at: new Date(diagnostics.userSession.expires_at * 1000).toLocaleString(),
                    }, 
                    null, 
                    2
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={(e) => {
              e.stopPropagation();
              runDiagnostics();
            }}>
              Re-run Diagnostics
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default SupabaseDiagnostics; 