"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Primitive = string | number | boolean;
type QueryValue = Primitive | undefined | null;

type Options = {
  defaultPage?: number;
  defaultPageSize?: number;
  maxPageSize?: number;
};

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  if (!v || !Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

export function usePagination(opts: Options = {}) {
  const { defaultPage = 1, defaultPageSize = 10, maxPageSize = 50 } = opts;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(
    () => toInt(searchParams.get("page"), defaultPage),
    [searchParams, defaultPage]
  );

  const pageSize = useMemo(() => {
    const raw = toInt(searchParams.get("page_size"), defaultPageSize);
    return Math.min(raw, maxPageSize);
  }, [searchParams, defaultPageSize, maxPageSize]);

  const updateParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      updater(p);
      // xóa key rỗng
      [...p.keys()].forEach((k) => {
        const v = p.get(k);
        if (v === null || v === "") p.delete(k);
      });

      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setPage = useCallback(
    (next: number) => {
      const safe = Math.max(1, Math.floor(next));
      updateParams((p) => {
        p.set("page", String(safe));
        if (!p.get("page_size")) p.set("page_size", String(pageSize));
      });
    },
    [updateParams, pageSize]
  );

  const setPageSize = useCallback(
    (size: number) => {
      const safe = Math.min(Math.max(1, Math.floor(size)), maxPageSize);
      updateParams((p) => {
        p.set("page_size", String(safe));
        p.set("page", "1");
      });
    },
    [updateParams, maxPageSize]
  );

  return { page, pageSize, setPage, setPageSize };
}
