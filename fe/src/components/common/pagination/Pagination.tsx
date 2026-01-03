"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getPageItems = (page: number, total: number) => {
  const items: (number | "ellipsis")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push(i);
    return items;
  }
  items.push(1);
  const left = Math.max(2, page - 1);
  const right = Math.min(total - 1, page + 1);
  if (left > 2) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
};

const PaginationCustom = ({ page, totalPages, onPageChange }: Props) => {
  if (!totalPages || totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const btnClass =
    "h-9 px-3 rounded-md border text-sm whitespace-nowrap hover:bg-slate-50";
  const btnDisabled = "opacity-50 pointer-events-none";

  return (
    <Pagination className="w-full">
      <PaginationContent className="flex flex-wrap items-center justify-center gap-2">
        {/* PREV - dùng button để không bị w-10 */}
        <PaginationItem>
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={isFirst}
            className={`${btnClass} ${isFirst ? btnDisabled : ""}`}
          >
            Trang trước
          </button>
        </PaginationItem>

        {/* PAGE NUMBERS */}
        {items.map((it, idx) =>
          it === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationLink
                isActive={it === page}
                onClick={() => go(it)}
                className="h-9 w-9 p-0 rounded-md border text-sm"
              >
                {it}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* NEXT - dùng button để không bị w-10 */}
        <PaginationItem>
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={isLast}
            className={`${btnClass} ${isLast ? btnDisabled : ""}`}
          >
            Trang tiếp theo
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCustom;
