"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Phone,
  MapPin,
  RefreshCw,
  Hash,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminSearchFilters, {
  type AdminFilterValues,
} from "@/components/admin/AdminSearchFilters";
import PageHeader from "@/components/public/ui/PageHeader";

import { cn } from "@/lib/cn";
import { ADMIN_PAGE_SIZE } from "@/lib/constants";

function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(d));
  } catch {
    return "—";
  }
}

export default function AdminLeadsClient({
  leads = [],
  total,
  q,
  page,
  from,
  to,
  status,
  statusOptions,
}: {
  leads: any[];
  total: number;
  q: string;
  page: number;
  from: string;
  to: string;
  status: string;
  statusOptions: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(q);
  const [filters, setFilters] = useState<AdminFilterValues>({
    from,
    to,
    status,
    secondary: "",
    tertiary: "",
  });

  const totalPages = Math.ceil(total / ADMIN_PAGE_SIZE);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  useEffect(() => {
    setFilters({
      from,
      to,
      status,
      secondary: "",
      tertiary: "",
    });
  }, [from, to, status]);

  const handleSync = () => startTransition(() => router.refresh());

  const navigateTo = (
    nextPage: number,
    nextQuery = inputValue,
    nextFilters = filters
  ) => {
    const params = new URLSearchParams();
    const query = nextQuery.trim();

    params.set("page", String(nextPage));

    if (query) params.set("q", query);
    if (nextFilters.from) params.set("from", nextFilters.from);
    if (nextFilters.to) params.set("to", nextFilters.to);
    if (nextFilters.status) params.set("status", nextFilters.status);

    startTransition(() => {
      router.push(`/admin/leads?${params.toString()}`);
    });
  };

  const handlePageChange = (newPage: number) => navigateTo(newPage);

  const handleClear = () => {
    setInputValue("");
    navigateTo(1, "", filters);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
        <PageHeader
          title="Leads"
          subtitle={`Manage inquiries (${total})`}
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
        </div>
      </div>

      <hr className="border-neutral-200 dark:border-neutral-800" />

      <AdminCard compact className="!p-3 border-dashed bg-neutral-50/50 dark:bg-neutral-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(1);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search by Name or Email..."
              className="h-10 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <AdminButton
            type="submit"
            variant="secondary"
            icon={Search}
            iconOnly
            disabled={isPending}
            aria-label="Search leads"
            className="h-10 w-10 min-w-[40px] rounded-lg px-0"
          />
          <AdminSearchFilters
            value={filters}
            statusOptions={statusOptions}
            disabled={isPending}
            onApply={(nextFilters) => {
              setFilters(nextFilters);
              navigateTo(1, inputValue, nextFilters);
            }}
            onClear={() => {
              const clearedFilters = {
                from: "",
                to: "",
                status: "",
                secondary: "",
                tertiary: "",
              };

              setFilters(clearedFilters);
              navigateTo(1, inputValue, clearedFilters);
            }}
          />
        </form>
      </AdminCard>

      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", isPending && "opacity-50 pointer-events-none")}>
        {leads.map((lead, idx) => {
          const displayIndex = (page - 1) * ADMIN_PAGE_SIZE + (idx + 1);

          return (
            <AdminCard
              key={lead.id}
              compact
              index={displayIndex}
              className="group flex flex-col border-t-4 border-t-neutral-200 dark:border-t-neutral-700 hover:border-t-primary/50 transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <AdminBadge status={lead.status} />
                <span className="text-[10px] font-mono text-neutral-400">{formatDate(lead.createdAt)}</span>
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-sm truncate">{lead.name}</h3>
                <p className="text-xs text-neutral-500 truncate">{lead.email}</p>
              </div>

              <div className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <MessageSquare className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-3 leading-relaxed">{lead.message || "No message provided."}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/50 space-y-2 text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{lead.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{lead.city || "No city"}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/50 flex justify-between items-center gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] uppercase font-bold text-neutral-400">ID</span>
                  <span className="text-sm font-black flex items-center gap-1.5 truncate">
                    <Hash className="h-3 w-3 text-neutral-400 shrink-0" />
                    <span className="uppercase truncate">{lead.id.slice(-12)}</span>
                  </span>
                </div>
                <AdminButton
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  variant="secondary"
                  className="h-8 px-3 text-xs"
                  icon={ChevronRight}
                >
                  Details
                </AdminButton>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
