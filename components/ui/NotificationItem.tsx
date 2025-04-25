import React from 'react';
import { cn } from '@/utils/classnames';

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  read?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * NotificationItem component for displaying notification entries
 * with title, description, and timestamp
 */
const NotificationItem = ({
  title,
  description,
  time,
  read = false,
  onClick,
  className,
}: NotificationItemProps) => {
  return (
    <div 
      className={cn(
        "p-2 rounded-lg transition-colors",
        onClick ? "cursor-pointer hover:bg-white/10" : "hover:bg-white/5",
        !read && "relative",
        className
      )}
      onClick={onClick}
    >
      {!read && (
        <span className="absolute top-3 left-0 w-1.5 h-1.5 bg-blue-400 rounded-full transform -translate-x-3"></span>
      )}
      
      <div className="flex justify-between">
        <p className="font-medium text-white">{title}</p>
        <span className="text-xs text-white/50">{time}</span>
      </div>
      
      <p className="text-sm text-white/70 mt-1">{description}</p>
    </div>
  );
};

export default NotificationItem; 