import React from 'react';
import { cn } from '@/utils/classnames';

interface StatDisplayProps {
  label: string;
  value: string | number;
  trend?: {
    value: string | number;
    positive?: boolean;
  };
  className?: string;
  valueSize?: 'sm' | 'md' | 'lg';
}

/**
 * StatDisplay component for showing metrics with optional trend indicators
 */
const StatDisplay = ({
  label,
  value,
  trend,
  className,
  valueSize = 'md',
}: StatDisplayProps) => {
  const valueClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <p className="text-sm text-white/60">{label}</p>
      
      <p className={cn("font-bold text-white", valueClasses[valueSize])}>
        {value}
      </p>
      
      {trend && (
        <p className={cn(
          "text-sm font-medium",
          trend.positive ? "text-green-400" : "text-red-400"
        )}>
          {trend.positive && '+'}{trend.value}
        </p>
      )}
    </div>
  );
};

export default StatDisplay; 