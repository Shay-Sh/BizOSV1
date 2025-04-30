import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Tag, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Flow } from '@/lib/agent-builder/engine';
import { TestAgentFlow } from '@/utils/test-agent-flow';
import { EmailData } from '@/lib/agent-builder/gmail-service';
import { ClassificationResult } from '@/lib/agent-builder/llm-service';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TestAgentRunnerProps {
  agent: Flow;
}

export default function TestAgentRunner({ agent }: TestAgentRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [useRealLLM, setUseRealLLM] = useState(false);
  const [activeTab, setActiveTab] = useState('emails');
  const [testResults, setTestResults] = useState<{
    emails: EmailData[];
    classifications: Record<string, ClassificationResult>;
    actions: { emailId: string; action: string; success: boolean; message?: string }[];
    errors: string[];
  } | null>(null);
  
  // Initialize test agent
  const testAgent = new TestAgentFlow(agent, { useRealLLM });
  
  // Run the test
  const runTest = async () => {
    try {
      setIsRunning(true);
      setTestResults(null);
      
      // Reset test state
      testAgent.reset();
      
      // Execute the flow
      await testAgent.execute();
      
      // Get and set the results
      const results = testAgent.getResults();
      setTestResults(results);
      
      // If results come back, switch to classifications tab if there are any
      if (results && Object.keys(results.classifications).length > 0) {
        setActiveTab('classifications');
      }
    } catch (error) {
      console.error('Error running test agent:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Clear the test results
  const clearResults = () => {
    setTestResults(null);
    setActiveTab('emails');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{agent.name}</h2>
          <p className="text-sm text-muted-foreground">
            Test this agent with sample emails
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-real-llm" 
              checked={useRealLLM} 
              onCheckedChange={setUseRealLLM} 
            />
            <Label htmlFor="use-real-llm" className="text-sm">Use real LLM</Label>
          </div>
          
          <Button 
            onClick={runTest} 
            disabled={isRunning}
            className="sm:ml-4"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Test...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Test
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left panel: Test emails */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Sample Emails</CardTitle>
              <CardDescription>
                Emails that will be processed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {testResults?.emails && testResults.emails.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.emails.map((email) => (
                      <div 
                        key={email.id} 
                        className={`border rounded-md p-3 ${
                          testResults.classifications[email.id] ? 'ring-1 ring-primary/30' : ''
                        }`}
                      >
                        <h3 className="text-sm font-medium">{email.subject}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          From: {email.from}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(email.date).toLocaleString()}
                        </p>
                        <p className="text-xs mt-2 line-clamp-2">{email.snippet}</p>
                        
                        {/* Display classification if available */}
                        {testResults.classifications[email.id] && (
                          <div className="mt-2 flex">
                            <Badge variant="outline" className="bg-primary/10 border-primary/20">
                              {testResults.classifications[email.id].category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Mail className="h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-2 text-muted-foreground">
                      Run the test to see sample emails
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Right panel: Test results */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Test Results</CardTitle>
              <CardDescription>
                Classifications and actions performed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="classifications">
                      Classifications ({Object.keys(testResults.classifications).length})
                    </TabsTrigger>
                    <TabsTrigger value="actions">
                      Actions ({testResults.actions.length})
                    </TabsTrigger>
                    {testResults.errors.length > 0 && (
                      <TabsTrigger value="errors">
                        Errors ({testResults.errors.length})
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="classifications">
                    <ScrollArea className="h-[550px] pr-4">
                      {Object.entries(testResults.classifications).length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(testResults.classifications).map(([emailId, classification]) => {
                            const email = testResults.emails.find(e => e.id === emailId);
                            return (
                              <div key={emailId} className="border rounded-md p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-sm font-medium">{email?.subject}</h3>
                                    <p className="text-xs text-muted-foreground">
                                      From: {email?.from}
                                    </p>
                                  </div>
                                  <Badge className="bg-primary/10 border-primary/20">
                                    {classification.category}
                                  </Badge>
                                </div>
                                
                                <div className="mt-3 space-y-2">
                                  <div>
                                    <span className="text-xs font-medium">Confidence:</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                      <div 
                                        className="bg-primary h-1.5 rounded-full" 
                                        style={{ width: `${classification.confidence * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(classification.confidence * 100)}%
                                    </span>
                                  </div>
                                  
                                  <div>
                                    <span className="text-xs font-medium">Reasoning:</span>
                                    <p className="text-xs mt-1 text-muted-foreground">
                                      {classification.reasoning}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <p className="text-muted-foreground">
                            No classifications were performed
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="actions">
                    <ScrollArea className="h-[550px] pr-4">
                      {testResults.actions.length > 0 ? (
                        <div className="space-y-4">
                          {testResults.actions.map((action, index) => {
                            const email = testResults.emails.find(e => e.id === action.emailId);
                            return (
                              <div key={index} className="border rounded-md p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-sm font-medium">{email?.subject}</h3>
                                    <div className="mt-1 flex items-center space-x-2">
                                      <Badge variant="outline">
                                        {action.action}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {action.message}
                                      </span>
                                    </div>
                                  </div>
                                  {action.success ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <p className="text-muted-foreground">
                            No actions were performed
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  {testResults.errors.length > 0 && (
                    <TabsContent value="errors">
                      <ScrollArea className="h-[550px] pr-4">
                        <div className="space-y-3">
                          {testResults.errors.map((error, index) => (
                            <div key={index} className="border border-red-200 bg-red-50 rounded-md p-3">
                              <p className="text-sm text-red-800">{error}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  )}
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <RefreshCw className="h-8 w-8 text-primary/60" />
                  </div>
                  <h3 className="text-lg font-medium">Run a test to see results</h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-2">
                    Click the "Run Test" button to test your agent with sample emails.
                    You'll see how it classifies emails and what actions it takes.
                  </p>
                  <Button onClick={runTest} className="mt-4">Run Test Now</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {testResults && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
        </div>
      )}
    </div>
  );
} 