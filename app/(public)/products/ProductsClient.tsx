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
import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import Chip from "@/components/public/ui/Chip";

import { reveal, staggerFast } from "@/app/animations";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  imageUrl: string | null;
  createdAt?: Date;
};

type SortKey =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "newest";

/* ------------------------------------------------------------------ */
/* Pagination Button */
/* ------------------------------------------------------------------ */

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
        "min-w-10 h-10 px-4 rounded-[14px] flex items-center justify-center text-sm font-semibold transition",
        active
          ? "bg-[color:var(--brand-primary)] text-white shadow-md"
          : "border border-[var(--border-soft)] bg-[var(--bg-surface)] hover:bg-white/80",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

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
    <section>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20 space-y-14">

        {/* Header */}
        <PageHeader
          badge={
            <Chip className="flex items-center gap-2">
              <Sparkles size={14} />
              Ayurvedic Products
            </Chip>
          }
          title={
            <>
              Explore our{" "}
              <span className="text-[color:var(--brand-accent)]">
                product range
              </span>
            </>
          }
          subtitle="Premium Ayurvedic formulations designed for demand, trust, and repeat customers."
        />

        {/* Trust Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {["High Demand", "Premium Packaging", "PCD Ready", "Fast Dispatch"].map(
            (t) => (
              <Chip key={t}>{t}</Chip>
            )
          )}
        </div>

        {/* Highlights */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "GMP Quality",
              desc: "Consistent Manufacturing Quality",
              icon: BadgeCheck,
            },
            {
              title: "Fast Dispatch",
              desc: "Quick Packaging and Shipping PAN India",
              icon: Truck,
            },
            {
              title: "Monopoly Rights",
              desc: "Location-based franchise availability",
              icon: MapPin,
            },
          ].map((i) => (
            <motion.div key={i.title} variants={reveal}>
              <Card>
                <div className="flex gap-4">
                  <div className="rounded-xl bg-[color:var(--brand-primary)]/20 p-3 text-[color:var(--brand-accent)]">
                    <i.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{i.title}</h3>
                    <p className="text-sm text-muted">{i.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Catalog */}
        <div>
          <SectionHeading
            title="Products Catalog"
            subtitle="Browse our available Ayurvedic products"
          />

          {/* Filters */}
          <Card className="mt-6">
            <div className="grid gap-3 lg:grid-cols-12">
              <div className="lg:col-span-8 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="h-12 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--bg-surface)] pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)]/25"
                />
              </div>

              <div className="lg:col-span-4 flex items-center gap-2 h-12 rounded-[14px] border border-[var(--border-soft)] bg-[var(--bg-surface)] px-4">
                <ArrowUpDown size={16} />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="bg-transparent w-full text-sm outline-none"
                >
                  <option value="name_asc">Name A → Z</option>
                  <option value="name_desc">Name Z → A</option>
                  <option value="price_asc">Price low → high</option>
                  <option value="price_desc">Price high → low</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm text-muted">
              <span>
                Showing <b>{filteredSorted.length}</b> results
              </span>

              {activeCount > 0 && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSort("name_asc");
                  }}
                  className="flex items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 py-2"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </Card>

          {/* Grid */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSorted.map((p) => (
              <motion.div key={p.id} variants={reveal}>
                <Link
                  href={`/products/${encodeURIComponent(p.slug)}`}
                  className="block group h-full"
                >
                  <Card className="h-full overflow-hidden">
                    <div className="relative h-52">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-sm text-muted">
                          No image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white font-semibold">
                        {p.name}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-sm text-muted line-clamp-2">
                        {p.shortDescription ||
                          "Premium Ayurvedic formulation."}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[color:var(--brand-accent)]">
                          ₹{p.price}
                        </span>
                        <span className="font-semibold text-[color:var(--brand-accent)] transition group-hover:translate-x-1">
                          View →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-muted">
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
                    <PageButton
                      key={p}
                      href={`/products?page=${p}`}
                      active={p === page}
                    >
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
