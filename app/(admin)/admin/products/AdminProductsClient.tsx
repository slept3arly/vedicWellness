"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

/* ICONS */
import {
  Search,
  Trash2,
  Pencil,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X,
  Plus,
  RefreshCw,
  Hash,
  IndianRupee,
  Package,
  Boxes,
  Barcode,
} from "lucide-react";

/* COMPONENTS */
import AdminCard from "@/components/admin/AdminCard";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminButton from "@/components/admin/AdminButton";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPagination from "@/components/admin/AdminPagination";
import PageHeader from "@/components/public/ui/PageHeader";

/* UTILS */
import { cn } from "@/lib/cn";
import { deleteProduct, toggleProductPublished } from "./serverActions";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

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
  products = [],
  total,
  page,
  q,
}: {
  products: Product[];
  total: number;
  page: number;
  q: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);
  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  const handleSync = () => startTransition(() => router.refresh());

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const query = inputValue ? `&q=${encodeURIComponent(inputValue)}` : "";
      router.push(`/admin/products?page=${newPage}${query}`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      {/* 1. GLOBAL HEADER SYSTEM */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader
          title="Products"
          subtitle={`Manage your product catalog (${total})`}
          align="left"
          className="max-w-none m-0 p-0"
        />

        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <AdminPagination
              page={page}
              totalPages={totalPages}
              isPending={isPending}
              onPageChange={handlePageChange}
            />
            <AdminButton
              onClick={handleSync}
              disabled={isPending}
              icon={({ className }) => (
                <RefreshCw className={cn(className, isPending && "animate-spin")} />
              )}
            >
              Sync
            </AdminButton>
          </div>
          <Link href="/admin/products/new" className="w-full lg:w-auto">
            <AdminButton variant="primary" icon={Plus} className="w-full sm:min-w-[215px]">
              New Product
            </AdminButton>
          </Link>
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      {/* 2. SEARCH SYSTEM */}
      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by name, tag, or medicine form..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputValue && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 cursor-pointer hover:text-red-500"
                onClick={() => {
                  setInputValue("");
                  router.push("/admin/products?page=1");
                }}
              />
            )}
          </div>
          <AdminButton type="submit" icon={Search}>
            Filter
          </AdminButton>
        </form>
      </AdminCard>

      {/* 3. GLOBAL GRID SYSTEM (3-COLUMN LAYOUT) */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {products.map((p, idx) => {
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard
              key={p.id}
              compact
              index={displayIndex}
              className="group flex flex-col h-full border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-all"
            >
              {/* Status & Category/Tag */}
              <div className="flex justify-between items-start mb-3">
                <AdminBadge status={p.published ? "ACTIVE" : "INACTIVE"} />
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-neutral-400">
                  <Tag className="h-2.5 w-2.5" /> {p.tag || "General"}
                </div>
              </div>

              {/* Product Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-4 shrink-0">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 text-neutral-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <h3 className="font-bold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
                  {p.name}
                </h3>

                <div className="space-y-1.5 border-l-2 border-neutral-100 dark:border-neutral-800 pl-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-900 dark:text-neutral-100 font-bold">
                    <IndianRupee className="h-3 w-3" /> {formatCurrency(p.price, p.currency)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Package className="h-3 w-3" /> {p.stock} in stock
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Boxes className="h-3 w-3" /> {p.medicineForm || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono italic">
                    <Barcode className="h-3 w-3" /> {(p as any).sku || "No SKU"}
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="pt-4 mt-auto border-t border-neutral-100 dark:border-neutral-800/50 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/admin/products/edit/${p.id}`}>
                    <AdminButton icon={Pencil} className="w-full text-[11px]">
                      Edit
                    </AdminButton>
                  </Link>
                  <form action={toggleProductPublished} className="w-full">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="published" value={String(p.published)} />
                    <AdminActionButton variant="ghost" className="w-full text-[11px]">
                      {p.published ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 mr-1" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 mr-1" /> Show
                        </>
                      )}
                    </AdminActionButton>
                  </form>
                </div>
                <form
                  action={deleteProduct}
                  className="w-full"
                  onSubmit={(e) => !confirm("Delete this product?") && e.preventDefault()}
                >
                  <input type="hidden" name="id" value={p.id} />
                  <AdminActionButton variant="danger" icon={Trash2} className="w-full text-[11px]">
                    Delete Product
                  </AdminActionButton>
                </form>
              </div>

              {/* Footer ID */}
              <div className="flex items-center text-[9px] text-neutral-400 font-mono pt-3 opacity-60">
                <Hash className="h-2.5 w-2.5 mr-1" />
                <span className="select-all">{p.id.slice(-12)}</span>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {products.length === 0 && (
        <AdminCard className="py-24 flex flex-col items-center justify-center text-center">
          <Package className="h-10 w-10 text-neutral-300 mb-4" />
          <h3 className="text-lg font-bold">No products found</h3>
          <p className="text-neutral-500 text-sm max-w-xs mx-auto">
            {q ? `No results for "${q}"` : "Get started by adding your first product."}
          </p>
        </AdminCard>
      )}
    </div>
  );
}