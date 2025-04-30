'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Tag, Archive, FolderInput, MailIcon, Play, Clock, PlusCircle, Save } from 'lucide-react';
import { TestAgentFlow, TestFlowConfig, TestFlowResult, TestResultEmail } from '@/utils/test-agent-flow';
import { MockGmailService, MockGmailEmail } from '@/lib/agent-builder/mock-gmail-service';

export default function TestAgentRunnerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('build');
  const [testResult, setTestResult] = useState<TestFlowResult | null>(null);
  
  // Configuration state
  const [flowConfig, setFlowConfig] = useState<TestFlowConfig>({
    id: `flow-${Date.now()}`,
    name: 'Test Gmail Agent',
    triggerConfig: {
      type: 'gmail',
      maxResults: 10
    },
    classifierConfig: {
      model: 'gpt-3.5-turbo',
      categories: ['Important', 'Not Important', 'Urgent', 'Spam', 'Newsletter', 'Personal', 'Work']
    },
    actionConfigs: {
      'Important': { actionType: 'label', labelName: 'Important' },
      'Urgent': { actionType: 'label', labelName: 'Urgent' },
      'Spam': { actionType: 'archive' },
      'Newsletter': { actionType: 'label', labelName: 'Newsletters' },
      'Personal': { actionType: 'move', labelName: 'Personal' },
      'Work': { actionType: 'move', labelName: 'Work' }
    }
  });
  
  // Run the test
  const runTest = async () => {
    setIsRunning(true);
    setTestResult(null);
    
    try {
      const testAgent = new TestAgentFlow(flowConfig);
      const result = await testAgent.runTest();
      setTestResult(result);
      
      // Switch to results tab
      setActiveTab('results');
    } catch (error) {
      console.error('Error running test:', error);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Update classification categories
  const updateCategories = (categories: string[]) => {
    setFlowConfig(prev => ({
      ...prev,
      classifierConfig: {
        ...prev.classifierConfig,
        categories
      }
    }));
  };
  
  // Update model
  const updateModel = (model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-haiku' | 'claude-3-sonnet') => {
    setFlowConfig(prev => ({
      ...prev,
      classifierConfig: {
        ...prev.classifierConfig,
        model
      }
    }));
  };
  
  // Add a new action
  const addAction = (category: string, actionType: 'label' | 'archive' | 'move', labelName?: string) => {
    setFlowConfig(prev => ({
      ...prev,
      actionConfigs: {
        ...prev.actionConfigs,
        [category]: { actionType, labelName }
      }
    }));
  };
  
  // Remove an action
  const removeAction = (category: string) => {
    const newActionConfigs = { ...flowConfig.actionConfigs };
    delete newActionConfigs[category];
    
    setFlowConfig(prev => ({
      ...prev,
      actionConfigs: newActionConfigs
    }));
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Gmail Agent</h1>
          <p className="text-muted-foreground">Build, test, and refine your Gmail email agent</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => {
              setFlowConfig({
                ...flowConfig,
                name: `${flowConfig.name} (Copy)`,
                id: `flow-${Date.now()}`
              });
            }}
          >
            <Save className="h-4 w-4" />
            Save As New
          </Button>
          <Button 
            onClick={runTest} 
            disabled={isRunning || Object.keys(flowConfig.actionConfigs).length === 0}
            className="flex items-center gap-1"
          >
            {isRunning ? <Clock className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Running...' : 'Run Test'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="build">Build Agent</TabsTrigger>
          <TabsTrigger value="samples">Test Samples</TabsTrigger>
          <TabsTrigger value="results" disabled={!testResult}>Test Results</TabsTrigger>
        </TabsList>
        
        {/* Build Tab */}
        <TabsContent value="build" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Agent Configuration */}
            <Card className="col-span-5">
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>Configure your Gmail email agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input 
                    id="agent-name" 
                    value={flowConfig.name} 
                    onChange={(e) => setFlowConfig({ ...flowConfig, name: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Classification Model</Label>
                  <Select 
                    value={flowConfig.classifierConfig.model} 
                    onValueChange={(value: any) => updateModel(value)}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {flowConfig.classifierConfig.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs py-1 px-2">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These are the categories used to classify emails
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions Configuration */}
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Actions Configuration</CardTitle>
                <CardDescription>Define actions to take for each email category</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {Object.entries(flowConfig.actionConfigs).map(([category, config]) => (
                      <div key={category} className="border rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2">{category}</Badge>
                          <span className="mx-1">→</span>
                          <div className="flex items-center">
                            {config.actionType === 'label' && <Tag className="h-4 w-4 mr-1" />}
                            {config.actionType === 'archive' && <Archive className="h-4 w-4 mr-1" />}
                            {config.actionType === 'move' && <FolderInput className="h-4 w-4 mr-1" />}
                            <span className="text-sm">
                              {config.actionType === 'label' ? `Apply label "${config.labelName}"` : 
                               config.actionType === 'move' ? `Move to "${config.labelName}"` : 
                               'Archive email'}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeAction(category)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add new action form */}
                    <div className="border border-dashed rounded-md p-3">
                      <AddActionForm 
                        categories={flowConfig.classifierConfig.categories.filter(
                          category => !flowConfig.actionConfigs[category]
                        )}
                        onAddAction={addAction}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Samples Tab */}
        <TabsContent value="samples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Test Emails</CardTitle>
              <CardDescription>
                These are the sample emails that will be used for testing your agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  <TestEmailItem
                    subject="URGENT: Action required on your account"
                    from="billing@example.com"
                    date={new Date(Date.now() - 24 * 60 * 60 * 1000)}
                    snippet="Please update your payment information by tomorrow to avoid service interruption..."
                    labels={['INBOX', 'UNREAD', 'IMPORTANT']}
                  />
                  
                  <TestEmailItem
                    subject="Your Weekly Tech Newsletter"
                    from="newsletter@techweekly.com"
                    date={new Date()}
                    snippet="This week in tech: New AI breakthroughs, software releases, and industry news..."
                    labels={['INBOX', 'UNREAD', 'CATEGORY_PROMOTIONS']}
                  />
                  
                  <TestEmailItem
                    subject="Project Update: Q3 Roadmap"
                    from="manager@company.com"
                    date={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
                    snippet="Hi team, I wanted to share the updated roadmap for our Q3 deliverables..."
                    labels={['INBOX', 'CATEGORY_PERSONAL']}
                  />
                  
                  <TestEmailItem
                    subject="YOU WON!!! Claim your prize now!"
                    from="prize@lucky-draws-intl.example"
                    date={new Date()}
                    snippet="Congratulations! You have been selected as the winner of our monthly lottery..."
                    labels={['INBOX', 'UNREAD']}
                  />
                  
                  <TestEmailItem
                    subject="Vacation plans"
                    from="friend@personal.com"
                    date={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                    snippet="Hey, I was thinking about our upcoming vacation plans..."
                    labels={['INBOX', 'CATEGORY_PERSONAL']}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {testResult ? (
            <div className="space-y-6">
              {/* Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>
                    Test run completed in {(testResult.duration / 1000).toFixed(2)} seconds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm font-medium text-muted-foreground">Emails Processed</p>
                      <p className="text-2xl font-bold">{testResult.summary.total}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {testResult.summary.total > 0
                          ? Math.round((testResult.summary.successful / testResult.summary.total) * 100)
                          : 0}%
                      </p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm font-medium text-muted-foreground">Categories Found</p>
                      <p className="text-2xl font-bold">{Object.keys(testResult.summary.byCategory).length}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm font-medium text-muted-foreground">Actions Performed</p>
                      <p className="text-2xl font-bold">{
                        Object.values(testResult.summary.byAction).reduce((sum, count) => sum + count, 0)
                      }</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Detailed Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Results</CardTitle>
                  <CardDescription>
                    Showing classification and action results for each email
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {testResult.processedEmails.map((result) => (
                        <ResultItem key={result.email.id} result={result} />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center mb-4">
                  No test results available yet. Run a test to see results.
                </p>
                <Button onClick={runTest} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Running Test...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Test Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add Action Form Component
function AddActionForm({ 
  categories, 
  onAddAction 
}: { 
  categories: string[]; 
  onAddAction: (category: string, actionType: 'label' | 'archive' | 'move', labelName?: string) => void; 
}) {
  const [category, setCategory] = useState<string>('');
  const [actionType, setActionType] = useState<'label' | 'archive' | 'move'>('label');
  const [labelName, setLabelName] = useState<string>('');
  
  const handleAddAction = () => {
    if (!category) return;
    onAddAction(category, actionType, actionType === 'archive' ? undefined : labelName);
    setCategory('');
    setActionType('label');
    setLabelName('');
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center">
        <PlusCircle className="h-4 w-4 mr-1" />
        Add New Action
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="category" className="text-xs">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>No categories available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="action-type" className="text-xs">Action</Label>
          <Select value={actionType} onValueChange={(value: any) => setActionType(value)}>
            <SelectTrigger id="action-type" className="h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="label">Apply Label</SelectItem>
              <SelectItem value="archive">Archive</SelectItem>
              <SelectItem value="move">Move To</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(actionType === 'label' || actionType === 'move') && (
          <div>
            <Label htmlFor="label-name" className="text-xs">Label Name</Label>
            <Input 
              id="label-name" 
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              className="h-8"
            />
          </div>
        )}
      </div>
      
      <Button 
        size="sm" 
        onClick={handleAddAction}
        disabled={!category || ((actionType === 'label' || actionType === 'move') && !labelName)}
        className="w-full mt-2"
      >
        Add Action
      </Button>
    </div>
  );
}

// Test Email Item Component
function TestEmailItem({ 
  subject, 
  from, 
  date, 
  snippet, 
  labels 
}: { 
  subject: string; 
  from: string; 
  date: Date; 
  snippet: string; 
  labels: string[]; 
}) {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between">
        <h3 className="font-medium text-sm">{subject}</h3>
        <span className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }).format(date)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{from}</p>
      <p className="text-xs mt-2">{snippet}</p>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {labels.map(label => (
          <Badge key={label} variant="outline" className="text-xs py-0">
            {label.replace('CATEGORY_', '')}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Test Result Item Component
function ResultItem({ result }: { result: TestResultEmail }) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'label':
        return <Tag className="h-4 w-4 mr-1" />;
      case 'archive':
        return <Archive className="h-4 w-4 mr-1" />;
      case 'move':
        return <FolderInput className="h-4 w-4 mr-1" />;
      default:
        return <MailIcon className="h-4 w-4 mr-1" />;
    }
  };
  
  return (
    <div className={`border rounded-md p-3 ${result.success ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-sm">{result.email.subject}</h3>
          <p className="text-xs text-muted-foreground">
            {result.email.from} • {
              new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              }).format(result.email.date)
            }
          </p>
        </div>
        {result.success ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Success
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Classification</p>
          <Badge variant="secondary">{result.classification}</Badge>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Action Taken</p>
          {result.action !== 'none' ? (
            <div className="flex items-center">
              <Badge variant="outline" className="flex items-center">
                {getActionIcon(result.action)}
                {result.actionDetails}
              </Badge>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">No action taken</span>
          )}
        </div>
      </div>
      
      {result.error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
          <p className="font-medium">Error:</p>
          <p>{result.error}</p>
        </div>
      )}
    </div>
  );
} 