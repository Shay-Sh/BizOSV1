import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Tag, Archive, FolderInput } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { NodeType } from '@/lib/agent-builder/engine';

interface ActionNodeProps {
  id: string;
  data: {
    name: string;
    config: {
      actionType: 'label' | 'archive' | 'move';
      category: string;
      labelName?: string;
      labelId?: string;
    };
    setNodeData: (id: string, data: any) => void;
  };
  selected: boolean;
}

export default function ActionNode({ id, data, selected }: ActionNodeProps) {
  const [actionType, setActionType] = useState<'label' | 'archive' | 'move'>(data.config.actionType || 'label');
  const [category, setCategory] = useState<string>(data.config.category || '');
  const [labelName, setLabelName] = useState<string>(data.config.labelName || '');
  
  // Update node data when configuration changes
  const updateNodeData = () => {
    data.setNodeData(id, {
      type: NodeType.ACTION,
      name: data.name,
      config: {
        actionType,
        category,
        labelName: actionType === 'label' ? labelName : undefined,
      },
    });
  };
  
  // Handle action type change
  const handleActionTypeChange = (value: 'label' | 'archive' | 'move') => {
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
  
  // Get the icon for the action type
  const getActionIcon = () => {
    switch (actionType) {
      case 'label':
        return <Tag className="h-5 w-5 text-green-600" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-green-600" />;
      case 'move':
        return <FolderInput className="h-5 w-5 text-green-600" />;
      default:
        return <Tag className="h-5 w-5 text-green-600" />;
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
              <SelectItem value="Spam">Spam</SelectItem>
              <SelectItem value="Newsletter">Newsletter</SelectItem>
              <SelectItem value="Update">Update</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
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
        
        {category && actionType && (
          <div className="bg-muted p-2 rounded text-xs mt-2">
            <span className="font-medium">Action:</span> {actionType === 'label' ? `Apply label "${labelName}" to` : actionType} emails classified as "{category}"
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