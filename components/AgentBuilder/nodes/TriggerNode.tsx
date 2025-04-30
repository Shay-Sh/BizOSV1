import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NodeType } from '@/lib/agent-builder/engine';

interface TriggerNodeProps {
  id: string;
  data: {
    name: string;
    config: {
      maxEmails: number;
      filterCriteria?: string;
    };
    setNodeData: (id: string, data: any) => void;
  };
  selected: boolean;
}

export default function TriggerNode({ id, data, selected }: TriggerNodeProps) {
  const [maxEmails, setMaxEmails] = useState<number>(data.config.maxEmails || 10);
  const [filterCriteria, setFilterCriteria] = useState<string>(data.config.filterCriteria || '');
  
  // Update node data when configuration changes
  const updateNodeData = () => {
    data.setNodeData(id, {
      type: NodeType.TRIGGER,
      name: data.name,
      config: {
        maxEmails: maxEmails,
        filterCriteria: filterCriteria,
      },
    });
  };
  
  // Handle max emails change
  const handleMaxEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMaxEmails(value);
      setTimeout(() => {
        updateNodeData();
      }, 100);
    }
  };
  
  // Handle filter criteria change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCriteria(e.target.value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };
  
  return (
    <Card className={`w-64 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="bg-blue-50 dark:bg-blue-900 p-3 flex flex-row items-center space-x-2">
        <Mail className="h-5 w-5 text-blue-500 dark:text-blue-300" />
        <CardTitle className="text-sm font-medium">Gmail Trigger</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`maxEmails-${id}`} className="text-xs font-medium">
            Max Emails to Process
          </Label>
          <Input
            id={`maxEmails-${id}`}
            type="number"
            min={1}
            max={50}
            value={maxEmails}
            onChange={handleMaxEmailsChange}
            className="h-7 text-sm"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor={`filter-${id}`} className="text-xs font-medium">
            Filter (Optional)
          </Label>
          <Input
            id={`filter-${id}`}
            type="text"
            placeholder="e.g. is:unread from:example.com"
            value={filterCriteria}
            onChange={handleFilterChange}
            className="h-7 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter Gmail search filters to narrow down emails
          </p>
        </div>
      </CardContent>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
} 