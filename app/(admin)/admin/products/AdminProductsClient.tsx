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
import PageHeader from "@/components/public/ui/PageHeader";
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
        <PageHeader 
          title="Products" 
          subtitle="Manage your product catalog" 
        />
        <Link href="/admin/products/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            Add Product
          </AdminButton>
        </Link>
      </div>

      {/* ── Search bar ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleFilter} className="flex flex-col gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              name="query"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by name, tag, form..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
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

          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 h-10">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <select
                name="sort"
                defaultValue="newest"
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className="bg-transparent w-full text-sm outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="name_asc">Name A→Z</option>
                <option value="name_desc">Name Z→A</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              <Search className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>
        </form>

        <div className="mt-2 text-[10px] uppercase tracking-wider text-neutral-400 flex justify-between px-0.5 font-bold">
          <span>
            {products.length} {products.length === 1 ? "Product" : "Products"} Found
            {q && <> for "{q}"</>}
          </span>
          <span>Page {page}</span>
        </div>
      </AdminCard>

      {/* ── Product List ── */}
      <div className={`space-y-3 transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {products.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <Search className="h-8 w-8 text-neutral-300" />
            <p className="font-semibold text-neutral-500">No products found</p>
            <button onClick={handleClear} className="text-sm text-blue-500 underline underline-offset-2">
              Clear all filters
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
                  <span className="text-xs text-neutral-400 tabular-nums w-5 text-center font-medium">
                    {(page - 1) * 12 + index + 1}
                  </span>
                  <div className="relative w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* ── Middle: info ── */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-xl font-semibold leading-snug">{p.name}</h3>
                      <AdminBadge status={p.published ? "ACTIVE" : "INACTIVE"} />
                    </div>
                    {p.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 italic">{p.subtitle}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                    <Meta label="Price">
                      <IndianRupee className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-bold">{formatCurrency(p.price, p.currency)}</span>
                      {p.compareAtPrice && (
                        <span className="text-neutral-400 line-through text-[10px] ml-0.5">
                          {formatCurrency(p.compareAtPrice, p.currency)}
                        </span>
                      )}
                    </Meta>
                    <Meta label="In Stock">
                      <Package className="h-3.5 w-3.5 shrink-0" />
                      <span className={p.stock === 0 ? "text-red-500 font-bold" : "font-medium"}>{p.stock} units</span>
                    </Meta>
                    <Meta label="Tag">
                      <Tag className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.tag || "—"}</span>
                    </Meta>
                    <Meta label="Medicine Form">
                      <Boxes className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{p.medicineForm || "—"}</span>
                    </Meta>
                    <Meta label="SKU Reference">
                      <Barcode className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate font-mono text-xs">{(p as any).sku || "—"}</span>
                    </Meta>
                    <Meta label="Media">
                      <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{galleryCount + (p.imageUrl ? 1 : 0)} Total</span>
                    </Meta>
                    <Meta label="Registered">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatDate(p.createdAt)}</span>
                    </Meta>
                  </div>
                </div>

                {/* ── Right: actions ── */}
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 shrink-0 sm:min-w-[140px]">
                  <AdminButton
                    className="w-full justify-center"
                    onClick={() => startTransition(() => router.push(`/admin/products/edit/${p.id}`))}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Details
                  </AdminButton>

                  <form action={toggleProductPublished} className="w-full">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="published" value={String(p.published)} />
                    <AdminActionButton className="w-full justify-center">
                      {p.published
                        ? <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                        : <><Eye className="h-3.5 w-3.5" /> Publish Now</>
                      }
                    </AdminActionButton>
                  </form>

                  <form
                    action={deleteProduct}
                    className="col-span-2 sm:col-span-1"
                    onSubmit={(e) => { if (!confirm("Are you sure? This will permanently delete the product and its media.")) e.preventDefault(); }}
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
      <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">
        {label}
      </div>
      <div className="flex items-center gap-1 text-sm text-neutral-800 dark:text-neutral-100 min-w-0">
        {children}
      </div>
    </div>
  );
}