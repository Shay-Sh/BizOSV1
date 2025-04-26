import React from 'react';
import { cn } from '@/lib/utils';
import { SearchBar } from './search-bar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Button } from './button';
import { Filter, X } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  onSearch?: (value: string) => void;
  onFilterChange?: (category: string, value: string) => void;
  onClearFilters?: () => void;
  filterCategories?: { name: string; label: string; options: FilterOption[] }[];
  placeholder?: string;
  className?: string;
  showFilterButton?: boolean;
}

export const FilterBar = ({
  onSearch,
  onFilterChange,
  onClearFilters,
  filterCategories = [],
  placeholder = 'Search...',
  className,
  showFilterButton = true,
}: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleFilters = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-2">
        <SearchBar
          placeholder={placeholder}
          onSearch={onSearch}
          className="flex-1"
        />
        
        {showFilterButton && filterCategories.length > 0 && (
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={toggleFilters}
          >
            <Filter size={16} />
            Filters
          </Button>
        )}
        
        {onClearFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFilters}
            title="Clear filters"
          >
            <X size={16} />
          </Button>
        )}
      </div>
      
      {isExpanded && filterCategories.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filterCategories.map((category) => (
            <div key={category.name} className="min-w-[180px]">
              <Select
                onValueChange={(value) => {
                  if (onFilterChange) {
                    onFilterChange(category.name, value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={category.label} />
                </SelectTrigger>
                <SelectContent>
                  {category.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 