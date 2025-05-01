import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Tag, Archive, FolderInput, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { NodeType } from '@/lib/agent-builder/engine';

// Define action types
type ActionType = 'label' | 'archive' | 'move' | 'markImportant' | 'summarize';

interface ActionNodeProps {
  id: string;
  data: {
    name: string;
    config: {
      actionType: ActionType;
      category: string;
      labelName?: string;
      labelId?: string;
      destination?: string;
      llmProvider?: string;
      model?: string;
    };
    setNodeData: (id: string, data: any) => void;
  };
  selected: boolean;
}

export default function ActionNode({ id, data, selected }: ActionNodeProps) {
  const [actionType, setActionType] = useState<ActionType>(data.config.actionType || 'label');
  const [category, setCategory] = useState<string>(data.config.category || '');
  const [labelName, setLabelName] = useState<string>(data.config.labelName || '');
  const [destination, setDestination] = useState<string>(data.config.destination || '');
  const [llmProvider, setLlmProvider] = useState<string>(data.config.llmProvider || 'openai');
  const [model, setModel] = useState<string>(data.config.model || 'gpt-4o');
  
  // Update node data when configuration changes
  const updateNodeData = () => {
    data.setNodeData(id, {
      type: NodeType.ACTION,
      name: data.name,
      config: {
        actionType,
        category,
        labelName: actionType === 'label' ? labelName : undefined,
        destination: actionType === 'move' ? destination : undefined,
        llmProvider: actionType === 'summarize' ? llmProvider : undefined,
        model: actionType === 'summarize' ? model : undefined,
      },
    });
  };
  
  // Handle action type change
  const handleActionTypeChange = (value: ActionType) => {
    setActionType(value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };
  
  // Handle label name change
  const handleLabelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelName(e.target.value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };

  // Handle destination change
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };

  // Handle LLM provider change
  const handleLlmProviderChange = (value: string) => {
    setLlmProvider(value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };

  // Handle model change
  const handleModelChange = (value: string) => {
    setModel(value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };
  
  // Get the icon for the action type
  const getActionIcon = () => {
    switch (actionType) {
      case 'label':
        return <Tag className="h-5 w-5 text-green-600" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-green-600" />;
      case 'move':
        return <FolderInput className="h-5 w-5 text-green-600" />;
      case 'markImportant':
        return <Star className="h-5 w-5 text-green-600" />;
      case 'summarize':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      default:
        return <Tag className="h-5 w-5 text-green-600" />;
    }
  };

  // Get action description text
  const getActionDescription = () => {
    switch (actionType) {
      case 'label':
        return `Apply label "${labelName}" to`;
      case 'archive':
        return `Archive`;
      case 'move':
        return `Move to folder "${destination}"`;
      case 'markImportant':
        return `Mark as important`;
      case 'summarize':
        return `Generate summary with ${llmProvider} (${model}) for`;
      default:
        return actionType;
    }
  };
  
  return (
    <Card className={`w-64 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="bg-green-50 dark:bg-green-900 p-3 flex flex-row items-center space-x-2">
        {getActionIcon()}
        <CardTitle className="text-sm font-medium">Gmail Action</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`action-type-${id}`} className="text-xs font-medium">
            Action Type
          </Label>
          <Select value={actionType} onValueChange={(value: any) => handleActionTypeChange(value)}>
            <SelectTrigger id={`action-type-${id}`} className="h-7 text-sm">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="label">Apply Label</SelectItem>
              <SelectItem value="archive">Archive Email</SelectItem>
              <SelectItem value="move">Move to Folder</SelectItem>
              <SelectItem value="markImportant">Mark as Important</SelectItem>
              <SelectItem value="summarize">Generate Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor={`category-${id}`} className="text-xs font-medium">
            When Email is Classified as
          </Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id={`category-${id}`} className="h-7 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Important">Important</SelectItem>
              <SelectItem value="Not Important">Not Important</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
              <SelectItem value="Newsletter">Newsletter</SelectItem>
              <SelectItem value="Update">Update</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Positive">Positive</SelectItem>
              <SelectItem value="Negative">Negative</SelectItem>
              <SelectItem value="Neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {actionType === 'label' && (
          <div className="space-y-1">
            <Label htmlFor={`label-name-${id}`} className="text-xs font-medium">
              Label Name
            </Label>
            <Input
              id={`label-name-${id}`}
              value={labelName}
              onChange={handleLabelNameChange}
              placeholder="Enter label name"
              className="h-7 text-sm"
            />
          </div>
        )}

        {actionType === 'move' && (
          <div className="space-y-1">
            <Label htmlFor={`destination-${id}`} className="text-xs font-medium">
              Destination Folder
            </Label>
            <Input
              id={`destination-${id}`}
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Enter folder name"
              className="h-7 text-sm"
            />
          </div>
        )}

        {actionType === 'summarize' && (
          <>
            <div className="space-y-1">
              <Label htmlFor={`llm-provider-${id}`} className="text-xs font-medium">
                LLM Provider
              </Label>
              <Select value={llmProvider} onValueChange={handleLlmProviderChange}>
                <SelectTrigger id={`llm-provider-${id}`} className="h-7 text-sm">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`model-${id}`} className="text-xs font-medium">
                Model
              </Label>
              <Select value={model} onValueChange={handleModelChange}>
                <SelectTrigger id={`model-${id}`} className="h-7 text-sm">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {llmProvider === 'openai' ? (
                    <>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {category && actionType && (
          <div className="bg-muted p-2 rounded text-xs mt-2">
            <span className="font-medium">Action:</span> {getActionDescription()} emails classified as "{category}"
          </div>
        )}
      </CardContent>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 bg-green-500"
      />
    </Card>
  );
} 