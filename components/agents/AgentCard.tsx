import React from 'react';
import { Star, Download, ThumbsUp, Play, Pause, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { cn } from '@/lib/utils';

export interface AgentProps {
  id: string;
  name: string;
  description: string;
  image?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'error';
  pricing?: 'free' | 'premium' | 'enterprise';
  rating?: number;
  reviews?: number;
  downloads?: number;
  usage?: number;
  usageLimit?: number;
  lastExecution?: string;
  isInMarketplace?: boolean;
  onDeploy?: (id: string) => void;
  onStart?: (id: string) => void;
  onStop?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const AgentCard = ({
  id,
  name,
  description,
  image = '🤖',
  category,
  status = 'inactive',
  pricing,
  rating,
  reviews,
  downloads,
  usage,
  usageLimit,
  lastExecution,
  isInMarketplace = false,
  onDeploy,
  onStart,
  onStop,
  onEdit,
  onDelete,
  className,
}: AgentProps) => {
  const statusColor = 
    status === 'active' ? 'bg-green-500/80' : 
    status === 'error' ? 'bg-red-500/80' : 
    'bg-gray-500/80';

  const pricingColor = 
    pricing === 'free' ? 'bg-green-500/80' : 
    pricing === 'premium' ? 'bg-blue-500/80' : 
    'bg-purple-500/80';

  const usagePercentage = usage && usageLimit ? Math.min(100, (usage / usageLimit) * 100) : null;

  return (
    <GlassPanel className={cn('', className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4 text-4xl">{image}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex space-x-2">
              {status && !isInMarketplace && (
                <Badge className={statusColor}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              )}
              {pricing && (
                <Badge className={pricingColor}>
                  {pricing.charAt(0).toUpperCase() + pricing.slice(1)}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          {/* Marketplace stats */}
          {isInMarketplace && (
            <div className="flex items-center space-x-3 text-sm mb-3">
              {rating && (
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {rating}
                </span>
              )}
              {reviews && (
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 text-blue-500 mr-1" />
                  {reviews} reviews
                </span>
              )}
              {downloads && (
                <span className="flex items-center">
                  <Download className="w-4 h-4 text-green-500 mr-1" />
                  {downloads}
                </span>
              )}
            </div>
          )}
          
          {/* My agents stats */}
          {!isInMarketplace && (
            <div className="mb-3">
              {usagePercentage !== null && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Usage</span>
                    <span>{usage} / {usageLimit}</span>
                  </div>
                  <div className="w-full bg-background/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                </div>
              )}
              {lastExecution && (
                <div className="text-xs text-muted-foreground">
                  Last execution: {new Date(lastExecution).toLocaleString()}
                </div>
              )}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            {isInMarketplace && onDeploy && (
              <Button onClick={() => onDeploy(id)}>Deploy</Button>
            )}
            
            {!isInMarketplace && (
              <>
                {status === 'active' && onStop && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-amber-500 border-amber-500/50 hover:bg-amber-500/10"
                    onClick={() => onStop(id)}
                  >
                    <Pause size={16} className="mr-1" />
                    Stop
                  </Button>
                )}
                
                {status === 'inactive' && onStart && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-500 border-green-500/50 hover:bg-green-500/10"
                    onClick={() => onStart(id)}
                  >
                    <Play size={16} className="mr-1" />
                    Start
                  </Button>
                )}
                
                {onEdit && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(id)}
                  >
                    <Settings size={16} className="mr-1" />
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}; 