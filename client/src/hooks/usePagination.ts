// ============================================
// USE PAGINATION HOOK - PAGINACIÓN DE DATOS
// ============================================

import { useState, useMemo, useCallback } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedData: T[];
  
  // Navigation
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  
  // Page size
  setPageSize: (size: number) => void;
  pageSizeOptions: number[];
  
  // State checks
  canGoNext: boolean;
  canGoPrev: boolean;
  
  // Page info
  startIndex: number;
  endIndex: number;
  pageNumbers: (number | 'ellipsis')[];
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50, 100],
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  // Calculate total pages
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Ensure current page is valid
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, validCurrentPage, pageSize]);

  // Navigation
  const goToPage = useCallback((page: number) => {
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(newPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Page size
  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Reset to first page
  }, []);

  // State checks
  const canGoNext = validCurrentPage < totalPages;
  const canGoPrev = validCurrentPage > 1;

  // Page info
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo((): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (validCurrentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = validCurrentPage - 1; i <= validCurrentPage + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [totalPages, validCurrentPage]);

  return {
    currentPage: validCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    pageSizeOptions,
    canGoNext,
    canGoPrev,
    startIndex,
    endIndex,
    pageNumbers,
  };
}
