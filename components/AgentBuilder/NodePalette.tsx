import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Brain, Tag, Archive, MoveRight, Clock, Star, AlertTriangle, BookOpen } from 'lucide-react';

// Define node types for the agent builder
export type NodeType = 'triggerNode' | 'classifierNode' | 'actionNode';

// Define each node category and its contents
const nodeCategories = [
  {
    title: 'Triggers',
    nodes: [
      { 
        type: 'triggerNode', 
        label: 'Gmail Trigger', 
        description: 'Trigger on new emails',
        icon: <Mail className="h-4 w-4" />,
        data: { 
          nodeType: 'trigger',
          service: 'gmail',
          checkInterval: 5,
          intervalUnit: 'minutes'
        }
      },
      { 
        type: 'triggerNode', 
        label: 'Scheduled Trigger', 
        description: 'Run at scheduled times',
        icon: <Clock className="h-4 w-4" />,
        data: { 
          nodeType: 'trigger',
          service: 'schedule',
          schedule: 'daily',
          time: '09:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      }
    ]
  },
  {
    title: 'Processing',
    nodes: [
      { 
        type: 'classifierNode', 
        label: 'Email Classifier', 
        description: 'Classify emails with AI',
        icon: <Brain className="h-4 w-4" />,
        data: { 
          nodeType: 'classifier',
          llmProvider: 'openai',
          model: 'gpt-4o',
          prompt: 'Classify this email into one of the following categories: '
        }
      },
      { 
        type: 'classifierNode', 
        label: 'Priority Classifier', 
        description: 'Determine email priority',
        icon: <Star className="h-4 w-4" />,
        data: { 
          nodeType: 'classifier',
          llmProvider: 'openai',
          model: 'gpt-4o',
          prompt: 'Classify this email by priority: urgent, important, normal, low'
        }
      },
      { 
        type: 'classifierNode', 
        label: 'Sentiment Analyzer', 
        description: 'Analyze email sentiment',
        icon: <AlertTriangle className="h-4 w-4" />,
        data: { 
          nodeType: 'classifier',
          llmProvider: 'openai',
          model: 'gpt-4o',
          prompt: 'Analyze the sentiment of this email: positive, negative, neutral'
        }
      }
    ]
  },
  {
    title: 'Actions',
    nodes: [
      { 
        type: 'actionNode', 
        label: 'Apply Label', 
        description: 'Apply label to emails',
        icon: <Tag className="h-4 w-4" />,
        data: { 
          nodeType: 'action',
          actionType: 'applyLabel',
          service: 'gmail',
          label: ''
        }
      },
      { 
        type: 'actionNode', 
        label: 'Archive Email', 
        description: 'Archive matching emails',
        icon: <Archive className="h-4 w-4" />,
        data: { 
          nodeType: 'action',
          actionType: 'archive',
          service: 'gmail'
        }
      },
      { 
        type: 'actionNode', 
        label: 'Move Email', 
        description: 'Move to specific folder',
        icon: <MoveRight className="h-4 w-4" />,
        data: { 
          nodeType: 'action',
          actionType: 'move',
          service: 'gmail',
          destination: ''
        }
      },
      { 
        type: 'actionNode', 
        label: 'Mark Important', 
        description: 'Mark emails as important',
        icon: <Star className="h-4 w-4" />,
        data: { 
          nodeType: 'action',
          actionType: 'markImportant',
          service: 'gmail'
        }
      },
      { 
        type: 'actionNode', 
        label: 'Summarize', 
        description: 'Generate email summary',
        icon: <BookOpen className="h-4 w-4" />,
        data: { 
          nodeType: 'action',
          actionType: 'summarize',
          service: 'gmail',
          llmProvider: 'openai',
          model: 'gpt-4o'
        }
      }
    ]
  }
];

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeData: any) => void;
}

const NodePalette = ({ onDragStart }: NodePaletteProps) => {
  return (
    <div className="flex flex-col space-y-4 w-64 h-full overflow-y-auto p-2">
      <h3 className="text-md font-medium">Node Palette</h3>
      
      {nodeCategories.map((category) => (
        <Card key={category.title} className="border shadow-sm">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm">{category.title}</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <div className="flex flex-col space-y-2">
              {category.nodes.map((node) => (
                <div
                  key={node.label}
                  className="flex items-center p-2 border rounded-md shadow-sm bg-white cursor-grab hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type, node.data)}
                >
                  <div className="mr-2 text-primary">
                    {node.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{node.label}</div>
                    <div className="text-xs text-gray-500">{node.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NodePalette; 