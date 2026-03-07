"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, ArrowUpDown, ArrowUpRight, X } from "lucide-react";
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

  // Precision Anchor: Keeps the search bar "stuck" at the top during refresh
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

        {/* STICKY FILTER BAR */}
        <div
          ref={filterBarRef}
          className="sticky top-32 md:top-40 z-20 scroll-mt-40 group"
        >
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-3 backdrop-blur-md">
            <form onSubmit={handleFilter} className="flex flex-col gap-2">
              {/* Row 1: Search Input Full Width */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  name="query"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search by name, category, or benefits..."
                  className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                />
                {(inputValue || query) && (
                  <button
                    type="button"
                    onClick={handleGlobalClear}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-accent transition-colors"
                  >
                    <X className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* Row 2: Sort + Search Button */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 h-10">
                  <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <select
                    name="sort"
                    defaultValue={sort || "name_asc"}
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    className="bg-transparent w-full text-sm outline-none cursor-pointer"
                  >
                    <option value="name_asc">Name A → Z</option>
                    <option value="name_desc">Name Z → A</option>
                    <option value="price_asc">Price low → high</option>
                    <option value="price_desc">Price high → low</option>
                    <option value="newest">Newest first</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="h-10 px-6 shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            <div className="mt-2 text-[11px] text-neutral-400 flex justify-between px-1 font-medium">
              <span>
                Showing <b>{totalCount}</b> results
              </span>
              {query && (
                <span className="opacity-70">Filtered by: "{query}"</span>
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
                  <Link href={`/products/${p.slug}`} className="block h-full">
                    <Card className="h-full p-3 flex flex-col border-neutral-200 dark:border-neutral-800">
                      {p.imageUrl && (
                        <div className="relative w-full h-32 md:h-44 overflow-hidden rounded-xl mb-3">
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            fill
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