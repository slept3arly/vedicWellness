"use client";

import { useId, useState } from "react";
import Card from "@/components/public/ui/Card";

type ExpandableSeoContentProps = {
  title: string;
  preview: string;
  children: React.ReactNode;
};

export default function ExpandableSeoContent({
  title,
  preview,
  children,
}: ExpandableSeoContentProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <Card className="w-full min-w-0 max-w-7xl mx-auto bg-white/80 p-4 dark:bg-black/45 sm:p-5">
      <div className="w-full min-w-0 md:max-w-3xl">
        <h2 className="font-heading text-xl font-semibold leading-tight text-[var(--text-main)] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)] sm:line-clamp-2 sm:text-base sm:leading-7">
          {preview}
        </p>
        <button
          type="button"
          aria-controls={contentId}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--brand-primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-primary)]/50"
        >
          {expanded ? "Read less ↑" : "Read more →"}
        </button>
      </div>
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out motion-reduce:transition-none ${
          expanded
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 w-full md:max-w-4xl overflow-hidden space-y-3 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
          {children}
        </div>
      </div>
    </Card>
  );
}
