// ============================================
// ICON BUTTON COMPONENT - ACCIONES RÁPIDAS
// ============================================

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'ghost' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'danger' | 'success' | 'warning';
  loading?: boolean;
  tooltip?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'ghost',
  size = 'md',
  color = 'default',
  loading = false,
  tooltip,
  className,
  disabled,
  ...props
}, ref) => {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variants = {
    ghost: {
      default: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
      primary: 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50',
      danger: 'text-red-500 hover:text-red-700 hover:bg-red-50',
      success: 'text-green-500 hover:text-green-700 hover:bg-green-50',
      warning: 'text-amber-500 hover:text-amber-700 hover:bg-amber-50',
    },
    outline: {
      default: 'border border-gray-300 text-gray-600 hover:bg-gray-50',
      primary: 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50',
      danger: 'border border-red-300 text-red-600 hover:bg-red-50',
      success: 'border border-green-300 text-green-600 hover:bg-green-50',
      warning: 'border border-amber-300 text-amber-600 hover:bg-amber-50',
    },
    solid: {
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-amber-600 text-white hover:bg-amber-700',
    },
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      title={tooltip}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizes[size],
        variants[variant][color],
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color={variant === 'solid' && color !== 'default' ? 'white' : 'current'} />
      ) : (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';
