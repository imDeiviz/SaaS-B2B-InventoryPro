// ============================================
// COMPONENTES UI REUTILIZABLES PROFESIONALES
// Con soporte completo para theming dinámico
// ============================================

import { ReactNode, forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Loader2, AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

// ============================================
// BUTTON - THEMED
// ============================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}, ref) => {
  // Using CSS variables for theming
  const variants = {
    primary: 'themed-button-primary',
    secondary: 'bg-[var(--color-bg-sidebar)] text-[var(--color-text-inverse)] hover:opacity-90',
    outline: 'border-2 border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-dark)]',
    ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
});

Button.displayName = 'Button';

// ============================================
// INPUT - THEMED
// ============================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1.5 text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl transition-all duration-200 themed-input',
            'focus:outline-none',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : 'pr-4',
            'py-2.5',
            className
          )}
          style={{
            borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
          {...props}
        />
        {rightIcon && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm flex items-center gap-1 text-danger">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ============================================
// SELECT
// ============================================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'w-full rounded-xl border bg-white px-4 py-2.5 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
          'appearance-none cursor-pointer',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-400',
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// ============================================
// CARD - THEMED (uses CSS variables)
// ============================================
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm transition-all duration-300 themed-card',
        hover && 'hover:shadow-lg cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// BADGE
// ============================================
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ children, variant = 'default', size = 'sm', dot = false }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      variants[variant],
      sizes[size]
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

// ============================================
// STAT CARD
// ============================================
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; up: boolean };
  variant?: 'default' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  gradientFrom = 'from-indigo-500',
  gradientTo = 'to-purple-600'
}: StatCardProps) {
  if (variant === 'gradient') {
    return (
      <div className={cn(
        'bg-gradient-to-br rounded-2xl p-6 text-white shadow-lg animate-slide-up',
        gradientFrom,
        gradientTo
      )}>
        <div className="flex items-center gap-2 mb-3 opacity-90">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-4xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {trend && (
          <p className="mt-2 text-sm opacity-80">{trend.value}</p>
        )}
      </div>
    );
  }

  return (
    <Card className="animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              trend.up ? 'text-emerald-600' : 'text-red-600'
            )}>
              <span className={cn(
                'inline-block w-0 h-0 border-l-4 border-r-4 border-transparent',
                trend.up ? 'border-b-4 border-b-emerald-600' : 'border-t-4 border-t-red-600'
              )} />
              {trend.value}
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ============================================
// MODAL
// ============================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={cn(
        'relative bg-white rounded-2xl shadow-2xl w-full animate-slide-up',
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// CONFIRM DIALOG
// ============================================
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const icons = {
    danger: <XCircle className="text-red-500\" size={48} />,
    warning: <AlertCircle className="text-amber-500" size={48} />,
    info: <Info className="text-blue-500" size={48} />,
  };

  const buttonVariants = {
    danger: 'danger' as const,
    warning: 'primary' as const,
    info: 'primary' as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6 text-center">
        <div className="flex justify-center mb-4">
          {icons[variant]}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in',
      bgColors[type]
    )}>
      {icons[type]}
      <p className="text-sm font-medium text-gray-800 flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-500 mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

// ============================================
// AVATAR
// ============================================
interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export function Avatar({ name, size = 'md', src }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizes[size])}
      />
    );
  }

  return (
    <div className={cn(
      'bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold',
      sizes[size]
    )}>
      {initials}
    </div>
  );
}

// ============================================
// SKELETON LOADER
// ============================================
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

// ============================================
// PROGRESS BAR
// ============================================
interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  variant = 'default'
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
  };

  const variants = {
    default: 'from-indigo-500 to-purple-500',
    success: 'from-emerald-500 to-green-500',
    warning: 'from-amber-500 to-orange-500',
    danger: 'from-red-500 to-rose-500',
  };

  return (
    <div className="w-full">
      <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full bg-gradient-to-r rounded-full transition-all duration-500', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
      )}
    </div>
  );
}

// ============================================
// TABS
// ============================================
interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// BRAND ICON
// ============================================
export { BrandIcon } from './BrandIcon';
