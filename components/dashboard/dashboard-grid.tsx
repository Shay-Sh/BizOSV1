import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export const DashboardGrid = ({
  children,
  columns = 12,
  gap = 4,
  className,
  ...props
}: DashboardGridProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12',
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 