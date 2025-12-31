"use client";

import type { ReactNode } from "react";
import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

function buildPageList(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);
  for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }
  return Array.from(pages).sort((a, b) => a - b);
}

function PageButton({
  label,
  onClick,
  disabled,
  isActive,
}: {
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
}) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 shadow-sm";

  const stateClass = disabled
    ? "cursor-not-allowed border-[var(--border-soft)] bg-white/70 text-[var(--muted)]"
    : isActive
      ? "border-transparent bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30"
      : "border-[var(--border-soft)] bg-white text-foreground hover:border-transparent hover:bg-[var(--accent)]/10";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${stateClass}`}
    >
      {label}
    </button>
  );
}

export default function PaginationClient({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pages = useMemo(
    () => buildPageList(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const createHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const handleNavigate = (page: number) => {
    startTransition(() => {
      router.push(createHref(page));
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PageButton
          label="Newer"
          onClick={() => handleNavigate(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
        />
        {pages.map((page) => (
          <PageButton
            key={page}
            label={page}
            onClick={() => handleNavigate(page)}
            isActive={page === currentPage}
            disabled={isPending}
          />
        ))}
        <PageButton
          label="Older"
          onClick={() => handleNavigate(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
        />
      </div>

      <p className="text-xs text-[var(--muted)]">
        Page {currentPage} of {totalPages}
      </p>

      {isPending && (
        <div className="mt-2 w-full max-w-md rounded-2xl border border-[var(--border-soft)] bg-white/90 px-4 py-3 text-center text-sm font-semibold text-[var(--accent)] shadow-sm animate-pulse">
          Fetching fresh travel stories...
        </div>
      )}
    </div>
  );
}
