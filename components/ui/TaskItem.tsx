import React from 'react';
import { cn } from '@/utils/classnames';

interface TaskItemProps {
  title: string;
  completed?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * TaskItem component for displaying task entries with a checkbox
 */
const TaskItem = ({
  title,
  completed = false,
  onToggle,
  className,
}: TaskItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center p-2 rounded-lg transition-all",
        onToggle ? "cursor-pointer hover:bg-white/10" : "hover:bg-white/5",
        completed && "opacity-60",
        className
      )}
      onClick={onToggle}
    >
      <div 
        className={cn(
          "w-4 h-4 rounded-full mr-3 flex items-center justify-center transition-colors",
          completed 
            ? "bg-green-500 border-0" 
            : "border border-white/30 bg-transparent"
        )}
      >
        {completed && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 text-white" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </div>
      
      <span className={cn(
        "text-white",
        completed && "line-through text-white/70"
      )}>
        {title}
      </span>
    </div>
  );
};

export default TaskItem; 