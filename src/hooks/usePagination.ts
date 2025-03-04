import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialRowsPerPage?: number;
  totalItems?: number;
}

export function usePagination({
  initialPage = 0,
  initialRowsPerPage = 10,
  totalItems = 0,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [total, setTotal] = useState(totalItems);

  const totalPages = Math.ceil(total / rowsPerPage);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(0, Math.min(newPage, Math.max(totalPages - 1, 0))));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 0) {
      setPage(page - 1);
    }
  }, [page]);

  const changeRowsPerPage = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  }, []);

  return {
    page,
    rowsPerPage,
    total,
    totalPages,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    changeRowsPerPage,
    hasPrevPage: page > 0,
    hasNextPage: page < totalPages - 1,
  };
}

export default usePagination;