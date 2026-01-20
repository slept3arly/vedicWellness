"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BadgeCheck,
  Truck,
  MapPin,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import PageHeader from "@/components/ui/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Chip from "@/components/ui/Chip";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  imageUrl: string | null;
  createdAt?: Date;
  tag?: string | null;
  medicineForm?: string | null;
};

type SortKey = "name_asc" | "name_desc" | "price_asc" | "price_desc" | "newest";

function PageButton({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "min-w-10 h-10 px-4 rounded-2xl flex items-center justify-center text-sm font-semibold transition",
        active
          ? "bg-green-600 text-white shadow-sm"
          : "border border-slate-200 bg-white/70 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function ProductsClient({
  products,
  page,
  totalPages,
  totalCount,
}: {
  products: Product[];
  page: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name_asc");

  const activeCount = useMemo(() => {
    let c = 0;
    if (query.trim().length) c++;
    if (sort !== "name_asc") c++;
    return c;
  }, [query, sort]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => {
      if (!q) return true;
      const blob = `${p.name} ${p.shortDescription ?? ""}`.toLowerCase();
      return blob.includes(q);
    });

    list = [...list].sort((a, b) => {
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);

      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;

      if (sort === "newest") {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad;
      }
      return 0;
    });

    return list;
  }, [products, query, sort]);

  function clearFilters() {
    setQuery("");
    setSort("name_asc");
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <PageHeader
          badge={
            <p className="inline-flex mx-auto items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Ayurvedic Products
            </p>
          }
          title={
            <>
              Explore our{" "}
              <span className="text-w dark:text-green-400">product range</span>
            </>
          }
          subtitle="Premium Ayurvedic formulations designed for demand, trust and repeat customers — ideal for PCD pharma franchise partners."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["High Demand", "Premium Packaging", "PCD Ready", "Fast Dispatch"].map(
            (t) => (
              <Chip key={t}>{t}</Chip>
            )
          )}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "WHO-GMP Quality",
              desc: "Consistent manufacturing standards",
              icon: BadgeCheck,
            },
            {
              title: "Fast Dispatch",
              desc: "Quick packaging + shipping support",
              icon: Truck,
            },
            {
              title: "Monopoly Rights",
              desc: "Area-based franchise availability",
              icon: MapPin,
            },
          ].map((i) => (
            <div
              key={i.title}
              className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                  <i.icon size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    {i.title}
                  </h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-300">
                    {i.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading
            title="Products Catalog"
            subtitle="Browse our available Ayurvedic products"
          />

          {/* Filter */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
            <div className="grid gap-3 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-slate-900 outline-none transition
                      focus:border-green-500 focus:ring-4 focus:ring-green-500/10
                      dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <div
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 flex items-center gap-2
                  focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10
                  dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <ArrowUpDown size={16} className="text-slate-500" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white"
                  >
                    <option value="name_asc">Name A → Z</option>
                    <option value="name_desc">Name Z → A</option>
                    <option value="price_asc">Price low → high</option>
                    <option value="price_desc">Price high → low</option>
                    <option value="newest">Newest first</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>
                Showing{" "}
                <b className="text-slate-900 dark:text-white">
                  {filteredSorted.length}
                </b>{" "}
                results (this page)
              </span>

              {activeCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white
                    dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSorted.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.02 }}
              >
                <Link
                  href={`/products/${encodeURIComponent(p.slug)}`}
                  className="block group"
                >
                  <GlassCard className="overflow-hidden relative">
                    <div className="relative h-52 w-full overflow-hidden">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={`${p.name}`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.06]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={idx < 3}
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-200/40 dark:bg-slate-800/40 flex items-center justify-center text-sm text-slate-600 dark:text-slate-300">
                          No image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute left-4 top-4 flex gap-2">
                        {p.tag ? (
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            <Sparkles size={14} />
                            {p.tag}
                          </div>
                        ) : null}

                        {p.medicineForm ? (
                          <div className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {String(p.medicineForm).toLowerCase()}
                          </div>
                        ) : null}
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        ₹{p.price}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="font-heading text-lg font-extrabold leading-snug text-white line-clamp-2">
                          {p.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="font-body text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                        {p.shortDescription || "Premium Ayurvedic formulation."}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-300">
                            PCD Ready
                          </span>
                          <span className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                            Fast Dispatch
                          </span>
                        </div>

                        <span className="text-sm font-semibold text-green-700 dark:text-green-300 group-hover:translate-x-0.5 transition">
                          View →
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Page{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalPages}
              </span>{" "}
              ·{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalCount}
              </span>{" "}
              total products
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {page > 1 && (
                <PageButton href={`/products?page=${page - 1}`}>← Prev</PageButton>
              )}

              {Array.from({ length: totalPages })
                .slice(0, 7)
                .map((_, i) => {
                  const p = i + 1;
                  return (
                    <PageButton
                      key={p}
                      href={`/products?page=${p}`}
                      active={p === page}
                    >
                      {p}
                    </PageButton>
                  );
                })}

              {totalPages > 7 && <span className="px-2 text-slate-500">…</span>}

              {totalPages > 7 && (
                <PageButton
                  href={`/products?page=${totalPages}`}
                  active={totalPages === page}
                >
                  {totalPages}
                </PageButton>
              )}

              {page < totalPages && (
                <PageButton href={`/products?page=${page + 1}`}>Next →</PageButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
