"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

import {
  Search,
  Trash2,
  Pencil,
  Calendar,
  Tag,
  Image as ImageIcon,
  IndianRupee,
  Eye,
  EyeOff,
  Boxes,
  Package,
  X,
  Plus,
  ArrowUpDown,
  Barcode,
} from "lucide-react";

import AdminCard from "../../../../components/admin/AdminCard";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminButton from "../../../../components/admin/AdminButton";
import AdminBadge from "../../../../components/admin/AdminBadge";
import { deleteProduct, toggleProductPublished } from "./serverActions";

/* ------------------------------------------------------------------ */

function formatDate(d?: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ------------------------------------------------------------------ */

export default function AdminProductsClient({
  products,
  q,
  page,
}: {
  products: Product[];
  q: string;
  page: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const query = (fd.get("query") as string).trim();
    const p = new URLSearchParams();
    p.set("page", "1");
    if (query) p.set("q", query);
    startTransition(() => router.push(`?${p.toString()}`));
  }

  const handleClear = () => {
    setInputValue("");
    startTransition(() => router.push("?page=1"));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-neutral-500">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add Product
          </AdminButton>
        </Link>
      </div>

      {/* ── Search bar — 2-row grid ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleFilter} className="flex flex-col gap-2">

          {/* Row 1: search input full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              name="query"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by name, tag, form..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm focus:ring-2 focus:ring-black outline-none"
            />
            {(inputValue || q) && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Row 2: sort + search button */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 h-10">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <select
                name="sort"
                defaultValue="newest"
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className="bg-transparent w-full text-sm outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="name_asc">Name A→Z</option>
                <option value="name_desc">Name Z→A</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </div>

        </form>

        <div className="mt-2 text-xs text-neutral-400 flex justify-between px-0.5">
          <span>
            {products.length} result{products.length !== 1 ? "s" : ""}
            {q && <> for "<span className="text-neutral-600 dark:text-neutral-300 font-medium">{q}</span>"</>}
          </span>
          <span>Page {page}</span>
        </div>
      </AdminCard>

      {/* ── Product List ── */}
      <div className={`space-y-3 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {products.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <Search className="h-8 w-8 text-neutral-300" />
            <p className="font-medium text-neutral-500">No products found</p>
            <button onClick={handleClear} className="text-sm text-neutral-400 underline underline-offset-2 hover:text-black dark:hover:text-white">
              Clear search
            </button>
          </AdminCard>
        ) : (
          products.map((p, index) => {
            const galleryCount = Array.isArray(p.gallery) ? p.gallery.length : 0;

            return (
              <AdminCard
                key={p.id}
                className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {/* ── Left: index + image ── */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                  <span className="text-xs text-neutral-400 tabular-nums w-5 text-center">
                    {(page - 1) * 12 + index + 1}
                  </span>
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.name} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* ── Middle: info + meta ── */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-base leading-snug">{p.name}</h2>
                      <AdminBadge status={p.published ? "ACTIVE" : "INACTIVE"} />
                    </div>
                    {p.subtitle && (
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{p.subtitle}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                    <Meta label="Price">
                      <IndianRupee className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatCurrency(p.price, p.currency)}</span>
                      {p.compareAtPrice && (
                        <span className="text-neutral-400 line-through text-xs ml-0.5">
                          {formatCurrency(p.compareAtPrice, p.currency)}
                        </span>
                      )}
                    </Meta>
                    <Meta label="Stock">
                      <Package className="h-3.5 w-3.5 shrink-0" />
                      <span className={p.stock === 0 ? "text-red-500 font-semibold" : ""}>{p.stock}</span>
                    </Meta>
                    <Meta label="Tag">
                      <Tag className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.tag || "—"}</span>
                    </Meta>
                    <Meta label="Form">
                      <Boxes className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.medicineForm || "—"}</span>
                    </Meta>
                    <Meta label="SKU">
                      <Barcode className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate font-mono">{(p as any).sku || "—"}</span>
                    </Meta>
                    <Meta label="Gallery">
                      <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{galleryCount} image{galleryCount !== 1 ? "s" : ""}</span>
                    </Meta>
                    <Meta label="Added">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatDate(p.createdAt)}</span>
                    </Meta>
                  </div>
                </div>

                {/* ── Right: actions — 2×2 mobile, column desktop ── */}
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 sm:min-w-[140px]">
                  <AdminButton
                    className="w-full justify-center"
                    onClick={() => startTransition(() => router.push(`/admin/products/edit/${p.id}`))}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </AdminButton>

                  <form action={toggleProductPublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="published" value={String(p.published)} />
                    <AdminActionButton className="w-full justify-center">
                      {p.published
                        ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                        : <><Eye className="h-3.5 w-3.5" /> Publish</>
                      }
                    </AdminActionButton>
                  </form>

                  <form
                    action={deleteProduct}
                    className="col-span-2 sm:col-span-1"
                    onSubmit={(e) => { if (!confirm("Delete this product permanently?")) e.preventDefault(); }}
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <AdminActionButton variant="danger" className="w-full justify-center">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </AdminActionButton>
                  </form>
                </div>

              </AdminCard>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400 font-medium mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1 text-sm text-neutral-800 dark:text-neutral-100 min-w-0">
        {children}
      </div>
    </div>
  );
}