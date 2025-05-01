'use client';

import { useState, useEffect } from 'react';
import { getBrowserSupabase, supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, RefreshCcw, Table as TableIcon, Key, Database, Code } from 'lucide-react';
import SupabaseDiagnostics from '@/components/SupabaseDiagnostics';

// Custom Alert components (since we're not importing the ones from shadcn/ui)
const Alert = ({ variant, className, children }: { variant?: string, className?: string, children: React.ReactNode }) => (
  <div className={`p-4 rounded-md ${variant === 'destructive' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'} ${className || ''}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium mb-1">{children}</div>
);

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);

export default function SupabaseDebugPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [diagnostics, setDiagnostics] = useState<{
    envVars: { supabaseUrl: string; supabaseKey: string };
    connectionStatus: 'checking' | 'success' | 'error';
    userSession: any | null;
    tables: Record<string, { exists: boolean; error?: string }>;
    error: string | null;
  }>({
    envVars: { supabaseUrl: '', supabaseKey: '' },
    connectionStatus: 'checking',
    userSession: null,
    tables: {},
    error: null,
  });
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // List of tables to check - must match the database schema
  const tablesToCheck = [
    'agent_flows',
    'agent_integrations',
    'agent_metrics',
    'gmail_auth_tokens',
    'llm_api_keys',
    'api_keys'
  ] as const;
  
  type TableName = typeof tablesToCheck[number];

  const runDiagnostics = async () => {
    try {
      // Get environment variables directly
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      // Update state with initial findings
      setDiagnostics(prev => ({
        ...prev,
        envVars: { supabaseUrl, supabaseKey },
        connectionStatus: 'checking',
        error: null
      }));
      
      // Test Supabase connection - get a fresh client
      const supabaseClient = supabase();
      
      if (!supabaseClient) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      // Try to get user session
      const { data, error } = await supabaseClient.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      const tableStatus: Record<string, { exists: boolean; error?: string }> = {};
      
      for (const table of tablesToCheck) {
        try {
          // Just check if the table exists by trying to count rows
          const { count, error } = await supabaseClient
            .from(table as TableName)
            .select('*', { count: 'exact', head: true });
          
          tableStatus[table] = { 
            exists: !error,
            error: error ? error.message : undefined
          };
        } catch (err) {
          tableStatus[table] = { 
            exists: false,
            error: err instanceof Error ? err.message : String(err)
          };
        }
      }
      
      // Successfully connected
      setDiagnostics(prev => ({
        ...prev,
        connectionStatus: 'success',
        userSession: data.session,
        tables: tableStatus,
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

  // Run a test to try creating an agent
  const runAgentCreationTest = async () => {
    setIsRunningTest(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/debug-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Debug Test Agent',
          description: 'Created by Supabase debug page',
          type: 'gmail',
          isActive: false,
        }),
      });
      
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsRunningTest(false);
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
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supabase Diagnostics</h1>
        <p className="text-muted-foreground">Debug your Supabase connection and database</p>
      </div>
      
      <Card>
        <CardHeader className="bg-muted/50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Connection Status</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={runDiagnostics}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Supabase URL
              </h3>
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
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Anon Key
              </h3>
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
            
            <div className="space-y-2">
              <h3 className="font-medium">Connection</h3>
              <div>
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
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">User Session</h3>
              <div>
                {diagnostics.userSession ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Authenticated as {diagnostics.userSession.user.email}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">No active session</Badge>
                )}
              </div>
            </div>
          </div>
          
          {diagnostics.connectionStatus === 'error' && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{diagnostics.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Database Tables</TabsTrigger>
          <TabsTrigger value="test">Agent Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <SupabaseDiagnostics />
          
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Environment Variables</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Check your <code>.env.local</code> file contains the correct Supabase URL and anon key</li>
                  <li>Verify that the environment variables are properly exposed to the client via <code>NEXT_PUBLIC_</code> prefix</li>
                  <li>Try rebuilding and redeploying your application after setting environment variables</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Connection Issues</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Check if your browser has cookies enabled</li>
                  <li>Try clearing your browser cache and local storage</li>
                  <li>Ensure your Supabase project is active and not paused</li>
                  <li>Check if you're behind a firewall that might be blocking connections</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Authentication Issues</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Verify that you have set up authentication providers in your Supabase project</li>
                  <li>Check if the redirect URLs are properly configured</li>
                  <li>Try logging out and logging back in again</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TableIcon className="h-4 w-4 mr-2" />
                Database Tables Status
              </CardTitle>
              <CardDescription>
                Check if the required database tables exist and are accessible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                {Object.entries(diagnostics.tables).map(([tableName, status]) => (
                  <div key={tableName} className="p-3 flex items-start justify-between">
                    <div>
                      <span className="font-medium">{tableName}</span>
                      {status.exists ? (
                        <div className="text-sm text-green-600 flex items-center mt-1">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Table exists and is accessible
                        </div>
                      ) : (
                        <div className="text-sm text-red-600 flex items-center mt-1">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Table not found or not accessible
                        </div>
                      )}
                    </div>
                    
                    {!status.exists && status.error && (
                      <div className="text-xs font-mono bg-red-50 p-1.5 rounded max-w-[50%] text-red-700">
                        {status.error}
                      </div>
                    )}
                  </div>
                ))}
                
                {Object.keys(diagnostics.tables).length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No table information available. Check connection first.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t flex justify-between">
              <div className="text-sm text-muted-foreground">
                Missing tables? Run database migrations to create them.
              </div>
              <Button variant="outline" size="sm" onClick={runDiagnostics}>
                Refresh Tables
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Creation Test</CardTitle>
              <CardDescription>
                Test if you can create an agent in the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runAgentCreationTest} 
                disabled={isRunningTest || diagnostics.connectionStatus !== 'success'}
              >
                {isRunningTest ? 'Running Test...' : 'Run Test'}
              </Button>
              
              {testResult && (
                <div className="mt-4">
                  <Separator className="my-4" />
                  <h3 className="font-medium mb-2">Test Result</h3>
                  
                  {testResult.error ? (
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <h4 className="text-red-800 font-medium">Error</h4>
                      <p className="text-red-700 text-sm mt-1">{testResult.error}</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <h4 className="text-green-800 font-medium">Success</h4>
                      <p className="text-green-700 text-sm mt-1">Agent created successfully with ID: {testResult.id}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 bg-gray-50 p-3 rounded border font-mono text-xs">
                    <p className="font-medium text-gray-800 mb-2">Response Data:</p>
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(testResult, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 