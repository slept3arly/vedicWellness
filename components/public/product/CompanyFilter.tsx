"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Company = { id: string; name: string; slug: string };

export default function CompanyFilter({
  companies,
  value,
  onChange,
}: {
  companies: Company[];
  value: string;
  onChange: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const options = [
    { id: "all", name: "All Companies", slug: "" },
    ...companies,
  ];
  const selectedLabel =
    companies.find((c) => c.slug === value)?.name ?? "All Companies";

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selected =
      listboxRef.current?.querySelector<HTMLButtonElement>(
        '[aria-selected="true"]'
      );
    (selected ?? listboxRef.current?.querySelector<HTMLButtonElement>("button"))
      ?.focus();
  }, [open]);

  const focusTrigger = () =>
    rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      focusTrigger();
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End")
      return;
    const buttons = Array.from(
      listboxRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []
    );
    if (buttons.length === 0) return;
    e.preventDefault();
    const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") buttons[(idx + 1) % buttons.length]?.focus();
    else if (e.key === "ArrowUp")
      buttons[(idx - 1 + buttons.length) % buttons.length]?.focus();
    else if (e.key === "Home") buttons[0]?.focus();
    else buttons[buttons.length - 1]?.focus();
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter by company: ${selectedLabel}`}
        title="Filter by company"
        className="flex h-9 sm:h-10 items-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl border border-[var(--border-soft)] bg-[var(--bg-main)] px-2 sm:px-2.5 text-xs sm:text-sm text-[var(--text-main)] hover:border-brand-accent/50 outline-none focus-visible:ring-1 focus-visible:ring-brand-accent/40 focus-visible:border-brand-accent transition-all"
      >
        <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--text-muted)]" />
        <span className="hidden sm:inline max-w-[140px] truncate">
          {selectedLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--text-muted)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          ref={listboxRef}
          role="listbox"
          aria-label="Company"
          onKeyDown={handleKeyDown}
          className="absolute right-0 top-[calc(100%+6px)] z-30 w-44 max-h-60 overflow-y-auto rounded-xl border border-[var(--border-soft)] bg-white dark:bg-neutral-900 py-1 shadow-lg shadow-black/10 dark:shadow-black/40"
        >
          {options.map((option) => {
            const isSelected = option.slug === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => {
                  setOpen(false);
                  onChange(option.slug);
                }}
                className={cn(
                  "flex h-9 w-full items-center justify-between gap-2 px-3 text-left text-xs sm:text-sm transition-colors",
                  isSelected
                    ? "bg-brand-primary/[0.12] font-semibold text-brand-primary dark:text-brand-accent"
                    : "text-[var(--text-main)] hover:bg-brand-accent/10 focus-visible:bg-brand-accent/10 focus-visible:outline-none"
                )}
              >
                <span className="truncate">{option.name}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-brand-primary dark:text-brand-accent" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
