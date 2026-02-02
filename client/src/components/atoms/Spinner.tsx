// ============================================
// SPINNER COMPONENT - LOADING INDICATOR
// ============================================

import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white' | 'current';
}

export function Spinner({ size = 'md', className, color = 'primary' }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const colors = {
    primary: 'border-indigo-200 border-t-indigo-600',
    white: 'border-white/30 border-t-white',
    current: 'border-current/30 border-t-current',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
