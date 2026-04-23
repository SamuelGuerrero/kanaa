import { useState, useMemo, useCallback } from "react";

interface UseCarouselPaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

interface UseCarouselPaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  visibleItems: T[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  shouldShowControls: boolean;
  startIndex: number;
  endIndex: number;
}

export function useCarouselPagination<T>({
  items,
  itemsPerPage = 4,
}: UseCarouselPaginationProps<T>): UseCarouselPaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage],
  );

  console.log("Total de paginas", totalPages, items.length, itemsPerPage);

  const shouldShowControls = useMemo(
    () => items.length > itemsPerPage,
    [items.length, itemsPerPage],
  );

  const startIndex = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage],
  );

  const endIndex = useMemo(
    () => startIndex + itemsPerPage,
    [startIndex, itemsPerPage],
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  return {
    currentPage,
    totalPages,
    visibleItems,
    nextPage,
    prevPage,
    goToPage,
    shouldShowControls,
    startIndex,
    endIndex,
  };
}
