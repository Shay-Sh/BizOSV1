import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  NodeChange,
  Panel,
  useEdgesState,
  useNodesState,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

// Types for our agent builder flow
export interface FlowCanvasProps {
  initialNodes?: any[];
  initialEdges?: any[];
  onSave?: (nodes: any[], edges: any[]) => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

const FlowCanvas = ({
  initialNodes = [],
  initialEdges = [],
  onSave,
  readOnly = false,
  isLoading = false,
}: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      // Prevent connections to trigger nodes (they can only be sources)
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (targetNode?.type === 'triggerNode') {
        toast.error('Cannot connect to a trigger node');
        return;
      }

      // Prevent multiple connections to classifier nodes (one input only)
      if (targetNode?.type === 'classifierNode') {
        const existingConnections = edges.filter((e) => e.target === connection.target);
        if (existingConnections.length > 0) {
          toast.error('Classifier nodes can only have one input');
          return;
        }
      }

      setEdges((eds) => addEdge(connection, eds));
    },
    [nodes, edges, setEdges]
  );

  // Handle saving the flow
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges);
      toast.success('Flow saved successfully');
    }
  }, [nodes, edges, onSave]);

  // Node selection handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, []);

  // Click on empty canvas to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="h-[600px] w-full border rounded-md relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={!readOnly ? onNodesChange : undefined}
        onEdgesChange={!readOnly ? onEdgesChange : undefined}
        onConnect={!readOnly ? onConnect : undefined}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        selectionKeyCode="Shift"
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap />
        
        {!readOnly && (
          <Panel position="top-right">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save Flow
            </Button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas; 