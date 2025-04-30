import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flow } from '@/lib/agent-builder/engine';
import TestAgentFlow from '@/utils/test-agent-flow';
import { EmailData } from '@/lib/agent-builder/gmail-service';
import { ClassificationResult } from '@/lib/agent-builder/llm-service';

interface TestAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Flow;
}

export default function TestAgentModal({ open, onOpenChange, agent }: TestAgentModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [useRealLLM, setUseRealLLM] = useState(false);
  const [testResults, setTestResults] = useState<{
    emails: EmailData[];
    classifications: Record<string, ClassificationResult>;
    actions: { emailId: string; action: string; success: boolean; message?: string }[];
    errors: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState('emails');
  
  // Initialize test agent
  const testAgent = new TestAgentFlow(agent, { 
    useRealLLM: useRealLLM 
  });
  
  // Run the test agent
  const runTest = async () => {
    try {
      setIsRunning(true);
      setTestResults(null);
      
      // Reset test state
      testAgent.reset();
      
      // Execute the flow
      await testAgent.execute();
      
      // Get and set the results
      setTestResults(testAgent.getResults());
    } catch (error) {
      console.error('Error running test agent:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Clear the test results
  const clearResults = () => {
    setTestResults(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Agent: {agent.name}</DialogTitle>
          <DialogDescription>
            Test your email agent with sample emails to see how it classifies and acts on them.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="use-real-llm" 
              checked={useRealLLM} 
              onCheckedChange={setUseRealLLM} 
            />
            <Label htmlFor="use-real-llm">Use real LLM for classification</Label>
          </div>
          
          <Button 
            onClick={runTest} 
            disabled={isRunning}
            variant="default"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Test'
            )}
          </Button>
        </div>
        
        <Separator className="my-2" />
        
        {testResults ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="emails" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList>
                <TabsTrigger value="emails">
                  Emails ({testResults.emails.length})
                </TabsTrigger>
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
              
              <TabsContent value="emails" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 p-1">
                    {testResults.emails.map((email) => (
                      <div key={email.id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium">{email.subject}</h3>
                            <p className="text-xs text-muted-foreground">
                              From: {email.from} • {new Date(email.date).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            {email.labelIds.map((labelId) => (
                              <Badge key={labelId} variant="outline">
                                {labelId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mt-2">{email.snippet}</p>
                      </div>
                    ))}
                    {testResults.emails.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground">
                        No emails processed
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="classifications" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 p-1">
                    {Object.entries(testResults.classifications).map(([emailId, classification]) => {
                      // Find the email to display its subject
                      const email = testResults.emails.find(e => e.id === emailId);
                      return (
                        <div key={emailId} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium">
                                {email?.subject || `Email ID: ${emailId}`}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                From: {email?.from || 'Unknown'}
                              </p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                              {classification.category}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs">
                              <span className="font-medium">Confidence:</span> {Math.round(classification.confidence * 100)}%
                            </p>
                            <p className="text-xs mt-1">
                              <span className="font-medium">Reasoning:</span> {classification.reasoning}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(testResults.classifications).length === 0 && (
                      <div className="text-center p-4 text-muted-foreground">
                        No classifications performed
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="actions" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 p-1">
                    {testResults.actions.map((action, index) => {
                      // Find the email to display its subject
                      const email = testResults.emails.find(e => e.id === action.emailId);
                      return (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium">
                                {email?.subject || `Email ID: ${action.emailId}`}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Action: {action.action}
                              </p>
                            </div>
                            {action.success ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          {action.message && (
                            <p className="text-xs mt-2">{action.message}</p>
                          )}
                        </div>
                      );
                    })}
                    {testResults.actions.length === 0 && (
                      <div className="text-center p-4 text-muted-foreground">
                        No actions performed
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {testResults.errors.length > 0 && (
                <TabsContent value="errors" className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 p-1">
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
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col p-10 space-y-3 text-center">
            <Mail className="h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-medium">Run a test to see results</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Click the "Run Test" button to test your agent with sample emails. You'll see how it classifies emails and what actions it takes.
            </p>
          </div>
        )}
        
        <DialogFooter className="mt-2">
          {testResults && (
            <Button variant="outline" onClick={clearResults} className="mr-auto">
              Clear Results
            </Button>
          )}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 