import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import FlowCanvas from './FlowCanvas';
import NodePalette from './NodePalette';
import TriggerNode from './nodes/TriggerNode';
import ClassifierNode from './nodes/ClassifierNode';
import ActionNode from './nodes/ActionNode';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Save, Play } from 'lucide-react';

// Define the node types for React Flow
const nodeTypes = {
  triggerNode: TriggerNode,
  classifierNode: ClassifierNode,
  actionNode: ActionNode,
};

interface FlowCanvasWrapperProps {
  agentId?: string;
  initialNodes?: any[];
  initialEdges?: any[];
  readOnly?: boolean;
}

const FlowCanvasWrapperContent = ({
  agentId,
  initialNodes = [],
  initialEdges = [],
  readOnly = false,
}: FlowCanvasWrapperProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const reactFlowInstance$ = useReactFlow();

  // Initialize empty flow if no initial data
  useEffect(() => {
    if (initialNodes.length > 0) {
      // Transform nodes to add the onDataChange handler
      const nodesWithHandlers = initialNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          setNodeData: (id: string, data: any) => {
            // Update node data when configuration changes
            setNodes((nds) =>
              nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
            );
          },
        },
      }));
      setNodes(nodesWithHandlers);
    }
    
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges]);

  // Handle the drag start event for node palette
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodedata', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle the drop event for the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/nodedata') || '{}');

      // Check position where node was dropped
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Generate unique node ID
      const newNodeId = `${nodeType}_${Date.now()}`;

      // Create new node
      const newNode = {
        id: newNodeId,
        type: nodeType,
        position,
        data: {
          ...nodeData,
          setNodeData: (id: string, data: any) => {
            // Update node data when configuration changes
            setNodes((nds) =>
              nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
            );
          },
        },
      };

      // Add the new node to the graph
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance]
  );

  // Prevent default behavior for drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Save the flow to the database
  const handleSaveFlow = useCallback(async () => {
    if (!agentId) return;

    setIsSaving(true);
    try {
      // Filter out unwanted node data properties before saving
      const sanitizedNodes = nodes.map((node) => {
        const { setNodeData, ...nodeData } = node.data;
        return {
          ...node,
          data: nodeData,
        };
      });

      const response = await fetch(`/api/agent-builder/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes: sanitizedNodes,
          edges,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save agent flow');
      }

      toast({
        title: 'Flow saved',
        description: 'Your agent flow has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the agent flow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [agentId, nodes, edges, toast]);

  // Test the flow
  const handleTestFlow = useCallback(async () => {
    if (!agentId) return;

    setIsTesting(true);
    try {
      const response = await fetch(`/api/agent-builder/${agentId}/execute`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to test agent flow');
      }

      const result = await response.json();

      toast({
        title: 'Test started',
        description: 'The agent test has been initiated. Check logs for results.',
      });

      // Redirect to execution logs
      router.push(`/agent-builder/${agentId}?tab=logs`);
    } catch (error) {
      console.error('Error testing flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to test the agent flow. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  }, [agentId, router, toast]);

  // When saving, update the flow with current nodes and edges
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      handleSaveFlow();
    }
  }, [reactFlowInstance, handleSaveFlow]);

  return (
    <div className="flex h-full">
      {!readOnly && (
        <div className="border-r h-full">
          <NodePalette onDragStart={onDragStart} />
        </div>
      )}
      
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <div 
          className="absolute top-0 left-0 w-full h-full"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <FlowCanvas
            initialNodes={nodes}
            initialEdges={edges}
            onSave={handleSaveFlow}
            readOnly={readOnly}
            isLoading={isSaving}
          />
        </div>

        {!readOnly && agentId && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveFlow}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save
            </Button>
            <Button
              onClick={handleTestFlow}
              disabled={isTesting || nodes.length === 0}
              className="flex items-center gap-2"
            >
              <Play size={16} />
              Test Flow
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component with ReactFlowProvider
const FlowCanvasWrapper = (props: FlowCanvasWrapperProps) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasWrapperContent {...props} />
    </ReactFlowProvider>
  );
};

export default FlowCanvasWrapper; 