import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
  iconClassName?: string;
  inputClassName?: string;
}

export const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  className,
  iconClassName,
  inputClassName,
  ...props
}: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div className={cn(
      'relative flex items-center w-full',
      className
    )}>
      <Search 
        className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground',
          iconClassName
        )} 
        size={16} 
      />
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full pl-10 pr-4 py-2 rounded-md bg-background/50 border border-border',
          'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
          'placeholder:text-muted-foreground text-sm',
          'backdrop-blur-sm',
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}; 