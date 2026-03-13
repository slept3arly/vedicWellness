"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
} from "lucide-react";

import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminBadge from "@/components/admin/AdminBadge";
import PageHeader from "@/components/public/ui/PageHeader";

import { deleteBanner, toggleBanner } from "./serverActions";

export default function AdminBannersClient({
  banners,
  page,
  q,
}: {
  banners: any[];
  page: number;
  q: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <PageHeader title="Banners" subtitle="Manage popup banners" />

        <Link href="/admin/banners/new">
          <AdminButton>
            <Plus className="h-4 w-4" />
            New Banner
          </AdminButton>
        </Link>
      </div>

      {/* Banner List */}
      <div className={`space-y-3 ${isPending ? "opacity-50" : ""}`}>
        {banners.length === 0 ? (
          <AdminCard className="py-16 text-center">
            <p className="text-neutral-500">No banners found.</p>
          </AdminCard>
        ) : (
          banners.map((b: any) => (
            <AdminCard
              key={b.id}
              className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            >

              {/* Banner Preview */}
              <div className="flex items-center gap-3 flex-1 min-w-0">

                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  {b.imageUrl ? (
                    <img
                      src={b.imageUrl}
                      alt="banner"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-neutral-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold truncate">
                      {b.title || "Image Banner"}
                    </h3>

                    <AdminBadge
                      status={b.isActive ? "ACTIVE" : "INACTIVE"}
                    />
                  </div>

                  <p className="text-xs opacity-70 truncate">
                    {b.type}
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 sm:flex gap-2">

                <AdminButton
                  onClick={() =>
                    startTransition(() =>
                      router.push(`/admin/banners/edit/${b.id}`)
                    )
                  }
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </AdminButton>

                <form action={toggleBanner}>
                  <input type="hidden" name="id" value={b.id} />
                  <AdminActionButton>
                    {b.isActive ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Activate
                      </>
                    )}
                  </AdminActionButton>
                </form>

                <form
                  action={deleteBanner}
                  onSubmit={(e) => {
                    if (!confirm("Delete this banner permanently?"))
                      e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={b.id} />

                  <AdminActionButton variant="danger">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </AdminActionButton>
                </form>

              </div>

            </AdminCard>
          ))
        )}
      </div>

    </div>
  );
}