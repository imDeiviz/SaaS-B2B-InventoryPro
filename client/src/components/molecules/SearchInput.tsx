// ============================================
// SEARCH INPUT COMPONENT - BÚSQUEDA CON DEBOUNCE
// ============================================

import { useState, useEffect, InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  value: externalValue,
  onSearch,
  debounceMs = 300,
  showClearButton = true,
  inputSize = 'md',
  placeholder = 'Buscar...',
  className,
  ...props
}: SearchInputProps) {
  const size = inputSize;
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const debouncedValue = useDebounce(internalValue, debounceMs);

  // Sync with external value
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Trigger search on debounced value change
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setInternalValue('');
    onSearch('');
  };

  const sizes = {
    sm: 'h-8 text-sm pl-8 pr-8',
    md: 'h-10 text-sm pl-10 pr-10',
    lg: 'h-12 text-base pl-12 pr-12',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const iconPositions = {
    sm: 'left-2.5',
    md: 'left-3',
    lg: 'left-4',
  };

  return (
    <div className="relative">
      <Search 
        size={iconSizes[size]} 
        className={cn(
          'absolute top-1/2 -translate-y-1/2 pointer-events-none',
          iconPositions[size]
        )}
        style={{ color: 'var(--color-text-muted)' }}
      />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border transition-all duration-200',
          'focus:outline-none focus:ring-2',
          sizes[size],
          className
        )}
        style={{
          backgroundColor: 'var(--color-bg-input)',
          borderColor: 'var(--color-border-input)',
          color: 'var(--color-text-primary)',
        }}
        {...props}
      />
      {showClearButton && internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 right-3 p-0.5 rounded-full',
            'transition-colors hover:bg-gray-200'
          )}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <X size={iconSizes[size] - 2} />
        </button>
      )}
    </div>
  );
}
