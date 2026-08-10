"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { SlidersHorizontal } from "lucide-react";

import AdminButton from "@/components/admin/AdminButton";
import { cn } from "@/lib/cn";

export type AdminFilterValues = {
  from: string;
  to: string;
  status: string;
  secondary: string;
  tertiary: string;
};

type AdminSearchFiltersProps = {
  value: AdminFilterValues;
  statusOptions: readonly string[];
  disabled?: boolean;
  onApply: (value: AdminFilterValues) => void;
  onClear: () => void;
  showDateFields?: boolean;
  statusLabel?: string;
  allStatusesLabel?: string;
  secondaryOptions?: readonly string[];
  secondaryLabel?: string;
  allSecondaryLabel?: string;
  tertiaryOptions?: readonly string[];
  tertiaryLabel?: string;
  allTertiaryLabel?: string;
};

const EMPTY_FILTERS: AdminFilterValues = {
  from: "",
  to: "",
  status: "",
  secondary: "",
  tertiary: "",
};

function formatStatusLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function normalizeFilters(value: AdminFilterValues): AdminFilterValues {
  return {
    from: value.from ?? "",
    to: value.to ?? "",
    status: value.status ?? "",
    secondary: value.secondary ?? "",
    tertiary: value.tertiary ?? "",
  };
}

export default function AdminSearchFilters({
  value,
  statusOptions,
  disabled = false,
  onApply,
  onClear,
  showDateFields = true,
  statusLabel = "Status",
  allStatusesLabel = "All statuses",
  secondaryOptions = [],
  secondaryLabel = "Filter",
  allSecondaryLabel = "All",
  tertiaryOptions = [],
  tertiaryLabel = "Filter",
  allTertiaryLabel = "All",
}: AdminSearchFiltersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<AdminFilterValues>(() =>
    normalizeFilters(value)
  );

  const normalizedValue = normalizeFilters(value);
  const hasActiveFilters = Boolean(
    normalizedValue.from ||
      normalizedValue.to ||
      normalizedValue.status ||
      normalizedValue.secondary ||
      normalizedValue.tertiary
  );

  useEffect(() => {
    queueMicrotask(() => setDraft(normalizeFilters(value)));
  }, [value.from, value.to, value.status, value.secondary, value.tertiary]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleApply = () => {
    const nextValue = normalizeFilters(draft);
    setIsOpen(false);
    onApply(nextValue);
  };

  const handlePopoverKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <AdminButton
        type="button"
        variant="secondary"
        icon={SlidersHorizontal}
        iconOnly
        disabled={disabled}
        aria-label="Open filters"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "relative h-10 w-10 min-w-[40px] rounded-lg px-0",
          hasActiveFilters &&
            "border-[#039751] bg-[#f0fdf4] text-[#027d44] dark:border-white/20 dark:bg-neutral-800"
        )}
      />

      {hasActiveFilters && (
        <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full bg-[#039751]" />
      )}

      {isOpen && (
        <div
          className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-black/10 dark:border-neutral-800 dark:bg-neutral-900"
          onKeyDown={handlePopoverKeyDown}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Filters
              </p>
              <p className="text-xs text-neutral-500">
                Narrow results without leaving the search bar.
              </p>
            </div>

            {showDateFields && (
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    From Date
                  </span>
                  <input
                    type="date"
                    value={draft.from}
                    max={draft.to || undefined}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        from: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    To Date
                  </span>
                  <input
                    type="date"
                    value={draft.to}
                    min={draft.from || undefined}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        to: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                </label>
              </div>
            )}

            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                {statusLabel}
              </span>
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950"
              >
                <option value="">{allStatusesLabel}</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            {secondaryOptions.length > 0 && (
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {secondaryLabel}
                </span>
                <select
                  value={draft.secondary}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      secondary: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950"
                >
                  <option value="">{allSecondaryLabel}</option>
                  {secondaryOptions.map((option) => (
                    <option key={option} value={option}>
                      {formatStatusLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {tertiaryOptions.length > 0 && (
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {tertiaryLabel}
                </span>
                <select
                  value={draft.tertiary}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      tertiary: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950"
                >
                  <option value="">{allTertiaryLabel}</option>
                  {tertiaryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setDraft(EMPTY_FILTERS);
                  setIsOpen(false);
                  onClear();
                }}
                className="text-xs font-semibold text-neutral-500 transition-colors hover:text-red-500"
              >
                Clear filters
              </button>

              <AdminButton
                type="button"
                onClick={handleApply}
                variant="primary"
                className="h-9 min-w-[96px] px-4 text-[11px]"
              >
                Apply
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
