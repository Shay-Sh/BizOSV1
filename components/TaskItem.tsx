'use client';

import { Check } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
      onClick={onToggle}
    >
      <div 
        className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${
          task.completed 
            ? 'bg-purple-500 border-purple-500' 
            : 'border-gray-500 hover:border-purple-400'
        }`}
      >
        {task.completed && <Check size={12} />}
      </div>
      <span 
        className={`${
          task.completed ? 'line-through text-gray-500' : 'text-white'
        }`}
      >
        {task.title}
      </span>
    </div>
  );
} 