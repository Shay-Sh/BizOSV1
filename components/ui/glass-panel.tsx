import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark';
}

export const GlassPanel = ({
  children,
  className,
  variant = 'default',
  ...props
}: GlassPanelProps) => {
  return (
    <div
      className={cn(
        'relative rounded-lg p-6 shadow-sm',
        variant === 'default'
          ? 'bg-card text-card-foreground border border-border'
          : 'bg-muted text-muted-foreground border border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
