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

import PageHeader from "@/components/public/PageHeader";
import GlassCard from "@/components/old_files/ui/GlassCard";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Chip from "@/components/public/ui/Chip";

import { reveal, staggerFast } from "@/app/animations";

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

type SortKey =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "newest";

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
          : "border border-slate-200 bg-white/70 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
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
  pageSize,
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
    if (query.trim()) c++;
    if (sort !== "name_asc") c++;
    return c;
  }, [query, sort]);

  const filteredSorted = useMemo(() => {
    const q = query.toLowerCase();

    let list = products.filter((p) => {
      if (!q) return true;
      return `${p.name} ${p.shortDescription ?? ""}`
        .toLowerCase()
        .includes(q);
    });

    list.sort((a, b) => {
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "newest") {
        return (
          (b.createdAt ? +new Date(b.createdAt) : 0) -
          (a.createdAt ? +new Date(a.createdAt) : 0)
        );
      }
      return 0;
    });

    return list;
  }, [products, query, sort]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 lg:pt-16 lg:pb-20">

        <PageHeader
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-500/10 px-4 py-2 text-sm text-green-800 dark:text-green-200">
              <Sparkles size={16} />
              Ayurvedic Products
            </span>
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
            <motion.div key={i.title} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex gap-4">
                  <div className="rounded-2xl bg-green-600/15 p-3 text-green-700 dark:text-green-300">
                    <i.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {i.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {i.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <SectionHeading
            title="Products Catalog"
            subtitle="Browse our available Ayurvedic products"
          />

          {/* FILTER BAR */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">

            <div className="grid gap-3 lg:grid-cols-12">
              <div className="lg:col-span-8 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                />
              </div>

              <div className="lg:col-span-4 flex items-center gap-2 h-12 rounded-2xl border border-slate-200 bg-white/80 px-4 dark:border-slate-800 dark:bg-slate-950/50">
                <ArrowUpDown size={16} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-transparent w-full text-sm outline-none dark:text-white"
                >
                  <option value="name_asc">Name A → Z</option>
                  <option value="name_desc">Name Z → A</option>
                  <option value="price_asc">Price low → high</option>
                  <option value="price_desc">Price high → low</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>
                Showing <b>{filteredSorted.length}</b> results
              </span>

              {activeCount > 0 && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSort("name_asc");
                  }}
                  className="flex items-center gap-2 rounded-2xl border px-4 py-2 dark:border-slate-800"
                >
                  <X size={16} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* GRID */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSorted.map((p) => (
              <motion.div key={p.id} variants={reveal}>
                <Link href={`/products/${encodeURIComponent(p.slug)}`} className="block group">
                  <GlassCard className="overflow-hidden">

                    <div className="relative h-52">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white font-bold">
                        {p.name}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                        {p.shortDescription || "Premium Ayurvedic formulation."}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-semibold">
                          ₹{p.price}
                        </span>
                        <span className="text-green-600 font-semibold group-hover:translate-x-1 transition">
                          View →
                        </span>
                      </div>
                    </div>

                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* PAGINATION */}
          <div className="mt-10 flex flex-col items-center gap-3">

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Page {page} of {totalPages} · {totalCount} products
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {page > 1 && (
                <PageButton href={`/products?page=${page - 1}`}>
                  ← Prev
                </PageButton>
              )}

              {Array.from({ length: totalPages })
                .slice(0, 7)
                .map((_, i) => {
                  const p = i + 1;
                  return (
                    <PageButton key={p} href={`/products?page=${p}`} active={p === page}>
                      {p}
                    </PageButton>
                  );
                })}

              {page < totalPages && (
                <PageButton href={`/products?page=${page + 1}`}>
                  Next →
                </PageButton>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
