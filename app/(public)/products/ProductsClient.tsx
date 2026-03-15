"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, ArrowUpDown, ArrowUpRight, X, ListFilter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PageHeader from "@/components/public/ui/PageHeader";
import Card from "@/components/public/ui/Card";
import Chip from "@/components/public/ui/Chip";
import { fadeUpSoft, staggerSlow } from "@/app/animations";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  imageUrl: string | null;
};

export default function ProductsClient({
  products,
  page,
  totalPages,
  totalCount,
  query,
  sort,
}: {
  products: Product[];
  page: number;
  totalPages: number;
  totalCount: number;
  query: string;
  sort: string;
}) {
  const router = useRouter();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(query);

  const anchorToFilter = () => {
    if (filterBarRef.current) {
      const stickyOffset = window.innerWidth >= 768 ? 160 : 128;
      const elementPosition =
        filterBarRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - stickyOffset,
        behavior: "smooth",
      });
    }
  };

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("query") as string).trim();
    const s = formData.get("sort") as string;

    const params = new URLSearchParams();
    params.set("page", "1");
    if (q) params.set("query", q);
    if (s && s !== "name_asc") params.set("sort", s);

    router.push(`/products?${params.toString()}`, { scroll: false });
    requestAnimationFrame(anchorToFilter);
  }

  const handleGlobalClear = () => {
    setInputValue("");
    router.push("/products?page=1", { scroll: false });
    anchorToFilter();
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
    return `/products?${params.toString()}`;
  }

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20 space-y-10">
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} /> Ayurvedic Products
            </Chip>
          }
          title={
            <>
              Explore our <span className="text-accent">product range</span>
            </>
          }
          subtitle="Premium Ayurvedic formulations designed for demand, trust, and repeat customers."
        />

        <div className="flex flex-wrap justify-center gap-3">
          {["Ayurvedic", "PCD Pharma", "Capsules", "Oils"].map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {/* COMPACT STICKY FILTER BAR */}
        <div
          ref={filterBarRef}
          className="sticky top-32 md:top-36 z-20 scroll-mt-40"
        >
          <Card className="bg-white/80 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 p-2 backdrop-blur-md shadow-xl shadow-black/5">
            <form onSubmit={handleFilter} className="flex items-center gap-2">
              {/* Dominant Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="query"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 pl-10 pr-10 text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                />
                {(inputValue || query) && (
                  <button
                    type="button"
                    onClick={handleGlobalClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Square Sort Button (Hidden Select) */}
              <div className="relative h-11 w-11 shrink-0 group/sort">
                <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 group-hover/sort:border-accent transition-colors pointer-events-none">
                  <ArrowUpDown className="h-4 w-4" />
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

              {/* Square Search Submit Button */}
              <button
                type="submit"
                className="h-11 w-11 shrink-0 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </form>

            <div className="mt-1.5 px-2 flex justify-between items-center">
               <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                {totalCount} Results
              </span>
              {query && (
                <span className="text-[10px] text-accent font-medium truncate max-w-[150px]">
                  "{query}"
                </span>
              )}
            </div>
          </Card>
        </div>

        {/* PRODUCT GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`grid-${query}-${sort}-${page}`}
            variants={staggerSlow}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-2 gap-4 lg:grid-cols-3"
          >
            {products.length > 0 ? (
              products.map((p) => (
                <motion.div key={p.id} variants={fadeUpSoft} className="group">
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
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center"
              >
                <Search size={48} className="mx-auto text-muted/20 mb-4" />
                <h3 className="text-lg font-heading">No products found</h3>
                <p className="text-sm text-muted mt-1">
                  Try different keywords or clear your filters.
                </p>
                <button
                  onClick={handleGlobalClear}
                  className="mt-6 text-sm font-bold text-accent underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

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