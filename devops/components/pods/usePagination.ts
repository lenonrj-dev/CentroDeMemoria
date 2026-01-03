// file: components/pods/usePagination.ts
"use client";

import { useMemo, useState } from "react";

export default function usePagination(items, defaultPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paged = useMemo(() => {
    const from = (page - 1) * pageSize;
    return items.slice(from, from + pageSize);
  }, [items, page, pageSize]);

  return { page, setPage, pageSize, totalPages, paged };
}
