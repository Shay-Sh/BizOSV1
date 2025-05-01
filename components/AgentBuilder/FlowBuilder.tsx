import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvasWrapper from './FlowCanvasWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import GmailConnect from './GmailConnect';

interface FlowBuilderProps {
  agentId: string;
  initialNodes?: any[];
  initialEdges?: any[];
}

export default function FlowBuilder({ agentId, initialNodes = [], initialEdges = [] }: FlowBuilderProps) {
  return (
    <div className="space-y-4">
      <GmailConnect />
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Agent Flow Builder</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px]">
            <ReactFlowProvider>
              <FlowCanvasWrapper 
                agentId={agentId}
                initialNodes={initialNodes}
                initialEdges={initialEdges}
              />
            </ReactFlowProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 