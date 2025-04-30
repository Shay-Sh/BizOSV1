import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { NodeType } from '@/lib/agent-builder/engine';
import { PROVIDERS } from '@/lib/agent-builder/llm-service';

interface ClassifierNodeProps {
  id: string;
  data: {
    name: string;
    config: {
      provider: string;
      model: string;
      categories: string[];
      systemPrompt?: string;
    };
    setNodeData: (id: string, data: any) => void;
  };
  selected: boolean;
}

export default function ClassifierNode({ id, data, selected }: ClassifierNodeProps) {
  const [provider, setProvider] = useState<string>(data.config.provider || 'openai');
  const [model, setModel] = useState<string>(data.config.model || 'gpt-4');
  const [categories, setCategories] = useState<string[]>(data.config.categories || []);
  const [systemPrompt, setSystemPrompt] = useState<string>(data.config.systemPrompt || '');
  const [newCategory, setNewCategory] = useState<string>('');
  
  // Available models based on selected provider
  const availableModels = provider ? PROVIDERS[provider]?.models || [] : [];
  
  // Update model if provider changes and current model is invalid
  useEffect(() => {
    if (provider && !availableModels.includes(model)) {
      setModel(availableModels[0] || '');
    }
  }, [provider, model, availableModels]);
  
  // Update node data when configuration changes
  const updateNodeData = () => {
    data.setNodeData(id, {
      type: NodeType.CLASSIFIER,
      name: data.name,
      config: {
        provider,
        model,
        categories,
        systemPrompt,
      },
    });
  };
  
  // Handle provider change
  const handleProviderChange = (value: string) => {
    setProvider(value);
    // Auto-select first available model for new provider
    const newAvailableModels = PROVIDERS[value]?.models || [];
    setModel(newAvailableModels[0] || '');
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
  
  // Handle system prompt change
  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
    setTimeout(() => {
      updateNodeData();
    }, 100);
  };
  
  // Add a new category
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory('');
      
      setTimeout(() => {
        data.setNodeData(id, {
          type: NodeType.CLASSIFIER,
          name: data.name,
          config: {
            provider,
            model,
            categories: updatedCategories,
            systemPrompt,
          },
        });
      }, 100);
    }
  };
  
  // Remove a category
  const removeCategory = (category: string) => {
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    
    setTimeout(() => {
      data.setNodeData(id, {
        type: NodeType.CLASSIFIER,
        name: data.name,
        config: {
          provider,
          model,
          categories: updatedCategories,
          systemPrompt,
        },
      });
    }, 100);
  };
  
  // Handle pressing Enter in the category input
  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };
  
  return (
    <Card className={`w-72 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="bg-purple-50 dark:bg-purple-900 p-3 flex flex-row items-center space-x-2">
        <Brain className="h-5 w-5 text-purple-500 dark:text-purple-300" />
        <CardTitle className="text-sm font-medium">AI Classifier</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`provider-${id}`} className="text-xs font-medium">
            LLM Provider
          </Label>
          <Select value={provider} onValueChange={handleProviderChange}>
            <SelectTrigger id={`provider-${id}`} className="h-7 text-sm">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PROVIDERS).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
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
              {availableModels.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <Label htmlFor={`categories-${id}`} className="text-xs font-medium">
            Categories
          </Label>
          <div className="flex space-x-2">
            <Input
              id={`categories-${id}`}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={handleCategoryKeyDown}
              placeholder="Add a category"
              className="h-7 text-sm"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2"
              onClick={addCategory}
              disabled={!newCategory.trim()}
            >
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{category}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeCategory(category)}
                >
                  ×
                </Button>
              </Badge>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add categories to classify emails into
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor={`prompt-${id}`} className="text-xs font-medium">
            System Prompt (Optional)
          </Label>
          <Textarea
            id={`prompt-${id}`}
            value={systemPrompt}
            onChange={handleSystemPromptChange}
            placeholder="Custom instructions for the AI classifier"
            className="text-sm min-h-[80px]"
          />
        </div>
      </CardContent>
      
      {/* Input and output handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 bg-purple-500"
      />
      
      {categories.map((category) => (
        <Handle
          key={category}
          type="source"
          position={Position.Right}
          id={category}
          className="w-3 h-3 bg-purple-500"
          style={{
            top: `${50 + (categories.indexOf(category) - (categories.length - 1) / 2) * 20}%`,
          }}
        />
      ))}
    </Card>
  );
} 