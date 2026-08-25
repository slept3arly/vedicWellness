"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUpRight,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PageHeader from "@/components/public/ui/PageHeader";
import Card from "@/components/public/ui/Card";
import CompanyFilter from "@/components/public/product/CompanyFilter";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  imageUrl: string | null;
};
type Company = { id: string; name: string; slug: string };

export default function ProductsClient({
  products,
  page,
  totalPages,
  totalCount,
  query,
  sort,
  company,
  companyName,
  companies,
}: {
  products: Product[];
  page: number;
  totalPages: number;
  totalCount: number;
  query: string;
  sort: string;
  company: string;
  companyName: string;
  companies: Company[];
}) {
  const router = useRouter();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [inputValue, setInputValue] = useState(query);

  const anchorToFilter = () => {
    if (filterBarRef.current) {
      // Derive the offset from the bar's actual sticky geometry; the computed
      // --header-offset keeps this in sync with the hidden-header transform.
      const styles = window.getComputedStyle(filterBarRef.current);
      let stickyOffset = Number.isFinite(parseFloat(styles.top))
        ? parseFloat(styles.top)
        : 128;
      if (document.documentElement.dataset.headerHidden === "true") {
        const parsed = parseFloat(styles.getPropertyValue("--header-offset"));
        if (Number.isFinite(parsed))
          stickyOffset = Math.max(0, stickyOffset - parsed + 8);
      }
      const elementPosition =
        filterBarRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, elementPosition - stickyOffset),
        behavior: "smooth",
      });
    }
  };

  function applyFilters(q: string, s: string, c: string) {
    const trimmedQuery = q.trim();

    // No-op when the listing wouldn't change: repeated Enter presses while
    // focused on the input must not re-navigate or move the viewport.
    if (
      trimmedQuery === query.trim() &&
      s === (sort || "name_asc") &&
      (c || "") === (company || "") &&
      page === 1
    )
      return;

    const params = new URLSearchParams();
    params.set("page", "1");
    if (trimmedQuery) params.set("query", trimmedQuery);
    if (s && s !== "name_asc") params.set("sort", s);
    if (c) params.set("company", c);

    router.push(`/products?${params.toString()}`, { scroll: false });
  }

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    applyFilters(
      (formData.get("query") as string) ?? "",
      (formData.get("sort") as string) ?? "name_asc",
      (formData.get("company") as string) ?? ""
    );
  }

  const handleCompanyChange = (slug: string) => {
    const form = formRef.current;
    const formData = form ? new FormData(form) : null;
    applyFilters(
      ((formData?.get("query") as string) ?? "").trim(),
      (formData?.get("sort") as string) ?? "name_asc",
      slug
    );
  };

  const handleGlobalClear = () => {
    setInputValue("");
    const params = new URLSearchParams();
    params.set("page", "1");
    if (company) params.set("company", company);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const windowSize = 2;
  const start = Math.max(1, page - windowSize);
  const end = Math.min(totalPages, page + windowSize);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    if (query) params.set("query", query);
    if (sort && sort !== "name_asc") params.set("sort", sort);
    if (company) params.set("company", company);
    return `/products?${params.toString()}`;
  }

  return (
    <section className="relative w-full px-4 sm:px-6 pt-12 sm:pt-20 pb-8 sm:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title={
            <>
              Explore our product range at{" "}<span className="text-brand-accent">{companyName}</span>
            </>
          }
          subtitle="Premium Ayurvedic formulations designed for demand, trust, and repeat customers."
        />

        {/* COMPACT STICKY FILTER BAR */}
        <div
          ref={filterBarRef}
          className="sticky z-20 mt-8 sm:mt-12 public-sticky-filter"
        >
          <div className="rounded-xl sm:rounded-2xl border border-[var(--border-soft)] bg-white dark:bg-neutral-900 p-1.5 sm:p-2 shadow-md shadow-black/5">
            <form
              ref={formRef}
              onSubmit={handleFilter}
              className="flex flex-nowrap items-center gap-1.5 sm:gap-2"
            >
              {/* Dominant Search Input */}
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--text-muted)]" />
                <input
                  name="query"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search products..."
                  className="h-9 sm:h-10 w-full rounded-lg sm:rounded-xl border border-[var(--border-soft)] bg-[var(--bg-main)] pl-8 pr-8 sm:pl-9 sm:pr-9 text-xs sm:text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/70 focus:ring-1 focus:ring-brand-accent/40 focus:border-brand-accent outline-none transition-all"
                />
                {(inputValue || query) && (
                  <button
                    type="button"
                    onClick={handleGlobalClear}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Company Filter — custom dropdown (native select popups can't be styled) */}
              <input type="hidden" name="company" value={company || ""} />
              <CompanyFilter
                companies={companies}
                value={company || ""}
                onChange={handleCompanyChange}
              />

              {/* Square Sort Button (Hidden Select) */}
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 group/sort">
                <div className="absolute inset-0 flex items-center justify-center rounded-lg sm:rounded-xl border border-[var(--border-soft)] bg-[var(--bg-main)] text-[var(--text-muted)] group-hover/sort:text-[var(--text-main)] group-hover/sort:border-brand-accent transition-colors pointer-events-none">
                  <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <select
                  name="sort"
                  defaultValue={sort || "name_asc"}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  aria-label="Sort products"
                >
                  <option value="name_asc">Name A → Z</option>
                  <option value="name_desc">Name Z → A</option>
                  <option value="price_asc">Price low → high</option>
                  <option value="price_desc">Price high → low</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>

              {/* Square Search Submit Button (Restored original black/white brand styling) */}
              <button
                type="submit"
                aria-label="Submit search"
                className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95 shadow-sm"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
              </button>
            </form>

            <div className="mt-1 px-1.5 flex justify-between items-center text-[10px] sm:text-[11px] text-[var(--text-muted)]">
              <span className="font-semibold uppercase tracking-wider">
                {totalCount} {totalCount === 1 ? "Product" : "Products"}
              </span>
              {query && (
                <span className="text-brand-accent font-medium truncate max-w-[180px]">
                  &quot;{query}&quot;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((p) => (
                <div key={p.id} className="group">
                  <Link href={`/products/${p.slug}`} prefetch={false} className="block h-full">
                    <Card className="h-full p-3 flex flex-col border-neutral-200 dark:border-neutral-800">
                      {p.imageUrl && (
                        <div className="relative w-full h-32 md:h-44 overflow-hidden rounded-xl mb-3">
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-[13px] md:text-sm font-extrabold line-clamp-1 group-hover:text-accent transition-colors">
                            {p.name}
                          </h3>
                          <p className="text-[10px] md:text-[11px] text-muted line-clamp-2 mt-0.5 leading-tight">
                            {p.shortDescription ||
                              "Premium Ayurvedic formulation."}
                          </p>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className="mb-2 p-1 md:p-1.5 rounded-lg bg-muted/5 transition-all group-hover:bg-accent/10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <ArrowUpRight
                              size={14}
                              className="text-muted transition-colors group-hover:text-accent"
                            />
                          </div>
                          <div className="font-bold text-accent text-[12px] md:text-sm">
                            ₹{p.price}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <Search size={48} className="mx-auto text-muted/20 mb-4" />
                <h3 className="text-lg font-heading">No products found</h3>
                <p className="text-sm text-muted mt-1">
                  {company ? `No products are currently available from ${companyName}.` : "Try different keywords or clear your filters."}
                </p>
                <button
                  onClick={handleGlobalClear}
                  className="mt-6 text-sm font-bold text-accent underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-[11px] text-muted uppercase tracking-widest font-bold">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {pages.map((p) => (
                <Link
                  key={p}
                  href={buildHref(p)}
                  prefetch={false}
                  scroll={false}
                  onClick={anchorToFilter}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    p === page
                      ? "bg-accent text-white shadow-lg shadow-accent/20 scale-110"
                      : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-accent/50"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
