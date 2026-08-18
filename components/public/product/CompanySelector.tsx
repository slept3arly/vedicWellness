"use client";

import { useState, useTransition } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Company = { id: string; name: string; slug: string; logoUrl: string };

const DEFAULT_COMPANY = "vedic-wellness";

function CompanyLogo({ company }: { company: Company }) {
  const [hidden, setHidden] = useState(false);

  // No asset resolved server-side (or it failed to load) — never render a
  // broken image or a text/initials fallback.
  if (!company.logoUrl || hidden) return null;

  return (
    <Image
      src={company.logoUrl}
      alt={`${company.name} logo`}
      fill
      unoptimized
      sizes="112px"
      style={{ objectFit: "contain" }}
      onError={() => setHidden(true)}
    />
  );
}

export default function CompanySelector({
  companies,
  activeSlug,
  size = "sm",
}: {
  companies: Company[];
  activeSlug?: string;
  size?: "sm" | "lg";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [targetSlug, setTargetSlug] = useState<string | null>(null);

  const handleNavigate =
    (href: string, slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      // Already viewing this company — simply stay.
      if (activeSlug && activeSlug === slug) return;

      setTargetSlug(slug);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    };

  return (
    <nav
      aria-label="Company and brand selector"
      aria-busy={isPending}
      className={cn(
        "flex items-center justify-center gap-2.5",
        isPending && "pointer-events-none"
      )}
    >
      {/* One shared surface for every brand — a single switcher, not cards. */}
      <div className="flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-[var(--bg-surface)] p-1.5 shadow-sm">
        {companies.map((company) => {
          const isActive = !!activeSlug && company.slug === activeSlug;
          const isLoading = isPending && targetSlug === company.slug;
          const href =
            company.slug === DEFAULT_COMPANY
              ? "/products"
              : `/products?company=${company.slug}`;

          return (
            <Link
              key={company.id}
              href={href}
              prefetch={false}
              aria-label={`${company.name} products${isActive ? " (current)" : ""}`}
              title={company.name}
              aria-current={isActive ? "true" : undefined}
              onClick={handleNavigate(href, company.slug)}
              className={cn(
                "relative flex items-center justify-center rounded-full px-4 py-2 transition-colors",
                size === "lg" && "px-5 py-2.5",
                // A crisp ring only appears for keyboard focus.
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]",
                isActive
                  ? "bg-brand-primary/[0.08] ring-1 ring-brand-primary/30"
                  : "hover:bg-brand-accent/[0.06]",
                isLoading && "opacity-60"
              )}
            >
              <span
                className={cn(
                  "relative h-7 w-24",
                  size === "lg" && "h-8 w-28"
                )}
              >
                <CompanyLogo company={company} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Reserved slot so the pending indicator never shifts the layout. */}
      <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
        {isPending && (
          <Loader2 size={14} className="animate-spin text-brand-accent" />
        )}
      </span>
    </nav>
  );
}