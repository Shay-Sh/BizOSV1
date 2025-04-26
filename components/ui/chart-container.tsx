import React from 'react';
import { cn } from '@/lib/utils';
import { GlassPanel } from './glass-panel';

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'dark';
  className?: string;
  contentClassName?: string;
}

export const ChartContainer = ({
  title,
  subtitle,
  children,
  footer,
  actions,
  variant = 'default',
  className,
  contentClassName,
  ...props
}: ChartContainerProps) => {
  return (
    <GlassPanel 
      variant={variant}
      className={cn('flex flex-col h-full', className)}
      {...props}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>

      <div className={cn("flex-1", contentClassName)}>
        {children}
      </div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </GlassPanel>
  );
}; 