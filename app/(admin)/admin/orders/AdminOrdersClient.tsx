"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  IndianRupee,
  User,
} from "lucide-react";

import AdminCard from "@/components/admin/AdminCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminButton from "@/components/admin/AdminButton";
import PageHeader from "@/components/public/ui/PageHeader";

/* ------------------------------------------------------------------ */

function formatDate(d?: Date | string | null) {
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

export default function AdminOrdersClient({
  orders,
  total,
  q,
  page,
}: {
  orders: any[];
  total: number;
  q: string;
  page: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);

  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  /* --------------------------------------------------------------- */
  /* Search                                                          */
  /* --------------------------------------------------------------- */

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

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    p.set("page", newPage.toString());

    startTransition(() => router.push(`?${p.toString()}`));
  };

  /* --------------------------------------------------------------- */

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* ── Header ── */}
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders"
      />

      {/* ── Search ── */}
      <AdminCard className="p-3">
        <form onSubmit={handleFilter} className="flex flex-col gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />

            <input
              name="query"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by order ID, email, phone..."
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

          <div className="flex justify-between text-[10px] uppercase tracking-wider text-neutral-400 px-0.5 font-bold">
            <span>
              {total} {total === 1 ? "Order" : "Orders"}
              {q && <> for "{q}"</>}
            </span>
            <span>
              Page {page} of {totalPages || 1}
            </span>
          </div>
        </form>
      </AdminCard>

      {/* ── Orders List ── */}
      <div
        className={`space-y-3 transition-opacity duration-200 ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {orders.length === 0 ? (
          <AdminCard className="py-16 flex flex-col items-center gap-2">
            <Package className="h-8 w-8 text-neutral-300" />
            <p className="font-semibold text-neutral-500">
              No orders found
            </p>
            <button
              onClick={handleClear}
              className="text-sm text-blue-500 underline underline-offset-2"
            >
              Clear filters
            </button>
          </AdminCard>
        ) : (
          orders.map((order, index) => {
            const itemPreview = order.items || [];
            const totalItems = order._count?.items || 0;

            return (
              <AdminCard
                key={order.id}
                className="flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
              >
                {/* LEFT */}
                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 shrink-0">
                  <span className="text-xs text-neutral-400 tabular-nums w-6 text-center font-medium">
                    {(page - 1) * LIMIT + index + 1}
                  </span>
                </div>

                {/* MIDDLE */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Order Info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-mono text-sm font-semibold">
                        {order.id}
                      </h3>
                      <AdminBadge status={order.status} />
                    </div>

                    <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {order.user?.email || "Guest"}
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="text-sm text-neutral-700 dark:text-neutral-300">
                    {itemPreview.map((item: any, i: number) => (
                      <div key={i}>
                        {item.productName} × {item.quantity}
                      </div>
                    ))}

                    {totalItems > itemPreview.length && (
                      <div className="text-xs text-neutral-400">
                        +{totalItems - itemPreview.length} more
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-6 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {formatCurrency(order.totalAmount, order.currency)}
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* RIGHT (Actions later) */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <AdminButton className="w-full justify-center" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                    View
                  </AdminButton>

                  {/* Placeholder for next step */}
                </div>
              </AdminCard>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6 pb-12">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{page}</span>
            <span className="text-sm text-neutral-400">/</span>
            <span className="text-sm text-neutral-400">
              {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || isPending}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}