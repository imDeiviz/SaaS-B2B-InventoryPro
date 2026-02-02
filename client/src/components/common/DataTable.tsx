// ============================================
// COMPONENTE DE TABLA DE DATOS PROFESIONAL
// Con paginación, ordenamiento y búsqueda
// ============================================

import { useState, useMemo, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Input, EmptyState } from '@/components/ui';
import { 
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, ArrowUp, ArrowDown, Filter
} from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFn?: (item: T, search: string) => boolean;
  pageSize?: number;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: (item: T) => ReactNode;
  onRowClick?: (item: T) => void;
  selectedId?: string;
  getId: (item: T) => string;
  getSortValue?: (item: T, key: string) => unknown;
  headerActions?: ReactNode;
  loading?: boolean;
  striped?: boolean;
  compact?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  searchFn,
  pageSize = 10,
  emptyIcon,
  emptyTitle = 'No hay datos',
  emptyDescription,
  actions,
  onRowClick,
  selectedId,
  getId,
  getSortValue,
  headerActions,
  loading = false,
  striped = true,
  compact = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search.trim() || !searchFn) return data;
    return data.filter(item => searchFn(item, search.toLowerCase()));
  }, [data, search, searchFn]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !getSortValue) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = (aVal as number | string) < (bVal as number | string) ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection, getSortValue]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="text-indigo-600" />
      : <ArrowDown size={14} className="text-indigo-600" />;
  };

  // Pagination controls
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div 
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{ 
          backgroundColor: 'var(--color-bg-card)', 
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--color-border)' 
        }}
      >
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 skeleton rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl shadow-sm overflow-hidden"
      style={{ 
        backgroundColor: 'var(--color-bg-card)', 
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--color-border)' 
      }}
    >
      {/* Header */}
      {(searchable || headerActions) && (
        <div 
          className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between"
          style={{ borderBottom: '1px solid var(--color-border-light)' }}
        >
          {searchable && (
            <div className="w-full sm:w-72">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--color-bg-sunken)', borderBottom: '1px solid var(--color-border-light)' }}>
            <tr>
              {columns.map((column, colIndex) => (
                <th
                  key={String(column.key) + colIndex}
                  className={cn(
                    'text-left text-sm font-semibold',
                    compact ? 'px-3 py-2' : 'px-4 py-3',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer transition-colors select-none'
                  )}
                  style={{ 
                    width: column.width, 
                    color: 'var(--color-text-secondary)',
                  }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className={cn(
                    'flex items-center gap-1.5',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    {column.header}
                    {column.sortable && getSortIcon(String(column.key))}
                  </div>
                </th>
              ))}
              {actions && (
                <th 
                  className={cn(
                    'text-right text-sm font-semibold',
                    compact ? 'px-3 py-2' : 'px-4 py-3'
                  )}
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody style={{ borderColor: 'var(--color-border-light)' }}>
            {paginatedData.map((item, index) => (
              <tr
                key={getId(item)}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer',
                )}
                style={{
                  backgroundColor: selectedId === getId(item) 
                    ? 'var(--color-primary-light)' 
                    : striped && index % 2 === 1 
                      ? 'var(--color-bg-sunken)' 
                      : 'transparent',
                  borderBottom: '1px solid var(--color-border-light)',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== getId(item)) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== getId(item)) {
                    e.currentTarget.style.backgroundColor = striped && index % 2 === 1 
                      ? 'var(--color-bg-sunken)' 
                      : 'transparent';
                  }
                }}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={String(column.key) + colIndex}
                    className={cn(
                      'text-sm',
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {column.render 
                      ? column.render(item, index)
                      : String((item as Record<string, unknown>)[String(column.key)] ?? '-')
                    }
                  </td>
                ))}
                {actions && (
                  <td className={cn(
                    'text-right',
                    compact ? 'px-3 py-2' : 'px-4 py-3'
                  )} onClick={(e) => e.stopPropagation()}>
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <EmptyState
          icon={emptyIcon || <Filter size={24} />}
          title={emptyTitle}
          description={emptyDescription}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div 
          className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--color-border-light)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} resultados
          </p>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={!canGoPrevious}
              className="p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!canGoPrevious}
              className="p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent',
                      color: currentPage === page ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-1" style={{ color: 'var(--color-text-muted)' }}>...</span>
                )
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!canGoNext}
              className="p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={!canGoNext}
              className="p-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
