import { useCallback, useMemo, useState } from "react";
import React from "react";

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  /** Unique identifier for the column */
  id: string;
  /** Header label for the column */
  header: string;
  /** Optional className for the th/td when rendering */
  className?: string;
  /** If provided, value will be pulled from the field on the row */
  field?: keyof T;
  /** If provided, will be used to render the cell */
  accessor?: (row: T) => React.ReactNode;
  /** If true, allow sorting by this column (uses field or accessor text) */
  sortable?: boolean;
}

export interface UseTableOptions<T> {
  /** The full dataset to display in the table */
  data: T[];
  /** Column configuration for rendering */
  columns: ColumnDef<T>[];
  /** Initial page size (default 10) */
  pageSize?: number;
  /** Initial sort config */
  initialSortBy?: { id: string; direction?: SortDirection };
  /** Optional initial global filter value */
  initialQuery?: string;
  /** Custom filter predicate; if omitted, a basic string includes() search is used */
  filterFn?: (row: T, query: string) => boolean;
  /** Keys to include in default global filter when filterFn is not provided */
  globalFilterKeys?: (keyof T)[];
}

export interface UseTableResult<T> {
  // data
  allRows: T[]; // after filtering and sorting
  pageRows: T[]; // current page

  // columns
  columns: ColumnDef<T>[];

  // filtering
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;

  // sorting
  sortBy: { id: string; direction: SortDirection } | null;
  toggleSort: (id: string) => void;
  setSort: (id: string, direction: SortDirection) => void;

  // pagination
  pageSize: number;
  setPageSize: (n: number) => void;
  pageIndex: number; // 0-based
  totalPages: number;
  totalCount: number; // total after filtering
  setPageIndex: (idx: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;

  // rendering helper
  getCell: (row: T, col: ColumnDef<T>) => React.ReactNode;
}

function defaultIncludes(haystack: unknown, needle: string): boolean {
  if (needle === "") return true;
  if (haystack == null) return false;
  const str = String(haystack).toLowerCase();
  return str.includes(needle.toLowerCase());
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const sa = String(a).toLowerCase();
  const sb = String(b).toLowerCase();
  if (sa < sb) return -1;
  if (sa > sb) return 1;
  return 0;
}

export function useTable<T>(options: UseTableOptions<T>): UseTableResult<T> {
  const {
    data,
    columns,
    pageSize: initialPageSize = 10,
    initialSortBy,
    initialQuery = "",
    filterFn,
    globalFilterKeys,
  } = options;

  const [query, setQuery] = useState<string>(initialQuery);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [sortBy, setSortBy] = useState<{ id: string; direction: SortDirection } | null>(
    initialSortBy ? { id: initialSortBy.id, direction: initialSortBy.direction ?? "asc" } : null
  );

  // filter
  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.trim();

    if (filterFn) return data.filter((row) => filterFn(row, q));

    // default global filter across provided keys or all fields (best-effort)
    return data.filter((row) => {
      const keys = globalFilterKeys ?? (Object.keys(row as object) as (keyof T)[]);
      return keys.some((k) => defaultIncludes((row as any)[k], q));
    });
  }, [data, query, filterFn, globalFilterKeys]);

  // sort
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const col = columns.find((c) => c.id === sortBy.id);
    if (!col) return filtered;

    const getVal = (row: T) =>
      col.accessor ? col.accessor(row) : col.field ? (row as any)[col.field] : (row as any)[col.id as keyof T];

    const sortedCopy = [...filtered].sort((a, b) => compareValues(getVal(a), getVal(b)));
    return sortBy.direction === "asc" ? sortedCopy : sortedCopy.reverse();
  }, [filtered, sortBy, columns]);

  // pagination
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const clampedPageIndex = Math.min(pageIndex, totalPages - 1);

  const pageRows = useMemo(() => {
    const start = clampedPageIndex * pageSize;
    const end = start + pageSize;
    return sorted.slice(start, end);
  }, [sorted, clampedPageIndex, pageSize]);

  // handlers
  const clearQuery = useCallback(() => setQuery(""), []);

  const setPageIndexSafe = useCallback((idx: number) => {
    const next = Math.max(0, Math.min(idx, Math.max(0, totalPages - 1)));
    setPageIndex(next);
  }, [totalPages]);

  const nextPage = useCallback(() => setPageIndexSafe(clampedPageIndex + 1), [clampedPageIndex, setPageIndexSafe]);
  const prevPage = useCallback(() => setPageIndexSafe(clampedPageIndex - 1), [clampedPageIndex, setPageIndexSafe]);

  const setSort = useCallback((id: string, direction: SortDirection) => {
    setSortBy({ id, direction });
    setPageIndex(0);
  }, []);

  const toggleSort = useCallback((id: string) => {
    setPageIndex(0);
    setSortBy((prev) => {
      if (!prev || prev.id !== id) return { id, direction: "asc" };
      if (prev.direction === "asc") return { id, direction: "desc" };
      return null; // remove sort on third toggle
    });
  }, []);

  const getCell = useCallback((row: T, col: ColumnDef<T>): React.ReactNode => {
    if (col.accessor) return col.accessor(row);
    if (col.field) return (row as any)[col.field] as React.ReactNode;
    return (row as any)[col.id as keyof T] as React.ReactNode;
  }, []);

  // effects for state consistency
  // Reset to first page when data length or query changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { setPageIndex(0); }, [query, data.length, pageSize]);

  return {
    // data
    allRows: sorted,
    pageRows,

    // columns
    columns,

    // filtering
    query,
    setQuery,
    clearQuery,

    // sorting
    sortBy,
    toggleSort,
    setSort,

    // pagination
    pageSize,
    setPageSize,
    pageIndex: clampedPageIndex,
    totalPages,
    totalCount,
    setPageIndex: setPageIndexSafe,
    nextPage,
    prevPage,
    canNextPage: clampedPageIndex < totalPages - 1,
    canPrevPage: clampedPageIndex > 0,

    // rendering
    getCell,
  };
}