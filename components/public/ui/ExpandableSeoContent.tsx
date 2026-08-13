"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Card from "@/components/public/ui/Card";
import { cn } from "@/lib/cn";

type ExpandableSeoContentProps = {
  title: string;
  preview: string;
  children: React.ReactNode;
  media?: ReactNode;
  titleClassName?: string;
};

const EXPANDED_EVENT = "vedic-wellness:seo-expanded";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ExpandableSeoContent({
  title,
  preview,
  children,
  media,
  titleClassName,
}: ExpandableSeoContentProps) {
  const pathname = usePathname();
  const contentId = `seo-${slugify(title)}`;
  const storageKey = `seo-expanded:${pathname}:${contentId}`;

  const expanded = useSyncExternalStore(
    subscribe,
    () => getExpanded(storageKey),
    () => false
  );

  function toggle() {
    const next = !expanded;
    try {
      sessionStorage.setItem(storageKey, next ? "1" : "0");
      window.dispatchEvent(new Event(EXPANDED_EVENT));
    } catch {
      // sessionStorage unavailable (e.g. private mode) — toggle for this visit
    }
  }

  const split = media != null;
  const contentOpen = expanded;

  return (
    <Card className="w-full min-w-0 max-w-7xl mx-auto bg-white/80 p-4 dark:bg-black/45 sm:p-5">
      <div
        className={cn(
          "flex w-full min-w-0 flex-col",
          split &&
            "lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-10"
        )}
      >
        <div className="order-1 w-full min-w-0 md:max-w-3xl">
          <h2
            className={cn(
              "font-heading text-xl font-semibold leading-tight text-[var(--text-main)] sm:text-2xl",
              titleClassName
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-2 text-sm leading-6 text-[var(--text-muted)] sm:text-base sm:leading-7",
              !split && "line-clamp-3 sm:line-clamp-2"
            )}
          >
            {preview}
          </p>
          <button
            type="button"
            aria-controls={contentId}
            aria-expanded={expanded}
            onClick={toggle}
            className={cn(
              "mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--brand-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)]/50",
              split && "lg:hidden"
            )}
          >
            {expanded ? "Read less ↑" : "Read more →"}
          </button>
        </div>

        {media && (
          <div className="order-2 mt-4 w-full min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0">
            {media}
          </div>
        )}

        <div
          id={contentId}
          className={cn(
            "order-3 w-full min-w-0 md:max-w-3xl",
            "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out motion-reduce:transition-none",
            contentOpen
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
            split && "lg:col-start-1 lg:row-start-2 lg:mt-3 lg:grid-rows-[1fr] lg:opacity-100"
          )}
        >
          <div className="min-h-0 w-full overflow-hidden space-y-3 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}

function subscribe(callback: () => void) {
  window.addEventListener(EXPANDED_EVENT, callback);
  return () => window.removeEventListener(EXPANDED_EVENT, callback);
}

function getExpanded(storageKey: string) {
  try {
    return sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}
